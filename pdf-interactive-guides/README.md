# PDF Interactive Guides

A standalone, browser-only application that converts PDF manuals into interactive, step-by-step guides. Everything runs in the browser — no server-side PDF processing, no local installation required.

## Features

- Drag & drop PDF upload with in-browser PDF.js rendering.
- Automatic segmentation strategies (outline, TOC, headings, per-page fallback).
- Multi-language detection and filtering via language ranges.
- Interactive guides with steps and optional highlighted page areas.
- Edit mode for renaming sections, editing steps, and drawing highlights.
- Quick calibrate wizard for TOC offsets and language ranges.
- Export options for e-shop or CMS embedding (iframe, script, ZIP, Markdown).

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser and upload a PDF manual.

## How it works

1. Upload a PDF (drag & drop or file picker).
2. The app analyzes the PDF for outlines/TOC/headings and builds sections.
3. Click a section to preview the PDF page and steps.
4. Use **Edit mode** to adjust titles, pages, steps, and draw highlight boxes.
5. Use **Export** to generate iframe/script snippets, ZIP embed packages, or Markdown.

## Export options for e-shops

- **Iframe embed**: Copy the iframe snippet from the Export panel into your product page.
- **Script embed**: Add the provided `<div>` + `embed.js` script for richer control.
- **ZIP embed package**: Download a fully offline package (HTML/CSS/JS/manifest/PDF).
- **Markdown export**: Use for CMSs or documentation tools like Obsidian.

## Limitations

- Scanned PDFs without text layers cannot be automatically segmented or drafted.
- Draft steps are generated from the PDF text layer and may require editing.
- Highlight detection uses manual selection in edit mode.

## Definition of Done

See [`docs/DoD.md`](docs/DoD.md).
