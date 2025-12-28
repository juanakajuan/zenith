import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, DEFAULT_EXERCISES } from "../utils/storage";
import type { Exercise, Workout } from "../types";
import { WorkoutDetailModal } from "../components/WorkoutDetailModal";
import "./HistoryPage.css";

export function HistoryPage() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  const [userExercises] = useLocalStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Merge default exercises with user exercises
  const allExercises = [...DEFAULT_EXERCISES, ...userExercises];

  const getExerciseById = (id: string) => allExercises.find((e) => e.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getWorkoutStats = (workout: Workout) => {
    const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets.length, 0);
    const completedSets = workout.exercises.reduce(
      (acc, e) => acc + e.sets.filter((s) => s.completed).length,
      0
    );
    const totalVolume = workout.exercises.reduce(
      (acc, e) => acc + e.sets.reduce((setAcc, s) => setAcc + s.weight * s.reps, 0),
      0
    );
    return { totalSets, completedSets, totalVolume };
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      setWorkouts(workouts.filter((w) => w.id !== id));
      setSelectedWorkout(null);
    }
  };

  // Group workouts by month
  const groupedWorkouts = workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      if (!acc[monthKey]) {
        acc[monthKey] = { label: monthLabel, workouts: [] };
      }
      acc[monthKey].workouts.push(workout);
      return acc;
    },
    {} as Record<string, { label: string; workouts: Workout[] }>
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">History</h1>
        {workouts.length > 0 && <span className="workout-count">{workouts.length} workouts</span>}
      </header>

      {workouts.length === 0 ? (
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
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
          <p>No completed workouts yet.</p>
          <p className="hint">Your workout history will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {Object.entries(groupedWorkouts).map(([monthKey, { label, workouts: monthWorkouts }]) => (
            <div key={monthKey} className="history-month">
              <h2 className="month-title">{label}</h2>
              <div className="month-workouts">
                {monthWorkouts.map((workout) => {
                  const stats = getWorkoutStats(workout);
                  return (
                    <button
                      key={workout.id}
                      className="history-card card"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      <div className="history-card-header">
                        <div className="history-card-date">{formatDate(workout.date)}</div>
                        <div className="history-card-volume">
                          {stats.totalVolume.toLocaleString()} lbs
                        </div>
                      </div>
                      <h3 className="history-card-name">{workout.name}</h3>
                      <div className="history-card-meta">
                        <span>{workout.exercises.length} exercises</span>
                        <span className="dot">•</span>
                        <span>
                          {stats.completedSets}/{stats.totalSets} sets
                        </span>
                      </div>
                      <div className="history-card-exercises">
                        {workout.exercises.slice(0, 3).map((we) => {
                          const exercise = getExerciseById(we.exerciseId);
                          return exercise ? (
                            <span key={we.id} className="tag tag-muted">
                              {exercise.name}
                            </span>
                          ) : null;
                        })}
                        {workout.exercises.length > 3 && (
                          <span className="more-exercises">
                            +{workout.exercises.length - 3} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWorkout && (
        <WorkoutDetailModal
          workout={selectedWorkout}
          exercises={allExercises}
          onClose={() => setSelectedWorkout(null)}
          onDelete={() => handleDeleteWorkout(selectedWorkout.id)}
        />
      )}
    </div>
  );
}
