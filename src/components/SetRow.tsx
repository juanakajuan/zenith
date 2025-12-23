import type { WorkoutSet } from "../types";
import "./SetRow.css";

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove?: () => void;
}

export function SetRow({ set, setNumber, onUpdate, onRemove }: SetRowProps) {
  return (
    <div className={`set-row ${set.completed ? "completed" : ""}`}>
      <div className="set-number">
        {onRemove ? (
          <button className="remove-set-btn" onClick={onRemove} aria-label="Remove set">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        ) : (
          setNumber
        )}
      </div>
      <div className="set-weight">
        <input
          type="number"
          inputMode="decimal"
          value={set.weight || ""}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <span className="unit">lbs</span>
      </div>
      <div className="set-reps">
        <input
          type="number"
          inputMode="numeric"
          value={set.reps || ""}
          onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
          placeholder="0"
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
