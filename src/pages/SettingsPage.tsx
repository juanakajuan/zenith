import { Settings } from "lucide-react";
import "./SettingsPage.css";

export function SettingsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <div className="empty-state">
        <Settings size={48} strokeWidth={1.5} />
        <p>Settings coming soon.</p>
        <p className="hint">Configuration options will appear here.</p>
      </div>
    </div>
  );
}
