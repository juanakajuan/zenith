import { useState } from "react";
import {
  CirclePlay,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Play,
  Edit3,
  MoreVertical,
  StickyNote,
} from "lucide-react";

import type { Exercise, Workout, WorkoutExercise, WorkoutSet } from "../types";
import { muscleGroupLabels, exerciseTypeLabels, getMuscleGroupClassName } from "../types";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, generateId, DEFAULT_EXERCISES } from "../utils/storage";

import { SetRow } from "../components/SetRow";
import { ExerciseSelector } from "../components/ExerciseSelector";
import { WorkoutTimer } from "../components/WorkoutTimer";

import "./WorkoutPage.css";

export function WorkoutPage() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  const [activeWorkout, setActiveWorkout] = useLocalStorage<Workout | null>(
    STORAGE_KEYS.ACTIVE_WORKOUT,
    null
  );
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [openKebabMenu, setOpenKebabMenu] = useState<string | null>(null);

  // Merge default exercises with user exercises, user exercises override defaults
  const allExercises = DEFAULT_EXERCISES.map((defaultEx) => {
    const userOverride = exercises.find((e) => e.id === defaultEx.id);
    return userOverride || defaultEx;
  }).concat(exercises.filter((e) => !e.id.startsWith("default-")));

  const startEmptyWorkout = () => {
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const defaultName = `${dayNames[today.getDay()]} Workout`;

    const newWorkout: Workout = {
      id: generateId(),
      name: defaultName,
      date: today.toISOString(),
      startTime: today.toISOString(),
      exercises: [],
      completed: false,
    };
    setActiveWorkout(newWorkout);
    setWorkoutName(defaultName);
  };

  const addExerciseToWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;

    const workoutExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId,
      sets: [{ id: generateId(), weight: 0, reps: 0, completed: false }],
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, workoutExercise],
    });
    setShowExerciseSelector(false);
  };

  const handleCreateExercise = (exerciseData: Omit<Exercise, "id">) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: generateId(),
    };

    // Persist via localStorage
    setExercises([...exercises, newExercise]);

    addExerciseToWorkout(newExercise.id);
  };

  const removeExerciseFromWorkout = (workoutExerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((e) => e.id !== workoutExerciseId),
    });
  };

  const addSet = (workoutExerciseId: string) => {
    if (!activeWorkout) return;

    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((e) => {
        if (e.id !== workoutExerciseId) return e;
        const lastSet = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [
            ...e.sets,
            {
              id: generateId(),
              weight: lastSet?.weight ?? 0,
              reps: lastSet?.reps ?? 0,
              completed: false,
            },
          ],
        };
      }),
    });
  };

  const updateSet = (workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;

    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((e) => {
        if (e.id !== workoutExerciseId) return e;
        return {
          ...e,
          sets: e.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
        };
      }),
    });
  };

  const removeSet = (workoutExerciseId: string, setId: string) => {
    if (!activeWorkout) return;

    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((e) => {
        if (e.id !== workoutExerciseId) return e;
        return { ...e, sets: e.sets.filter((s) => s.id !== setId) };
      }),
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    const now = new Date();
    const startTime = new Date(activeWorkout.startTime);
    const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    const completedWorkout: Workout = {
      ...activeWorkout,
      name: workoutName || activeWorkout.name,
      duration: durationInSeconds,
      completed: true,
    };

    setWorkouts([completedWorkout, ...workouts]);
    setActiveWorkout(null);
    setWorkoutName("");
  };

  const cancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? All progress will be lost.")) {
      setActiveWorkout(null);
      setWorkoutName("");
    }
  };

  const getExerciseById = (id: string) => allExercises.find((e) => e.id === id);

  const updateExerciseNote = (exerciseId: string, noteText: string) => {
    // Update in user exercises (will create override for default exercises)
    const existingExercise = exercises.find((e) => e.id === exerciseId);

    if (existingExercise) {
      // Update existing user exercise
      const updatedExercises = exercises.map((e) =>
        e.id === exerciseId ? { ...e, notes: noteText } : e
      );
      setExercises(updatedExercises);
    } else {
      // Create override for default exercise
      const defaultExercise = DEFAULT_EXERCISES.find((e) => e.id === exerciseId);
      if (defaultExercise) {
        setExercises([...exercises, { ...defaultExercise, notes: noteText }]);
      }
    }
  };

  const addNoteToExercise = (workoutExerciseId: string) => {
    setEditingNoteId(workoutExerciseId);
    setOpenKebabMenu(null);
  };

  const deleteNoteFromExercise = (exerciseId: string) => {
    // Update exercise notes to empty
    const existingExercise = exercises.find((e) => e.id === exerciseId);

    if (existingExercise) {
      const updatedExercises = exercises.map((e) =>
        e.id === exerciseId ? { ...e, notes: "" } : e
      );
      setExercises(updatedExercises);
    }

    setOpenKebabMenu(null);
  };

  const hasNote = (exercise: Exercise): boolean => {
    return !!exercise.notes;
  };

  const allSetsCompleted = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return false;
    return activeWorkout.exercises.every((workoutExercise) =>
      workoutExercise.sets.every((set) => set.completed)
    );
  };

  // No active workout - show start screen
  if (!activeWorkout) {
    return (
      <div className="page workout-page-idle">
        <header className="page-header">
          <h1 className="page-title">Workout</h1>
        </header>

        <div className="start-workout-section">
          <div className="start-workout-card-compact">
            <CirclePlay size={32} strokeWidth={1.5} />
            <div className="start-workout-text">
              <h2>Ready to train?</h2>
              <p>Start an empty workout</p>
            </div>
            <button className="btn btn-primary" onClick={startEmptyWorkout}>
              <Play size={18} />
              START
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active workout view
  return (
    <div className="page workout-page">
      <header className="workout-header">
        <div className="workout-header-top">
          {isEditingName ? (
            <input
              className="workout-name-input"
              type="text"
              value={workoutName || activeWorkout.name}
              onChange={(e) => setWorkoutName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <h1 className="workout-name" onClick={() => setIsEditingName(true)}>
              {workoutName || activeWorkout.name}
              <Pencil size={16} />
            </h1>
          )}
        </div>
        <p className="workout-date">
          {new Date(activeWorkout.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <WorkoutTimer startTime={activeWorkout.startTime} />
      </header>

      <div className="workout-exercises">
        {activeWorkout.exercises.length === 0 ? (
          <div className="empty-exercises">
            <p>No exercises added yet. Add your first exercise to get started!</p>
          </div>
        ) : (
          activeWorkout.exercises.map((workoutExercise) => {
            const exercise = getExerciseById(workoutExercise.exerciseId);
            if (!exercise) return null;

            return (
              <div key={workoutExercise.id} className="workout-exercise-card card">
                <div className="workout-exercise-header">
                  <div>
                    <span className={`tag ${getMuscleGroupClassName(exercise.muscleGroup)}`}>
                      {muscleGroupLabels[exercise.muscleGroup]}
                    </span>
                    <div className="exercise-name-row">
                      <h3 className="workout-exercise-name">{exercise.name}</h3>
                      <span className="tag tag-muted">
                        {exerciseTypeLabels[exercise.exerciseType]}
                      </span>
                    </div>
                  </div>
                  <div className="workout-exercise-actions">
                    <button
                      className="btn btn-icon btn-ghost"
                      onClick={() =>
                        setOpenKebabMenu(
                          openKebabMenu === workoutExercise.id ? null : workoutExercise.id
                        )
                      }
                      aria-label="More options"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openKebabMenu === workoutExercise.id && (
                      <div className="kebab-menu">
                        {hasNote(exercise) ? (
                          <button
                            className="kebab-menu-item"
                            onClick={() => deleteNoteFromExercise(exercise.id)}
                          >
                            <Trash2 size={16} />
                            Delete Note
                          </button>
                        ) : (
                          <button
                            className="kebab-menu-item"
                            onClick={() => addNoteToExercise(workoutExercise.id)}
                          >
                            <StickyNote size={16} />
                            Add Note
                          </button>
                        )}
                        <button
                          className="kebab-menu-item kebab-menu-item-danger"
                          onClick={() => {
                            removeExerciseFromWorkout(workoutExercise.id);
                            setOpenKebabMenu(null);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete Exercise
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {(hasNote(exercise) || editingNoteId === workoutExercise.id) && (
                  <div className="workout-exercise-note-section">
                    {editingNoteId === workoutExercise.id ? (
                      <textarea
                        className="workout-exercise-note-input"
                        value={exercise.notes}
                        onChange={(e) => updateExerciseNote(exercise.id, e.target.value)}
                        onBlur={() => setEditingNoteId(null)}
                        placeholder="Add notes..."
                        autoFocus
                      />
                    ) : (
                      <div
                        className="workout-exercise-note"
                        onClick={() => setEditingNoteId(workoutExercise.id)}
                      >
                        <Edit3 size={16} className="note-edit-icon" />
                        <span>{exercise.notes || "Add notes..."}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="sets-container">
                  <div className="sets-header">
                    <span className="set-col-num"></span>
                    <span className="set-col-weight">WEIGHT</span>
                    <span className="set-col-reps">REPS</span>
                    <span className="set-col-done">LOG</span>
                  </div>
                  {workoutExercise.sets.map((set) => (
                    <SetRow
                      key={set.id}
                      set={set}
                      onUpdate={(updates) => updateSet(workoutExercise.id, set.id, updates)}
                      onRemove={() => removeSet(workoutExercise.id, set.id)}
                      canRemove={workoutExercise.sets.length > 1}
                    />
                  ))}
                </div>

                <button className="add-set-btn" onClick={() => addSet(workoutExercise.id)}>
                  <Plus size={16} />
                  Add Set
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="workout-actions">
        <button
          className="btn btn-secondary add-exercise-btn"
          onClick={() => setShowExerciseSelector(true)}
        >
          <Plus size={20} />
          Add Exercise
        </button>

        <button
          className={
            allSetsCompleted() ? "btn btn-primary finish-btn" : "btn btn-secondary finish-btn"
          }
          onClick={allSetsCompleted() ? finishWorkout : cancelWorkout}
        >
          {allSetsCompleted() ? (
            <>
              <Check size={20} strokeWidth={2.5} />
              Finish Workout
            </>
          ) : (
            <>
              <X size={20} />
              Cancel Workout
            </>
          )}
        </button>
      </div>

      {showExerciseSelector && (
        <ExerciseSelector
          exercises={allExercises}
          onSelect={addExerciseToWorkout}
          onClose={() => setShowExerciseSelector(false)}
          onCreateExercise={handleCreateExercise}
        />
      )}
    </div>
  );
}
