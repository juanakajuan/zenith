import { NavLink } from "react-router-dom";
import { Dumbbell, CirclePlay, History, CircleEllipsis } from "lucide-react";

import "./BottomTabBar.css";

export function BottomTabBar() {
  return (
    <nav className="bottom-tab-bar">
      <NavLink to="/exercises" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
        <Dumbbell size={24} />
        <span>Exercises</span>
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
