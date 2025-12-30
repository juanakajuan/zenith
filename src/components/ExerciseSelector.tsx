import { useState, useEffect } from "react";
import { X, Search, Plus } from "lucide-react";
import type { Exercise, MuscleGroup } from "../types";
import { muscleGroupLabels, exerciseTypeLabels, MUSCLE_GROUPS } from "../types";
import "./ExerciseSelector.css";

interface ExerciseSelectorProps {
  exercises: Exercise[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
  hideFilter?: boolean;
}

export function ExerciseSelector({
  exercises,
  onSelect,
  onClose,
  hideFilter = false,
}: ExerciseSelectorProps) {
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | "all">("all");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = filterMuscle === "all" || exercise.muscleGroup === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  const groupedExercises = filteredExercises.reduce(
    (acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    },
    {} as Record<MuscleGroup, Exercise[]>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal exercise-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Select Exercise</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="selector-filters">
          <div className="search-input-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          {!hideFilter && (
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value as MuscleGroup | "all")}
            >
              <option value="all">All Muscles</option>
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {muscleGroupLabels[group]}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="selector-list">
          {exercises.length === 0 ? (
            <div className="selector-empty">
              <p>No exercises created yet.</p>
              <p className="hint">Go to the Exercises tab to add some!</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="selector-empty">
              <p>No exercises match your search.</p>
            </div>
          ) : (
            Object.entries(groupedExercises).map(([group, groupExercises]) => (
              <div key={group} className="selector-group">
                <h3 className="selector-group-title">{muscleGroupLabels[group as MuscleGroup]}</h3>
                {groupExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    className="selector-item"
                    onClick={() => onSelect(exercise.id)}
                  >
                    <div className="selector-item-info">
                      <span className="selector-item-name">{exercise.name}</span>
                      <span className="selector-item-type">
                        {exerciseTypeLabels[exercise.exerciseType]}
                      </span>
                    </div>
                    <Plus size={20} />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
