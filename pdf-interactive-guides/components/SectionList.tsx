import type { Section } from "@/lib/types";

type SectionListProps = {
  sections: Section[];
  activeId?: string;
  onSelect: (section: Section) => void;
};

export default function SectionList({ sections, activeId, onSelect }: SectionListProps) {
  return (
    <div>
      <h3>Sections</h3>
      {sections.map((section) => (
        <div
          key={section.id}
          className={`section-item ${section.id === activeId ? "active" : ""}`}
          onClick={() => onSelect(section)}
        >
          <strong>{section.title}</strong>
          <div className="muted">Page {section.pageIndex + 1}</div>
          {section.draftSteps ? <span className="badge-draft">Draft</span> : null}
        </div>
      ))}
    </div>
  );
}
