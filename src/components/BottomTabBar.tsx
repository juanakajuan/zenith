import { useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Dumbbell, LayoutTemplate, CirclePlay, History, CircleEllipsis } from "lucide-react";

import "./BottomTabBar.css";

export function BottomTabBar() {
  const location = useLocation();
  const lastTemplatesPath = useRef("/templates");

  const isTemplatesActive = location.pathname.startsWith("/templates");

  // Remember the last templates path when we're on a templates route
  if (isTemplatesActive) {
    lastTemplatesPath.current = location.pathname;
  }

  return (
    <nav className="bottom-tab-bar">
      <NavLink to="/exercises" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <Dumbbell size={24} />
        <span>Exercises</span>
      </NavLink>

      <NavLink
        to={lastTemplatesPath.current}
        className={() => `tab ${isTemplatesActive ? "active" : ""}`}
      >
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
