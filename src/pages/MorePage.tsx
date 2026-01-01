import { useNavigate } from "react-router-dom";
import { Settings, ChevronRight } from "lucide-react";

import "./MorePage.css";

export function MorePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">More</h1>
      </header>

      <div className="more-content">
        <section className="more-section">
          <button className="more-menu-item" onClick={() => navigate("/more/settings")}>
            <div className="more-menu-item-icon">
              <Settings size={20} />
            </div>
            <span className="more-menu-item-label">Settings</span>
            <ChevronRight size={20} className="more-menu-item-chevron" />
          </button>
        </section>
      </div>
    </div>
  );
}
