import { useState, useEffect, useRef } from "react";
import type { WorkoutSet } from "../types";
import "./SetRow.css";

interface SetRowProps {
  set: WorkoutSet;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SetRow({ set, onUpdate, onRemove, canRemove }: SetRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = () => {
    if (canRemove) {
      onRemove();
      setMenuOpen(false);
    }
  };

  return (
    <div className={`set-row ${set.completed ? "completed" : ""}`}>
      <div className="set-menu" ref={menuRef}>
        <button
          className="set-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Set options"
          aria-expanded={menuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
        {menuOpen && (
          <div className="set-menu-dropdown">
            <button className="set-menu-item danger" onClick={handleDelete} disabled={!canRemove}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Delete set
            </button>
          </div>
        )}
      </div>
      <div className="set-weight">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={set.weight || ""}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            onUpdate({ weight: value >= 0 ? value : 0 });
          }}
          placeholder="lbs"
          disabled={set.completed}
        />
      </div>
      <div className="set-reps">
        <input
          type="number"
          inputMode="numeric"
          min="0"
          value={set.reps || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            onUpdate({ reps: value >= 0 ? value : 0 });
          }}
          placeholder="0"
          disabled={set.completed}
        />
      </div>
      <div className="set-done">
        <button
          className={`checkbox ${set.completed ? "checked" : ""}`}
          onClick={() => onUpdate({ completed: !set.completed })}
          aria-label={set.completed ? "Mark incomplete" : "Mark complete"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
