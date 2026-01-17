import { useState } from "react";
import type { Calibration, LanguageRange } from "@/lib/types";

export default function CalibrateModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (calibration: Calibration) => void;
}) {
  const [scenario, setScenario] = useState<Calibration["scenario"]>("toc");
  const [referencePage, setReferencePage] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const [languageRanges, setLanguageRanges] = useState<LanguageRange[]>([]);

  const addLanguageRange = () => {
    setLanguageRanges((current) => [
      ...current,
      { code: "EN", label: "English", fromPage: 0, toPage: 0 },
    ]);
  };

  return (
    <div className="panel" style={{ borderColor: "#c7d2fe" }}>
      <h3>Quick calibrate</h3>
      <p className="muted">
        Select a scenario and provide a reference page to improve TOC parsing or
        multi-language splitting.
      </p>
      <label>
        Scenario
        <select
          value={scenario}
          onChange={(event) => setScenario(event.target.value as Calibration["scenario"])}
          style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
        >
          <option value="toc">PDF has TOC</option>
          <option value="multi-language">PDF is multi-language</option>
          <option value="unsure">Unsure / no TOC</option>
        </select>
      </label>
      <label>
        Reference page (0-based)
        <input
          type="number"
          value={referencePage}
          onChange={(event) => setReferencePage(Number(event.target.value))}
          style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
        />
      </label>
      <label>
        Page offset (printed TOC vs PDF pages)
        <input
          type="number"
          value={pageOffset}
          onChange={(event) => setPageOffset(Number(event.target.value))}
          style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
        />
      </label>
      {scenario === "multi-language" ? (
        <div style={{ marginBottom: 12 }}>
          <h4>Language ranges</h4>
          {languageRanges.map((range, index) => (
            <div key={`${range.code}-${index}`} style={{ marginBottom: 8 }}>
              <input
                value={range.code}
                onChange={(event) => {
                  const value = event.target.value;
                  setLanguageRanges((current) =>
                    current.map((item, idx) =>
                      idx === index ? { ...item, code: value, label: value } : item,
                    ),
                  );
                }}
                style={{ width: 60, marginRight: 8 }}
              />
              <input
                type="number"
                value={range.fromPage}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setLanguageRanges((current) =>
                    current.map((item, idx) =>
                      idx === index ? { ...item, fromPage: value } : item,
                    ),
                  );
                }}
                style={{ width: 80, marginRight: 8 }}
              />
              <input
                type="number"
                value={range.toPage}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setLanguageRanges((current) =>
                    current.map((item, idx) =>
                      idx === index ? { ...item, toPage: value } : item,
                    ),
                  );
                }}
                style={{ width: 80 }}
              />
            </div>
          ))}
          <button className="secondary" onClick={addLanguageRange}>
            Add language range
          </button>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() =>
            onSave({
              scenario,
              referencePage,
              pageOffset,
              languageRanges: languageRanges.length ? languageRanges : undefined,
            })
          }
        >
          Save calibration
        </button>
        <button className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
