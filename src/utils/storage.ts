import type { Exercise, Workout } from "../types";

export const STORAGE_KEYS = {
  EXERCISES: "zenith_exercises",
  WORKOUTS: "zenith_workouts",
  ACTIVE_WORKOUT: "zenith_active_workout",
} as const;

export { DEFAULT_EXERCISES } from "../data/defaultExercises";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function isDefaultExercise(exerciseId: string): boolean {
  return exerciseId.startsWith("default-");
}

export function getExercises(): Exercise[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveExercises(exercises: Exercise[]): void {
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
}

export function getWorkouts(): Workout[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
}

export function getActiveWorkout(): Workout | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveActiveWorkout(workout: Workout | null): void {
  if (workout) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  }
}
