import type { LanguageRange } from "@/lib/types";

type ToolbarProps = {
  onUploadClick: () => void;
  onExportClick: () => void;
  onExportShopClick: () => void;
  onCalibrateClick: () => void;
  onToggleEdit: () => void;
  editMode: boolean;
  languages?: LanguageRange[];
  selectedLanguage?: string;
  onLanguageChange: (code: string) => void;
};

export default function Toolbar({
  onUploadClick,
  onExportClick,
  onExportShopClick,
  onCalibrateClick,
  onToggleEdit,
  editMode,
  languages,
  selectedLanguage,
  onLanguageChange,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={onUploadClick}>Upload PDF</button>
      <button className="secondary" onClick={onCalibrateClick}>
        Calibrate
      </button>
      <button className="secondary" onClick={onToggleEdit}>
        {editMode ? "Exit edit" : "Edit mode"}
      </button>
      <button className="secondary" onClick={onExportClick}>
        Export
      </button>
      <button onClick={onExportShopClick}>Export for e-shop</button>
      <div style={{ marginLeft: "auto" }}>
        {languages?.length ? (
          <select
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            <option value="all">All languages</option>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="muted">Auto language</span>
        )}
      </div>
    </div>
  );
}
