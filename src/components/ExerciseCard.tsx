import type { Exercise } from "../types";
import { exerciseTypeLabels } from "../types";
import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
  isDefault?: boolean;
}

export function ExerciseCard({ exercise, onEdit, onDelete, isDefault = false }: ExerciseCardProps) {
  return (
    <div className="exercise-card card" onClick={isDefault ? undefined : onEdit}>
      <div className="exercise-card-header">
        <h3 className="exercise-name">{exercise.name}</h3>
        {!isDefault && (
          <button
            className="btn btn-icon btn-ghost delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete exercise"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          </button>
        )}
      </div>
      <div className="exercise-card-meta">
        <span className="tag tag-muted">{exerciseTypeLabels[exercise.exerciseType]}</span>
        {isDefault && <span className="tag tag-default">Default</span>}
      </div>
      {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
    </div>
  );
}
