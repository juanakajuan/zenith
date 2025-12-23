import { useEffect } from "react";
import type { Exercise, Workout } from "../types";
import { muscleGroupLabels, exerciseTypeLabels } from "../types";
import "./WorkoutDetailModal.css";

interface WorkoutDetailModalProps {
  workout: Workout;
  exercises: Exercise[];
  onClose: () => void;
  onDelete: () => void;
}

export function WorkoutDetailModal({
  workout,
  exercises,
  onClose,
  onDelete,
}: WorkoutDetailModalProps) {
  const getExerciseById = (id: string) => exercises.find((e) => e.id === id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalVolume = workout.exercises.reduce(
    (acc, e) => acc + e.sets.reduce((setAcc, s) => setAcc + s.weight * s.reps, 0),
    0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal workout-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{workout.name}</h2>
            <p className="detail-date">{formatDate(workout.date)}</p>
          </div>
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

        <div className="detail-stats">
          <div className="stat">
            <span className="stat-value">{workout.exercises.length}</span>
            <span className="stat-label">Exercises</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {workout.exercises.reduce((acc, e) => acc + e.sets.length, 0)}
            </span>
            <span className="stat-label">Total Sets</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalVolume.toLocaleString()}</span>
            <span className="stat-label">Volume (lbs)</span>
          </div>
        </div>

        <div className="detail-exercises">
          {workout.exercises.map((workoutExercise) => {
            const exercise = getExerciseById(workoutExercise.exerciseId);
            if (!exercise) return null;

            return (
              <div key={workoutExercise.id} className="detail-exercise">
                <div className="detail-exercise-header">
                  <span className="tag tag-accent">{muscleGroupLabels[exercise.muscleGroup]}</span>
                  <h3 className="detail-exercise-name">{exercise.name}</h3>
                  <span className="detail-exercise-type">
                    {exerciseTypeLabels[exercise.exerciseType]}
                  </span>
                </div>
                <div className="detail-sets">
                  {workoutExercise.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className={`detail-set ${set.completed ? "completed" : "skipped"}`}
                    >
                      <span className="set-num">{index + 1}</span>
                      <span className="set-data">
                        {set.weight} lbs × {set.reps} reps
                      </span>
                      {set.completed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="check-icon"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary delete-workout-btn" onClick={onDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Delete Workout
          </button>
        </div>
      </div>
    </div>
  );
}
