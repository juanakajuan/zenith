import { useEffect } from "react";
import { X, Play } from "lucide-react";

import type { WorkoutTemplate, TemplateDay, Exercise } from "../types";
import { muscleGroupLabels, muscleGroupColors } from "../types";

import "./DaySelector.css";

interface DaySelectorProps {
  template: WorkoutTemplate;
  exercises: Exercise[];
  onSelect: (day: TemplateDay) => void;
  onClose: () => void;
}

export function DaySelector({ template, exercises, onSelect, onClose }: DaySelectorProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getExerciseById = (id: string | null) => {
    if (!id) return null;
    return exercises.find((e) => e.id === id) ?? null;
  };

  const getDayStats = (day: TemplateDay) => {
    let exerciseCount = 0;
    let setCount = 0;

    day.muscleGroups.forEach((mg) => {
      mg.exercises.forEach((ex) => {
        if (ex.exerciseId) {
          exerciseCount++;
          setCount += ex.setCount;
        }
      });
    });

    return { exerciseCount, setCount };
  };

  const getUniqueMuscleGroups = (day: TemplateDay) => {
    const groups = new Set(day.muscleGroups.map((mg) => mg.muscleGroup));
    return Array.from(groups);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal day-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{template.name}</h2>
            <p className="day-selector-subtitle">Select a day to start</p>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="day-selector-list">
          {template.days.map((day) => {
            const stats = getDayStats(day);
            const muscleGroups = getUniqueMuscleGroups(day);

            return (
              <button key={day.id} className="day-selector-item" onClick={() => onSelect(day)}>
                <div className="day-selector-item-content">
                  <div className="day-selector-item-header">
                    <span className="day-selector-item-name">{day.name}</span>
                    <span className="day-selector-item-stats">
                      {stats.exerciseCount} exercise{stats.exerciseCount !== 1 ? "s" : ""} ·{" "}
                      {stats.setCount} set{stats.setCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="day-selector-muscle-groups">
                    {muscleGroups.map((group) => (
                      <span key={group} className="day-selector-muscle-tag">
                        <span
                          className="day-selector-muscle-indicator"
                          style={{ backgroundColor: muscleGroupColors[group] }}
                        />
                        {muscleGroupLabels[group]}
                      </span>
                    ))}
                  </div>

                  <div className="day-selector-exercises-preview">
                    {day.muscleGroups.slice(0, 3).map((mg) =>
                      mg.exercises
                        .filter((ex) => ex.exerciseId)
                        .slice(0, 1)
                        .map((ex) => {
                          const exercise = getExerciseById(ex.exerciseId);
                          return exercise ? (
                            <span key={ex.id} className="day-selector-exercise-name">
                              {exercise.name}
                            </span>
                          ) : null;
                        })
                    )}
                    {day.muscleGroups.length > 3 && (
                      <span className="day-selector-more">+{day.muscleGroups.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="day-selector-item-action">
                  <Play size={20} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
