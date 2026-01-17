import { useMemo, useState } from "react";
import JSZip from "jszip";
import type { Manifest } from "@/lib/types";

export default function ExportPanel({
  manifest,
  pdfBlob,
}: {
  manifest: Manifest;
  pdfBlob?: Blob | null;
}) {
  const [status, setStatus] = useState<string>("");
  const iframeSnippet = useMemo(() => {
    return `<iframe src="/embed/index.html" style="width:100%;height:640px;border:0" title="${manifest.title}"></iframe>`;
  }, [manifest.title]);

  const scriptSnippet = useMemo(() => {
    return `<!-- PDF Interactive Guide -->\n<div id="pdf-guide"></div>\n<script src="/embed/embed.js"></script>`;
  }, []);

  const markdownExport = useMemo(() => {
    return manifest.sections
      .map((section) => {
        const steps = section.steps?.map((step) => `  - ${step.text}`).join("\n") ?? "";
        return `## ${section.title}\nPage: ${section.pageIndex + 1}\n${steps}`;
      })
      .join("\n\n");
  }, [manifest.sections]);

  const downloadZip = async () => {
    const zip = new JSZip();
    const embedFolder = zip.folder("embed");
    if (!embedFolder) return;
    embedFolder.file(
      "index.html",
      `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8" />\n<title>${manifest.title}</title>\n<link rel="stylesheet" href="embed.css" />\n</head>\n<body>\n<div id="pdf-guide"></div>\n<script src="embed.js"></script>\n</body>\n</html>`,
    );
    embedFolder.file(
      "embed.js",
      `fetch('manifest.json').then(r=>r.json()).then((manifest)=>{\nconst root=document.getElementById('pdf-guide');\nroot.innerHTML='<h2>'+manifest.title+'</h2><p>Interactive guide embedded.</p>';\n});`,
    );
    embedFolder.file(
      "embed.css",
      "body{font-family:system-ui, sans-serif;margin:0;padding:16px;background:#f6f7fb;color:#1b1f2a;}#pdf-guide{background:#fff;padding:16px;border-radius:12px;}",
    );
    embedFolder.file("manifest.json", JSON.stringify(manifest, null, 2));
    embedFolder.file(
      "README-embed.txt",
      "Drop the embed folder on any static hosting or use the iframe snippet to embed.",
    );
    if (pdfBlob) {
      embedFolder.file("document.pdf", pdfBlob);
    }

    setStatus("Building ZIP...");
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-guide-embed.zip";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("ZIP downloaded.");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownExport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-guide.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel">
      <h3>Export for e-shop / CMS</h3>
      <div className="export-grid">
        <div className="export-card">
          <strong>Iframe embed</strong>
          <pre>{iframeSnippet}</pre>
        </div>
        <div className="export-card">
          <strong>Script embed</strong>
          <pre>{scriptSnippet}</pre>
        </div>
        <div className="export-card">
          <strong>ZIP embed package</strong>
          <p className="muted">Includes embed assets and optional PDF bundle.</p>
          <button onClick={downloadZip}>Download ZIP</button>
        </div>
        <div className="export-card">
          <strong>Markdown export</strong>
          <button className="secondary" onClick={downloadMarkdown}>
            Download Markdown
          </button>
        </div>
      </div>
      {status ? <p className="muted">{status}</p> : null}
    </div>
  );
}
