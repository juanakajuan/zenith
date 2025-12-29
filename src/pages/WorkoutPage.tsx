import { useState } from "react";
import { CirclePlay, Pencil, Trash2, Plus, Check, X, Play, LayoutTemplate } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, generateId, DEFAULT_EXERCISES } from "../utils/storage";
import type { Exercise, Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate } from "../types";
import { muscleGroupLabels, exerciseTypeLabels, getMuscleGroupClassName } from "../types";
import { SetRow } from "../components/SetRow";
import { ExerciseSelector } from "../components/ExerciseSelector";
import { TemplateModal } from "../components/TemplateModal";
import "./WorkoutPage.css";

export function WorkoutPage() {
  const [exercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  const [activeWorkout, setActiveWorkout] = useLocalStorage<Workout | null>(
    STORAGE_KEYS.ACTIVE_WORKOUT,
    null
  );
  const [templates, setTemplates] = useLocalStorage<WorkoutTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [workoutName, setWorkoutName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  // Merge default exercises with user exercises
  const allExercises = [...DEFAULT_EXERCISES, ...exercises];

  const startEmptyWorkout = () => {
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const defaultName = `${dayNames[today.getDay()]} Workout`;

    const newWorkout: Workout = {
      id: generateId(),
      name: defaultName,
      date: today.toISOString(),
      exercises: [],
      completed: false,
    };
    setActiveWorkout(newWorkout);
    setWorkoutName(defaultName);
  };

  const startFromTemplate = (template: WorkoutTemplate) => {
    const today = new Date();

    // Convert template exercises to workout exercises with empty sets
    const workoutExercises: WorkoutExercise[] = template.exercises.map((templateExercise) => ({
      id: generateId(),
      exerciseId: templateExercise.exerciseId,
      sets: Array.from({ length: templateExercise.setCount }, () => ({
        id: generateId(),
        weight: 0,
        reps: 0,
        completed: false,
      })),
    }));

    const newWorkout: Workout = {
      id: generateId(),
      name: template.name,
      date: today.toISOString(),
      exercises: workoutExercises,
      completed: false,
    };
    setActiveWorkout(newWorkout);
    setWorkoutName(template.name);
  };

  const saveTemplate = (template: WorkoutTemplate) => {
    const existingIndex = templates.findIndex((t) => t.id === template.id);
    if (existingIndex >= 0) {
      // Update existing template
      const updated = [...templates];
      updated[existingIndex] = template;
      setTemplates(updated);
    } else {
      // Add new template at the beginning (newest first)
      setTemplates([template, ...templates]);
    }
    setShowTemplateModal(false);
    setEditingTemplate(null);
  };

  const deleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
    }
  };

  const openEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const getTotalSets = (template: WorkoutTemplate) => {
    return template.exercises.reduce((sum, e) => sum + e.setCount, 0);
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

    const completedWorkout: Workout = {
      ...activeWorkout,
      name: workoutName || activeWorkout.name,
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

  const allSetsCompleted = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return false;
    return activeWorkout.exercises.every((workoutExercise) =>
      workoutExercise.sets.every((set) => set.completed)
    );
  };

  // No active workout - show start screen with templates
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
              Start
            </button>
          </div>
        </div>

        <div className="templates-section">
          <div className="templates-header">
            <div className="templates-header-title">
              <LayoutTemplate size={20} />
              <h2>Templates</h2>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setEditingTemplate(null);
                setShowTemplateModal(true);
              }}
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {templates.length === 0 ? (
            <div className="templates-empty">
              <p>No templates yet.</p>
              <p className="hint">Create one to quickly start workouts.</p>
            </div>
          ) : (
            <div className="templates-list">
              {templates.map((template) => (
                <div key={template.id} className="template-card card">
                  <div className="template-card-header">
                    <h3 className="template-card-name">{template.name}</h3>
                    <span className="template-card-summary">
                      {template.exercises.length} exercise
                      {template.exercises.length !== 1 ? "s" : ""} · {getTotalSets(template)} set
                      {getTotalSets(template) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="template-card-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => startFromTemplate(template)}
                    >
                      <Play size={16} />
                      Start
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => openEditTemplate(template)}
                      aria-label="Edit template"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => deleteTemplate(template.id)}
                      aria-label="Delete template"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTemplateModal && (
          <TemplateModal
            exercises={allExercises}
            template={editingTemplate}
            onSave={saveTemplate}
            onClose={() => {
              setShowTemplateModal(false);
              setEditingTemplate(null);
            }}
          />
        )}
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
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => removeExerciseFromWorkout(workoutExercise.id)}
                    aria-label="Remove exercise"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

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
        />
      )}
    </div>
  );
}
