import { Settings } from "lucide-react";

import "./SettingsPage.css";

/**
 * Settings page component (placeholder).
 * Currently displays a "coming soon" message for future configuration options.
 *
 * @remarks
 * This is a placeholder page for future features such as:
 * - User preferences (units, theme, etc.)
 * - Data export/import
 * - Account settings
 * - App configuration
 */
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
