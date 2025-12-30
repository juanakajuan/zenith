import { useState, useEffect, useRef } from "react";
import { MoreVertical, Trash2, Check } from "lucide-react";

import type { WorkoutSet } from "../types";

import "./SetRow.css";

interface SetRowProps {
  set: WorkoutSet;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

/**
 * Interactive row component for editing a workout set.
 * Allows editing weight, reps, marking as complete, and deleting the set.
 * Includes a dropdown menu for additional actions.
 *
 * @param props - Component props
 *
 * @remarks
 * - Inputs are disabled when the set is marked as completed
 * - Delete button only enabled when canRemove is true
 * - Handles click-outside to close the dropdown menu
 * - Validates numeric inputs to prevent negative values
 *
 * @example
 * <SetRow
 *   set={workoutSet}
 *   onUpdate={(updates) => handleUpdateSet(setId, updates)}
 *   onRemove={() => handleRemoveSet(setId)}
 *   canRemove={sets.length > 1}
 * />
 */
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
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="set-menu-dropdown">
            <button className="set-menu-item danger" onClick={handleDelete} disabled={!canRemove}>
              <Trash2 size={16} />
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
          <Check size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
