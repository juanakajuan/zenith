import { useState, useEffect } from "react";
import type { Exercise, MuscleGroup, ExerciseType } from "../types";
import "./ExerciseModal.css";

interface ExerciseModalProps {
  exercise: Exercise | null;
  onSave: (data: Omit<Exercise, "id">) => void;
  onClose: () => void;
  muscleGroups: MuscleGroup[];
  exerciseTypes: ExerciseType[];
  muscleGroupLabels: Record<MuscleGroup, string>;
  exerciseTypeLabels: Record<ExerciseType, string>;
}

export function ExerciseModal({
  exercise,
  onSave,
  onClose,
  muscleGroups,
  exerciseTypes,
  muscleGroupLabels,
  exerciseTypeLabels,
}: ExerciseModalProps) {
  const [name, setName] = useState(exercise?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(exercise?.muscleGroup ?? "chest");
  const [exerciseType, setExerciseType] = useState<ExerciseType>(
    exercise?.exerciseType ?? "barbell"
  );
  const [notes, setNotes] = useState(exercise?.notes ?? "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), muscleGroup, exerciseType, notes: notes.trim() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{exercise ? "Edit Exercise" : "New Exercise"}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Bench Press"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="exerciseType" className="form-label">
                Exercise Type
              </label>
              <select
                id="exerciseType"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
              >
                {exerciseTypes.map((type) => (
                  <option key={type} value={type}>
                    {exerciseTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="muscleGroup" className="form-label">
                Muscle Group
              </label>
              <select
                id="muscleGroup"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
              >
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>
                    {muscleGroupLabels[group]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tips, cues, or variations..."
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              {exercise ? "Save" : "Add Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
