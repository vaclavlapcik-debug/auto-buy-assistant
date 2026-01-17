import { useEffect, useRef, useState } from "react";
import type { BoundingBox } from "@/lib/types";

const MIN_DRAG = 8;

type PdfViewerProps = {
  pdf: any;
  pageIndex: number;
  bbox?: BoundingBox;
  onBBoxChange?: (bbox?: BoundingBox) => void;
};

export default function PdfViewer({ pdf, pageIndex, bbox, onBBoxChange }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [draftBox, setDraftBox] = useState<BoundingBox | null>(null);

  useEffect(() => {
    let canceled = false;
    const renderPage = async () => {
      if (!pdf) return;
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setViewportSize({ width: viewport.width, height: viewport.height });
      const renderTask = page.render({ canvasContext: context, viewport });
      await renderTask.promise;
      if (canceled) return;
    };
    renderPage();
    return () => {
      canceled = true;
    };
  }, [pdf, pageIndex]);

  const handlePointerDown = (event: React.MouseEvent) => {
    if (!onBBoxChange || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handlePointerMove = (event: React.MouseEvent) => {
    if (!dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const width = current.x - dragStart.x;
    const height = current.y - dragStart.y;
    setDraftBox({
      x: dragStart.x / rect.width,
      y: dragStart.y / rect.height,
      width: width / rect.width,
      height: height / rect.height,
    });
  };

  const handlePointerUp = () => {
    if (!draftBox || !onBBoxChange) {
      setDragStart(null);
      return;
    }
    if (Math.abs(draftBox.width) < MIN_DRAG / viewportSize.width) {
      setDraftBox(null);
      setDragStart(null);
      return;
    }
    const normalized = normalizeBox(draftBox);
    onBBoxChange(normalized);
    setDraftBox(null);
    setDragStart(null);
  };

  const activeBox = draftBox ?? bbox;

  return (
    <div
      ref={containerRef}
      className="viewer"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      {activeBox ? (
        <div
          className="highlight"
          style={{
            left: `${activeBox.x * 100}%`,
            top: `${activeBox.y * 100}%`,
            width: `${activeBox.width * 100}%`,
            height: `${activeBox.height * 100}%`,
          }}
        />
      ) : null}
    </div>
  );
}

function normalizeBox(box: BoundingBox): BoundingBox {
  const x = Math.min(box.x, box.x + box.width);
  const y = Math.min(box.y, box.y + box.height);
  const width = Math.abs(box.width);
  const height = Math.abs(box.height);
  return { x, y, width, height };
}
