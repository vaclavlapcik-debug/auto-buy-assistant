import { useState } from "react";
import type { Section } from "@/lib/types";

export default function EditPanel({
  section,
  onChange,
}: {
  section?: Section;
  onChange: (section: Section) => void;
}) {
  const [title, setTitle] = useState(section?.title ?? "");
  const [pageIndex, setPageIndex] = useState(section?.pageIndex ?? 0);
  const [steps, setSteps] = useState(section?.steps?.map((step) => step.text) ?? []);

  if (!section) {
    return (
      <div className="panel">
        <h3>Edit mode</h3>
        <p className="muted">Select a section to edit details.</p>
      </div>
    );
  }

  const update = () => {
    onChange({
      ...section,
      title,
      pageIndex,
      steps: steps.map((text, index) => ({
        id: section.steps?.[index]?.id ?? crypto.randomUUID(),
        text,
      })),
      draftSteps: false,
    });
  };

  return (
    <div className="panel">
      <h3>Edit section</h3>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={update}
          style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
        />
      </label>
      <label>
        Page index
        <input
          type="number"
          min={0}
          value={pageIndex}
          onChange={(event) => setPageIndex(Number(event.target.value))}
          onBlur={update}
          style={{ width: "100%", marginTop: 4, marginBottom: 8 }}
        />
      </label>
      <label>
        Steps
        <textarea
          value={steps.join("\n")}
          onChange={(event) => setSteps(event.target.value.split("\n").filter(Boolean))}
          onBlur={update}
          rows={6}
          style={{ width: "100%", marginTop: 4 }}
        />
      </label>
    </div>
  );
}
