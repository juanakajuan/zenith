import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, generateId } from "../utils/storage";
import type { Exercise, MuscleGroup } from "../types";
import { MUSCLE_GROUPS, EXERCISE_TYPES, muscleGroupLabels, exerciseTypeLabels } from "../types";
import { ExerciseCard } from "../components/ExerciseCard";
import { ExerciseModal } from "../components/ExerciseModal";
import "./ExercisesPage.css";

export function ExercisesPage() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | "all">("all");

  const filteredExercises =
    filterMuscle === "all" ? exercises : exercises.filter((e) => e.muscleGroup === filterMuscle);

  const groupedExercises = filteredExercises.reduce(
    (acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    },
    {} as Record<MuscleGroup, Exercise[]>
  );

  const handleSave = (data: Omit<Exercise, "id">) => {
    if (editingExercise) {
      setExercises(exercises.map((e) => (e.id === editingExercise.id ? { ...data, id: e.id } : e)));
    } else {
      setExercises([...exercises, { ...data, id: generateId() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Exercises</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          New
        </button>
      </header>

      <div className="filter-bar">
        <select
          value={filterMuscle}
          onChange={(e) => setFilterMuscle(e.target.value as MuscleGroup | "all")}
          className="filter-select"
        >
          <option value="all">All Muscles</option>
          {MUSCLE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {muscleGroupLabels[group]}
            </option>
          ))}
        </select>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6.5 6.5 11 11" />
            <path d="m21 21-1-1" />
            <path d="m3 3 1 1" />
            <path d="m18 22 4-4" />
            <path d="m2 6 4-4" />
            <path d="m3 10 7-7" />
            <path d="m14 21 7-7" />
          </svg>
          <p>No exercises yet. Add your first exercise!</p>
        </div>
      ) : (
        <div className="exercise-groups">
          {(Object.keys(groupedExercises) as MuscleGroup[]).map((group) => (
            <div key={group} className="exercise-group">
              <h2 className="group-title">{muscleGroupLabels[group]}</h2>
              <div className="exercise-list">
                {groupedExercises[group].map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onEdit={() => handleEdit(exercise)}
                    onDelete={() => handleDelete(exercise.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ExerciseModal
          exercise={editingExercise}
          onSave={handleSave}
          onClose={handleCloseModal}
          muscleGroups={MUSCLE_GROUPS}
          exerciseTypes={EXERCISE_TYPES}
          muscleGroupLabels={muscleGroupLabels}
          exerciseTypeLabels={exerciseTypeLabels}
        />
      )}
    </div>
  );
}
