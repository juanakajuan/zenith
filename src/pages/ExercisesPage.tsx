import { useState } from "react";
import { Plus, Dumbbell, Search } from "lucide-react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, generateId, DEFAULT_EXERCISES, isDefaultExercise } from "../utils/storage";

import type { Exercise, MuscleGroup } from "../types";
import { MUSCLE_GROUPS, EXERCISE_TYPES, muscleGroupLabels, exerciseTypeLabels } from "../types";

import { ExerciseCard } from "../components/ExerciseCard";
import { ExerciseModal } from "../components/ExerciseModal";

import "./ExercisesPage.css";

/**
 * Exercises page component for managing the user's exercise library.
 * Displays all exercises (default + user-created) with search and filter capabilities.
 * Allows creating, editing, and deleting user exercises.
 *
 * @remarks
 * Features:
 * - Combines default exercises (read-only) with user-created exercises
 * - Search exercises by name (case-insensitive)
 * - Filter exercises by muscle group
 * - Add new exercises via modal
 * - Edit user-created exercises (default exercises cannot be edited)
 * - Delete user-created exercises (default exercises cannot be deleted)
 * - Exercises grouped by muscle group in the display
 * - Shows empty state when no exercises match filters
 *
 * State:
 * - exercises: User-created exercises from localStorage
 * - isModalOpen: Controls visibility of create/edit modal
 * - editingExercise: The exercise being edited, or null for new exercise
 * - filterMuscle: Current muscle group filter ("all" or specific muscle group)
 * - searchQuery: Current search query string
 */
export function ExercisesPage() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Merge default exercises with user exercises
  const allExercises = [...DEFAULT_EXERCISES, ...exercises];

  const filteredExercises = allExercises.filter((exercise) => {
    const matchesMuscle = filterMuscle === "all" || exercise.muscleGroup === filterMuscle;
    const matchesSearch =
      searchQuery === "" || exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesSearch;
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
          <Plus size={20} strokeWidth={2.5} />
          New
        </button>
      </header>

      <div className="filter-bar">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
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
          <Dumbbell size={48} strokeWidth={1.5} />
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
                    onClick={
                      isDefaultExercise(exercise.id) ? undefined : () => handleEdit(exercise)
                    }
                    isDefault={isDefaultExercise(exercise.id)}
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
          onDelete={
            editingExercise
              ? () => {
                  handleDelete(editingExercise.id);
                  handleCloseModal();
                }
              : undefined
          }
          muscleGroups={MUSCLE_GROUPS}
          exerciseTypes={EXERCISE_TYPES}
          muscleGroupLabels={muscleGroupLabels}
          exerciseTypeLabels={exerciseTypeLabels}
        />
      )}
    </div>
  );
}
