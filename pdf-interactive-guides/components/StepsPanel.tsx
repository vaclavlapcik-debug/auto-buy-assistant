import type { Section } from "@/lib/types";

type StepsPanelProps = {
  section?: Section;
};

export default function StepsPanel({ section }: StepsPanelProps) {
  if (!section) {
    return (
      <div className="panel">
        <h3>Steps</h3>
        <p className="muted">Select a section to view instructions.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Steps</h3>
      <div className="steps">
        {section.steps?.length ? (
          section.steps.map((step, index) => (
            <div className="step-item" key={step.id}>
              <strong>{index + 1}.</strong>
              <span>{step.text}</span>
            </div>
          ))
        ) : (
          <p className="muted">No steps available.</p>
        )}
      </div>
    </div>
  );
}
