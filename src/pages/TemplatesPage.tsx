import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Play,
  Pencil,
  Trash2,
  ChevronLeft,
  Minus,
  ChevronUp,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

import type {
  Exercise,
  Workout,
  WorkoutTemplate,
  TemplateDay,
  TemplateMuscleGroup,
  MuscleGroup,
  WorkoutExercise,
} from "../types";
import { muscleGroupLabels, muscleGroupColors } from "../types";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, generateId, DEFAULT_EXERCISES } from "../utils/storage";

import { DaySelector } from "../components/DaySelector";
import { MuscleGroupSelector } from "../components/MuscleGroupSelector";
import { ExerciseSelector } from "../components/ExerciseSelector";

import "./TemplatesPage.css";

export function TemplatesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [templates, setTemplates] = useLocalStorage<WorkoutTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
  const [, setActiveWorkout] = useLocalStorage<Workout | null>(STORAGE_KEYS.ACTIVE_WORKOUT, null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [name, setName] = useState("");
  const [days, setDays] = useState<TemplateDay[]>([
    {
      id: generateId(),
      name: "Day 1",
      muscleGroups: [],
    },
  ]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [error, setError] = useState("");

  const [showDaySelector, setShowDaySelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);

  const [showMuscleGroupSelector, setShowMuscleGroupSelector] = useState(false);

  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exerciseSelectorTarget, setExerciseSelectorTarget] = useState<{
    muscleGroupId: string;
    exerciseId: string;
    muscleGroup: MuscleGroup;
  } | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const allExercises = [...DEFAULT_EXERCISES, ...exercises];

  const activeDay = days[activeDayIndex];

  // ========== Template CRUD ==========

  const openCreateTemplate = () => {
    setIsEditing(true);
    setEditingTemplate(null);
    setName("");
    setDays([
      {
        id: generateId(),
        name: "Day 1",
        muscleGroups: [],
      },
    ]);
    setActiveDayIndex(0);
    setError("");
  };

  const openEditTemplate = (template: WorkoutTemplate) => {
    setIsEditing(true);
    setEditingTemplate(template);
    setName(template.name);
    setDays(template.days);
    setActiveDayIndex(0);
    setError("");
  };

  const closeEditor = () => {
    setIsEditing(false);
    setEditingTemplate(null);
    setName("");
    setDays([
      {
        id: generateId(),
        name: "Day 1",
        muscleGroups: [],
      },
    ]);
    setActiveDayIndex(0);
    setError("");
  };

  const saveTemplate = () => {
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
      id: editingTemplate?.id ?? generateId(),
      name: trimmedName,
      days: cleanedDays,
    };

    const existingIndex = templates.findIndex((t) => t.id === savedTemplate.id);
    if (existingIndex >= 0) {
      // Update existing template
      const updated = [...templates];
      updated[existingIndex] = savedTemplate;
      setTemplates(updated);
    } else {
      // Add new template at the beginning (newest first)
      setTemplates([savedTemplate, ...templates]);
    }

    closeEditor();
  };

  const deleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
    }
  };

  // ========== Workout Start ==========

  const handleTemplateClick = (template: WorkoutTemplate) => {
    // If template has only one day, start directly
    if (template.days.length === 1) {
      startFromTemplateDay(template, template.days[0]);
    } else {
      // Show day selector for multi-day templates
      setSelectedTemplate(template);
      setShowDaySelector(true);
    }
  };

  const startFromTemplateDay = (template: WorkoutTemplate, day: TemplateDay) => {
    const today = new Date();

    // Collect all exercises from the day's muscle groups
    const workoutExercises: WorkoutExercise[] = [];
    day.muscleGroups.forEach((muscleGroup) => {
      muscleGroup.exercises.forEach((templateExercise) => {
        if (templateExercise.exerciseId) {
          workoutExercises.push({
            id: generateId(),
            exerciseId: templateExercise.exerciseId,
            sets: Array.from({ length: templateExercise.setCount }, () => ({
              id: generateId(),
              weight: 0,
              reps: 0,
              completed: false,
            })),
          });
        }
      });
    });

    const workoutDisplayName =
      template.days.length > 1 ? `${template.name} - ${day.name}` : template.name;

    const newWorkout: Workout = {
      id: generateId(),
      name: workoutDisplayName,
      date: today.toISOString(),
      startTime: today.toISOString(),
      exercises: workoutExercises,
      completed: false,
    };

    setActiveWorkout(newWorkout);
    setShowDaySelector(false);
    setSelectedTemplate(null);

    // Navigate to workout page
    navigate("/workout");
  };

  // ========== Template Stats ==========

  const getTemplateStats = (template: WorkoutTemplate) => {
    let exerciseCount = 0;
    let setCount = 0;

    template.days.forEach((day) => {
      day.muscleGroups.forEach((mg) => {
        mg.exercises.forEach((ex) => {
          if (ex.exerciseId) {
            exerciseCount++;
            setCount += ex.setCount;
          }
        });
      });
    });

    return { exerciseCount, setCount, dayCount: template.days.length };
  };

  // ========== Day Management ==========

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

  // ========== Muscle Group Management ==========

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

  const moveMuscleGroup = (muscleGroupId: string, direction: "up" | "down") => {
    setDays(
      days.map((day, i) => {
        if (i !== activeDayIndex) return day;

        const currentIndex = day.muscleGroups.findIndex((mg) => mg.id === muscleGroupId);
        if (currentIndex === -1) return day;

        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        // Can't move beyond bounds
        if (newIndex < 0 || newIndex >= day.muscleGroups.length) return day;

        // Swap the muscle groups
        const newMuscleGroups = [...day.muscleGroups];
        [newMuscleGroups[currentIndex], newMuscleGroups[newIndex]] = [
          newMuscleGroups[newIndex],
          newMuscleGroups[currentIndex],
        ];

        return {
          ...day,
          muscleGroups: newMuscleGroups,
        };
      })
    );
  };

  // ========== Exercise Management ==========

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

  const handleCreateExercise = (exerciseData: Omit<Exercise, "id">) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: generateId(),
    };

    // Persist via localStorage
    setExercises([...exercises, newExercise]);

    selectExercise(newExercise.id);
  };

  const getExerciseById = (id: string | null) => {
    if (!id) return null;
    return allExercises.find((e) => e.id === id) ?? null;
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

  const getFilteredExercises = () => {
    if (!exerciseSelectorTarget) return allExercises;
    return allExercises.filter((e) => e.muscleGroup === exerciseSelectorTarget.muscleGroup);
  };

  const toggleMenu = (templateId: string) => {
    setOpenMenuId(openMenuId === templateId ? null : templateId);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".template-kebab-menu")) return;
    setOpenMenuId(null);
  };

  if (isEditing) {
    return (
      <>
        <div className="page templates-page-editor">
          {/* Header */}
          <div className="templates-editor-header">
            <button className="btn btn-icon btn-ghost" onClick={closeEditor} aria-label="Go back">
              <ChevronLeft size={24} />
              Back
            </button>
          </div>

          {/* Title */}
          <div className="templates-title-section">
            <input
              type="text"
              className="templates-name-input"
              placeholder="New template plan"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Day Tabs */}
          <div className="templates-day-tabs">
            <div className="templates-day-tabs-inner">
              {days.map((day, index) => (
                <button
                  key={day.id}
                  className={`templates-day-tab ${index === activeDayIndex ? "active" : ""}`}
                  onClick={() => setActiveDayIndex(index)}
                >
                  {day.name}
                  {days.length > 1 && index === activeDayIndex && (
                    <span
                      className="templates-day-tab-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(index);
                      }}
                    >
                      <Trash2 size={14} />
                    </span>
                  )}
                </button>
              ))}
              <button className="templates-day-tab templates-add-day-tab" onClick={addDay}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Day Content */}
          <div className="templates-day-content">
            {activeDay.muscleGroups.length === 0 ? (
              <div className="templates-empty-day">
                <p>No muscle groups added yet.</p>
                <p className="hint">Tap the + button to add a muscle group.</p>
              </div>
            ) : (
              <div className="templates-muscle-groups-list">
                {activeDay.muscleGroups.map((muscleGroup, mgIndex) => (
                  <div key={muscleGroup.id} className="templates-muscle-group-row">
                    <div className="templates-muscle-group-reorder">
                      <button
                        className="btn btn-icon btn-ghost btn-sm"
                        onClick={() => moveMuscleGroup(muscleGroup.id, "up")}
                        disabled={mgIndex === 0}
                        aria-label="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        className="btn btn-icon btn-ghost btn-sm"
                        onClick={() => moveMuscleGroup(muscleGroup.id, "down")}
                        disabled={mgIndex === activeDay.muscleGroups.length - 1}
                        aria-label="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <div className="templates-muscle-group-content">
                      <div className="templates-muscle-group-header">
                        <span
                          className="muscle-group-indicator-bar"
                          style={{ backgroundColor: muscleGroupColors[muscleGroup.muscleGroup] }}
                        />
                        <span className="templates-muscle-group-name">
                          {muscleGroupLabels[muscleGroup.muscleGroup]}
                        </span>
                      </div>

                      {muscleGroup.exercises.map((templateExercise) => {
                        const exercise = getExerciseById(templateExercise.exerciseId);

                        return (
                          <div
                            key={templateExercise.id}
                            className={`templates-exercise-row ${exercise ? "has-selected-exercise" : ""}`}
                          >
                            <button
                              className={`templates-exercise-btn ${exercise ? "has-exercise" : ""}`}
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
                              <div className="templates-set-count-control">
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
                                <span className="templates-set-count-value">
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
                      className="btn btn-icon btn-ghost templates-muscle-group-delete"
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
          {error && <p className="templates-error">{error}</p>}

          {/* Footer */}
          <div className="templates-editor-footer">
            <button
              type="button"
              className="btn btn-icon templates-fab"
              onClick={() => setShowMuscleGroupSelector(true)}
              aria-label="Add muscle group"
            >
              <Plus size={24} />
            </button>

            <button className="btn btn-accent templates-save-btn" onClick={saveTemplate}>
              {editingTemplate ? "SAVE CHANGES" : "CREATE TEMPLATE"}
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
            onCreateExercise={handleCreateExercise}
            initialMuscleGroup={exerciseSelectorTarget.muscleGroup}
          />
        )}
      </>
    );
  }

  // List view
  return (
    <div className="page templates-page" onClick={handleClickOutside}>
      <header className="page-header">
        <h1 className="page-title">Templates</h1>
        <button className="btn btn-secondary btn-sm" onClick={openCreateTemplate}>
          <Plus size={16} />
          NEW
        </button>
      </header>

      {templates.length === 0 ? (
        <div className="templates-empty">
          <p>No templates yet.</p>
          <p className="hint">Create one to quickly start workouts.</p>
        </div>
      ) : (
        <div className="templates-list">
          {templates.map((template) => {
            const stats = getTemplateStats(template);

            return (
              <div key={template.id} className="template-card card">
                <div className="template-card-header">
                  <div className="template-card-info">
                    <h3 className="template-card-name">{template.name}</h3>
                    <span className="template-card-summary">
                      {stats.dayCount > 1 && `${stats.dayCount} days · `}
                      {stats.exerciseCount} exercise{stats.exerciseCount !== 1 ? "s" : ""} ·{" "}
                      {stats.setCount} set{stats.setCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="template-kebab-menu">
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(template.id);
                      }}
                      aria-label="More options"
                      aria-expanded={openMenuId === template.id}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === template.id && (
                      <div className="template-kebab-dropdown">
                        <button
                          className="template-kebab-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            openEditTemplate(template);
                          }}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          className="template-kebab-item template-kebab-item-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            deleteTemplate(template.id);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="template-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <Play size={16} />
                    START
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDaySelector && selectedTemplate && (
        <DaySelector
          template={selectedTemplate}
          exercises={allExercises}
          onSelect={(day) => startFromTemplateDay(selectedTemplate, day)}
          onClose={() => {
            setShowDaySelector(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}
