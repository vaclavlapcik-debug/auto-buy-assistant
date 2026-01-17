"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import PdfUploader from "@/components/PdfUploader";
import Toolbar from "@/components/Toolbar";
import SectionList from "@/components/SectionList";
import PdfViewer from "@/components/PdfViewer";
import StepsPanel from "@/components/StepsPanel";
import EditPanel from "@/components/EditPanel";
import CalibrateModal from "@/components/CalibrateModal";
import ExportPanel from "@/components/ExportPanel";
import { analyzePdf, generateDraftSteps, getPageText } from "@/lib/pdfAnalysis";
import { clearManifest, loadManifest, saveManifest } from "@/lib/storage";
import type { Calibration, Manifest, Section } from "@/lib/types";

const PDFJS_WORKER =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js";

export default function HomePage() {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [editMode, setEditMode] = useState(false);
  const [showCalibrate, setShowCalibrate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const existing = loadManifest();
    if (existing) {
      setManifest(existing);
      setActiveSectionId(existing.sections[0]?.id ?? null);
    }
  }, []);

  useEffect(() => {
    if (manifest) saveManifest(manifest);
  }, [manifest]);

  const filteredSections = useMemo(() => {
    if (!manifest) return [];
    if (selectedLanguage === "all") return manifest.sections;
    return manifest.sections.filter(
      (section) => section.languageCode === selectedLanguage,
    );
  }, [manifest, selectedLanguage]);

  const activeSection = useMemo(() => {
    if (!manifest) return undefined;
    return manifest.sections.find((section) => section.id === activeSectionId);
  }, [manifest, activeSectionId]);

  const handleUpload = async (file: File) => {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    setPdfDoc(pdf);
    setPdfBlob(new Blob([arrayBuffer], { type: "application/pdf" }));
    const analyzed = await analyzePdf(pdf, file.name);
    setManifest(analyzed);
    setActiveSectionId(analyzed.sections[0]?.id ?? null);
  };

  const handleSelectSection = async (section: Section) => {
    setActiveSectionId(section.id);
    if (!pdfDoc || !manifest) return;
    if (!section.steps?.length) {
      const text = await getPageText(pdfDoc, section.pageIndex);
      const steps = generateDraftSteps(text).map((text) => ({
        id: uuid(),
        text,
      }));
      const next = manifest.sections.map((item) =>
        item.id === section.id
          ? { ...item, steps, draftSteps: true }
          : item,
      );
      setManifest({ ...manifest, sections: next });
    }
  };

  const handleBBoxChange = (bbox?: Section["bbox"]) => {
    if (!manifest || !activeSection) return;
    const next = manifest.sections.map((item) =>
      item.id === activeSection.id ? { ...item, bbox } : item,
    );
    setManifest({ ...manifest, sections: next });
  };

  const handleSectionUpdate = (section: Section) => {
    if (!manifest) return;
    const next = manifest.sections.map((item) =>
      item.id === section.id ? section : item,
    );
    setManifest({ ...manifest, sections: next });
  };

  const handleCalibrationSave = async (calibration: Calibration) => {
    if (!pdfDoc) return;
    const updated = await analyzePdf(pdfDoc, manifest?.title ?? "PDF", calibration);
    setManifest(updated);
    setShowCalibrate(false);
  };

  return (
    <main>
      <header style={{ marginBottom: 16 }}>
        <h1>PDF Interactive Guides</h1>
        <p className="muted">
          Convert PDF manuals into interactive step-by-step guides directly in the
          browser.
        </p>
      </header>

      <Toolbar
        onUploadClick={() => inputRef.current?.click()}
        onExportClick={() => setShowExport((prev) => !prev)}
        onExportShopClick={() => setShowExport(true)}
        onCalibrateClick={() => setShowCalibrate((prev) => !prev)}
        onToggleEdit={() => setEditMode((prev) => !prev)}
        editMode={editMode}
        languages={manifest?.languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {!manifest ? (
        <PdfUploader onFileSelected={handleUpload} />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1fr 2fr" }}>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="panel">
              <SectionList
                sections={filteredSections}
                activeId={activeSectionId ?? undefined}
                onSelect={handleSelectSection}
              />
            </div>
            {editMode ? (
              <EditPanel section={activeSection} onChange={handleSectionUpdate} />
            ) : (
              <StepsPanel section={activeSection} />
            )}
            <div className="panel">
              <button
                className="secondary"
                onClick={() => {
                  clearManifest();
                  setManifest(null);
                  setPdfDoc(null);
                  setActiveSectionId(null);
                }}
              >
                Reset session
              </button>
            </div>
          </div>
          <div className="grid" style={{ alignContent: "start" }}>
            {pdfDoc && activeSection ? (
              <PdfViewer
                pdf={pdfDoc}
                pageIndex={activeSection.pageIndex}
                bbox={activeSection.bbox}
                onBBoxChange={editMode ? handleBBoxChange : undefined}
              />
            ) : (
              <div className="panel">Upload a PDF to preview pages.</div>
            )}
            {showCalibrate ? (
              <CalibrateModal
                onClose={() => setShowCalibrate(false)}
                onSave={handleCalibrationSave}
              />
            ) : null}
            {showExport && manifest ? (
              <ExportPanel manifest={manifest} pdfBlob={pdfBlob} />
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
