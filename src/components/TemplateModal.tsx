import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import type { Exercise, WorkoutTemplate, TemplateExercise } from "../types";
import { muscleGroupLabels, exerciseTypeLabels } from "../types";
import { generateId } from "../utils/storage";
import { ExerciseSelector } from "./ExerciseSelector";
import "./TemplateModal.css";

interface TemplateModalProps {
  exercises: Exercise[];
  template?: WorkoutTemplate | null;
  onSave: (template: WorkoutTemplate) => void;
  onClose: () => void;
}

export function TemplateModal({ exercises, template, onSave, onClose }: TemplateModalProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>(
    template?.exercises ?? []
  );
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const addExercise = (exerciseId: string) => {
    const newExercise: TemplateExercise = {
      id: generateId(),
      exerciseId,
      setCount: 3,
    };
    setTemplateExercises([...templateExercises, newExercise]);
    setShowExerciseSelector(false);
    setError("");
  };

  const removeExercise = (templateExerciseId: string) => {
    setTemplateExercises(templateExercises.filter((e) => e.id !== templateExerciseId));
  };

  const updateSetCount = (templateExerciseId: string, delta: number) => {
    setTemplateExercises(
      templateExercises.map((e) => {
        if (e.id !== templateExerciseId) return e;
        const newCount = Math.max(1, Math.min(20, e.setCount + delta));
        return { ...e, setCount: newCount };
      })
    );
  };

  const getExerciseById = (id: string) => exercises.find((e) => e.id === id);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a template name");
      return;
    }
    if (templateExercises.length === 0) {
      setError("Please add at least one exercise");
      return;
    }

    const savedTemplate: WorkoutTemplate = {
      id: template?.id ?? generateId(),
      name: trimmedName,
      exercises: templateExercises,
    };

    onSave(savedTemplate);
  };

  const totalSets = templateExercises.reduce((sum, e) => sum + e.setCount, 0);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal template-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{template ? "Edit Template" : "New Template"}</h2>
            <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="template-name">
                Template Name
              </label>
              <input
                id="template-name"
                type="text"
                placeholder="e.g., Push Day, Leg Day..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                autoFocus
              />
            </div>

            <div className="template-exercises-section">
              <div className="template-exercises-header">
                <span className="form-label">Exercises</span>
                {templateExercises.length > 0 && (
                  <span className="template-summary">
                    {templateExercises.length} exercise{templateExercises.length !== 1 ? "s" : ""} ·{" "}
                    {totalSets} set{totalSets !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {templateExercises.length === 0 ? (
                <div className="template-exercises-empty">
                  <p>No exercises added yet.</p>
                </div>
              ) : (
                <div className="template-exercises-list">
                  {templateExercises.map((templateExercise) => {
                    const exercise = getExerciseById(templateExercise.exerciseId);
                    if (!exercise) return null;

                    return (
                      <div key={templateExercise.id} className="template-exercise-item">
                        <div className="template-exercise-info">
                          <span className="template-exercise-name">{exercise.name}</span>
                          <span className="template-exercise-meta">
                            {muscleGroupLabels[exercise.muscleGroup]} ·{" "}
                            {exerciseTypeLabels[exercise.exerciseType]}
                          </span>
                        </div>
                        <div className="template-exercise-controls">
                          <div className="set-count-control">
                            <button
                              className="btn btn-icon btn-ghost"
                              onClick={() => updateSetCount(templateExercise.id, -1)}
                              disabled={templateExercise.setCount <= 1}
                              aria-label="Decrease sets"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="set-count-value">
                              {templateExercise.setCount} set
                              {templateExercise.setCount !== 1 ? "s" : ""}
                            </span>
                            <button
                              className="btn btn-icon btn-ghost"
                              onClick={() => updateSetCount(templateExercise.id, 1)}
                              disabled={templateExercise.setCount >= 20}
                              aria-label="Increase sets"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            className="btn btn-icon btn-ghost btn-remove"
                            onClick={() => removeExercise(templateExercise.id)}
                            aria-label="Remove exercise"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="btn btn-secondary add-exercise-to-template-btn"
                onClick={() => setShowExerciseSelector(true)}
              >
                <Plus size={18} />
                Add Exercise
              </button>
            </div>

            {error && <p className="template-error">{error}</p>}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {template ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </div>
      </div>

      {showExerciseSelector && (
        <ExerciseSelector
          exercises={exercises}
          onSelect={addExercise}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}
    </>
  );
}
