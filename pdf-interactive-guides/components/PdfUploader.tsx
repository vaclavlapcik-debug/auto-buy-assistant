import { useCallback, useRef } from "react";

type PdfUploaderProps = {
  onFileSelected: (file: File) => void;
};

export default function PdfUploader({ onFileSelected }: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file?.type === "application/pdf") {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  return (
    <div
      className="panel"
      style={{
        borderStyle: "dashed",
        textAlign: "center",
        padding: "32px",
      }}
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <h2>Drop your PDF manual here</h2>
      <p className="muted">Or click to browse files. PDF stays in the browser.</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </div>
  );
}
