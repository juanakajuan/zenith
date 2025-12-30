import { useState, useEffect } from "react";
import { X, Plus, Trash2, GripVertical, Minus } from "lucide-react";

import type {
  Exercise,
  WorkoutTemplate,
  TemplateDay,
  TemplateMuscleGroup,
  MuscleGroup,
} from "../types";
import { muscleGroupLabels, muscleGroupColors } from "../types";
import { generateId } from "../utils/storage";

import { ExerciseSelector } from "./ExerciseSelector";
import { MuscleGroupSelector } from "./MuscleGroupSelector";

import "./TemplateModal.css";

interface TemplateModalProps {
  exercises: Exercise[];
  template?: WorkoutTemplate | null;
  onSave: (template: WorkoutTemplate) => void;
  onClose: () => void;
}

export function TemplateModal({ exercises, template, onSave, onClose }: TemplateModalProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [days, setDays] = useState<TemplateDay[]>(
    template?.days ?? [
      {
        id: generateId(),
        name: "Day 1",
        muscleGroups: [],
      },
    ]
  );
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [error, setError] = useState("");

  // Muscle group selector state
  const [showMuscleGroupSelector, setShowMuscleGroupSelector] = useState(false);

  // Exercise selector state
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exerciseSelectorTarget, setExerciseSelectorTarget] = useState<{
    muscleGroupId: string;
    exerciseId: string;
    muscleGroup: MuscleGroup;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const activeDay = days[activeDayIndex];

  const addDay = () => {
    const newDay: TemplateDay = {
      id: generateId(),
      name: `Day ${days.length + 1}`,
      muscleGroups: [],
    };
    setDays([...days, newDay]);
    setActiveDayIndex(days.length); // Switch to new day
  };

  const removeDay = (dayIndex: number) => {
    if (days.length <= 1) return;
    const newDays = days.filter((_, i) => i !== dayIndex);
    setDays(newDays);
    // Adjust active index if needed
    if (activeDayIndex >= newDays.length) {
      setActiveDayIndex(newDays.length - 1);
    } else if (activeDayIndex > dayIndex) {
      setActiveDayIndex(activeDayIndex - 1);
    }
  };

  const addMuscleGroupToActiveDay = (muscleGroup: MuscleGroup) => {
    const newMuscleGroup: TemplateMuscleGroup = {
      id: generateId(),
      muscleGroup,
      exercises: [
        {
          id: generateId(),
          exerciseId: null,
          setCount: 3,
        },
      ],
    };

    setDays(
      days.map((day, i) => {
        if (i !== activeDayIndex) return day;
        return {
          ...day,
          muscleGroups: [...day.muscleGroups, newMuscleGroup],
        };
      })
    );

    setShowMuscleGroupSelector(false);
  };

  const removeMuscleGroup = (muscleGroupId: string) => {
    setDays(
      days.map((day, i) => {
        if (i !== activeDayIndex) return day;
        return {
          ...day,
          muscleGroups: day.muscleGroups.filter((mg) => mg.id !== muscleGroupId),
        };
      })
    );
  };

  const openExerciseSelector = (
    muscleGroupId: string,
    exerciseId: string,
    muscleGroup: MuscleGroup
  ) => {
    setExerciseSelectorTarget({ muscleGroupId, exerciseId, muscleGroup });
    setShowExerciseSelector(true);
  };

  const selectExercise = (selectedExerciseId: string) => {
    if (!exerciseSelectorTarget) return;

    const { muscleGroupId, exerciseId } = exerciseSelectorTarget;

    setDays(
      days.map((day, i) => {
        if (i !== activeDayIndex) return day;
        return {
          ...day,
          muscleGroups: day.muscleGroups.map((mg) => {
            if (mg.id !== muscleGroupId) return mg;
            return {
              ...mg,
              exercises: mg.exercises.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                return { ...ex, exerciseId: selectedExerciseId };
              }),
            };
          }),
        };
      })
    );

    setShowExerciseSelector(false);
    setExerciseSelectorTarget(null);
    setError("");
  };

  const getExerciseById = (id: string | null) => {
    if (!id) return null;
    return exercises.find((e) => e.id === id) ?? null;
  };

  const updateSetCount = (muscleGroupId: string, exerciseId: string, delta: number) => {
    setDays(
      days.map((day, i) => {
        if (i !== activeDayIndex) return day;
        return {
          ...day,
          muscleGroups: day.muscleGroups.map((mg) => {
            if (mg.id !== muscleGroupId) return mg;
            return {
              ...mg,
              exercises: mg.exercises.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                const newCount = Math.max(1, Math.min(20, ex.setCount + delta));
                return { ...ex, setCount: newCount };
              }),
            };
          }),
        };
      })
    );
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a template name");
      return;
    }

    const hasExercises = days.some((day) =>
      day.muscleGroups.some((mg) => mg.exercises.some((ex) => ex.exerciseId !== null))
    );

    if (!hasExercises) {
      setError("Please add at least one exercise to the template");
      return;
    }

    // Filter out muscle groups without any selected exercises
    const cleanedDays = days.map((day) => ({
      ...day,
      muscleGroups: day.muscleGroups
        .map((mg) => ({
          ...mg,
          exercises: mg.exercises.filter((ex) => ex.exerciseId !== null),
        }))
        .filter((mg) => mg.exercises.length > 0),
    }));

    const savedTemplate: WorkoutTemplate = {
      id: template?.id ?? generateId(),
      name: trimmedName,
      days: cleanedDays,
    };

    onSave(savedTemplate);
  };

  const getFilteredExercises = () => {
    if (!exerciseSelectorTarget) return exercises;
    return exercises.filter((e) => e.muscleGroup === exerciseSelectorTarget.muscleGroup);
  };

  return (
    <>
      <div className="template-modal-fullscreen">
        {/* Header */}
        <div className="template-modal-header">
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="template-title-section">
          <input
            type="text"
            className="template-name-input"
            placeholder="New template plan"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Day Tabs */}
        <div className="template-day-tabs">
          <div className="template-day-tabs-inner">
            {days.map((day, index) => (
              <button
                key={day.id}
                className={`template-day-tab ${index === activeDayIndex ? "active" : ""}`}
                onClick={() => setActiveDayIndex(index)}
              >
                {day.name}
                {days.length > 1 && index === activeDayIndex && (
                  <span
                    className="template-day-tab-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDay(index);
                    }}
                  >
                    <X size={14} />
                  </span>
                )}
              </button>
            ))}
            <button className="template-day-tab template-add-day-tab" onClick={addDay}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Day Content */}
        <div className="template-day-content">
          {activeDay.muscleGroups.length === 0 ? (
            <div className="template-empty-day">
              <p>No muscle groups added yet.</p>
              <p className="hint">Tap the + button to add a muscle group.</p>
            </div>
          ) : (
            <div className="template-muscle-groups-list">
              {activeDay.muscleGroups.map((muscleGroup) => (
                <div key={muscleGroup.id} className="template-muscle-group-row">
                  <div className="template-muscle-group-drag">
                    <GripVertical size={20} />
                  </div>

                  <div className="template-muscle-group-content">
                    <div className="template-muscle-group-header">
                      <span
                        className="muscle-group-indicator-bar"
                        style={{ backgroundColor: muscleGroupColors[muscleGroup.muscleGroup] }}
                      />
                      <span className="template-muscle-group-name">
                        {muscleGroupLabels[muscleGroup.muscleGroup]}
                      </span>
                    </div>

                    {muscleGroup.exercises.map((templateExercise) => {
                      const exercise = getExerciseById(templateExercise.exerciseId);

                      return (
                        <div
                          key={templateExercise.id}
                          className={`template-exercise-row ${exercise ? "has-selected-exercise" : ""}`}
                        >
                          <button
                            className={`template-exercise-btn ${exercise ? "has-exercise" : ""}`}
                            onClick={() =>
                              openExerciseSelector(
                                muscleGroup.id,
                                templateExercise.id,
                                muscleGroup.muscleGroup
                              )
                            }
                          >
                            {exercise ? exercise.name : "Choose an exercise"}
                          </button>
                          {exercise && (
                            <div className="template-set-count-control">
                              <button
                                type="button"
                                className="btn btn-icon btn-ghost btn-sm"
                                onClick={() =>
                                  updateSetCount(muscleGroup.id, templateExercise.id, -1)
                                }
                                disabled={templateExercise.setCount <= 1}
                                aria-label="Decrease sets"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="template-set-count-value">
                                {templateExercise.setCount}
                              </span>
                              <button
                                type="button"
                                className="btn btn-icon btn-ghost btn-sm"
                                onClick={() =>
                                  updateSetCount(muscleGroup.id, templateExercise.id, 1)
                                }
                                disabled={templateExercise.setCount >= 20}
                                aria-label="Increase sets"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="btn btn-icon btn-ghost template-muscle-group-delete"
                    onClick={() => removeMuscleGroup(muscleGroup.id)}
                    aria-label="Remove muscle group"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && <p className="template-error">{error}</p>}

        {/* Footer */}
        <div className="template-modal-footer">
          <button
            type="button"
            className="btn btn-icon template-fab"
            onClick={() => setShowMuscleGroupSelector(true)}
            aria-label="Add muscle group"
          >
            <Plus size={24} />
          </button>

          <button className="btn btn-accent template-save-btn" onClick={handleSave}>
            {template ? "SAVE CHANGES" : "CREATE TEMPLATE"}
          </button>
        </div>
      </div>

      {showMuscleGroupSelector && (
        <MuscleGroupSelector
          onSelect={addMuscleGroupToActiveDay}
          onClose={() => setShowMuscleGroupSelector(false)}
        />
      )}

      {showExerciseSelector && exerciseSelectorTarget && (
        <ExerciseSelector
          exercises={getFilteredExercises()}
          onSelect={selectExercise}
          onClose={() => {
            setShowExerciseSelector(false);
            setExerciseSelectorTarget(null);
          }}
          hideFilter
        />
      )}
    </>
  );
}
