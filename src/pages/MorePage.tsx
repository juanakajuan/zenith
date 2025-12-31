import { CircleEllipsis } from "lucide-react";

import "./MorePage.css";

export function MorePage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">More</h1>
      </header>

      <div className="empty-state">
        <CircleEllipsis size={48} strokeWidth={1.5} />
        <p>More coming soon.</p>
      </div>
    </div>
  );
}
