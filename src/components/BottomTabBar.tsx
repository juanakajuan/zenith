import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Dumbbell, LayoutTemplate, CirclePlay, History, CircleEllipsis } from "lucide-react";

import "./BottomTabBar.css";

export function BottomTabBar() {
  const location = useLocation();

  const isTemplatesActive = location.pathname.startsWith("/templates");

  // Use functional update to derive state from current location
  const [savedTemplatesPath, setSavedTemplatesPath] = useState(() => {
    return isTemplatesActive ? location.pathname : "/templates";
  });

  // Update saved path when we're on a templates route
  if (isTemplatesActive && savedTemplatesPath !== location.pathname) {
    setSavedTemplatesPath(location.pathname);
  }

  // Use current path if active, otherwise use saved path
  const templatesPath = isTemplatesActive ? location.pathname : savedTemplatesPath;

  return (
    <nav className="bottom-tab-bar">
      <NavLink to="/exercises" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <Dumbbell size={24} />
        <span>Exercises</span>
      </NavLink>

      <NavLink to={templatesPath} className={() => `tab ${isTemplatesActive ? "active" : ""}`}>
        <LayoutTemplate size={24} />
        <span>Templates</span>
      </NavLink>

      <NavLink to="/workout" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <CirclePlay size={24} />
        <span>Workout</span>
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <History size={24} />
        <span>History</span>
      </NavLink>

      <NavLink to="/more" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <CircleEllipsis size={24} />
        <span>More</span>
      </NavLink>
    </nav>
  );
}
