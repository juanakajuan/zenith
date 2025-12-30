import type { Exercise, Workout, WorkoutTemplate } from "../types";

/**
 * localStorage keys used throughout the application.
 * All keys are prefixed with "zenith_" to avoid conflicts with other applications.
 */
export const STORAGE_KEYS = {
  EXERCISES: "zenith_exercises",
  WORKOUTS: "zenith_workouts",
  ACTIVE_WORKOUT: "zenith_active_workout",
  TEMPLATES: "zenith_templates",
} as const;

/**
 * Pre-populated default exercises provided by the application.
 * Re-exported from the defaultExercises module.
 */
export { DEFAULT_EXERCISES } from "../data/defaultExercises";

/**
 * Generates a unique identifier for database entities.
 * Uses a combination of timestamp and random string to ensure uniqueness.
 *
 * @returns A unique ID string in the format "{timestamp}-{randomString}"
 *
 * @example
 * generateId() // Returns "1704067200000-a7b3k9x"
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Checks if an exercise ID belongs to a default exercise.
 * Default exercises have IDs prefixed with "default-" and cannot be deleted.
 *
 * @param exerciseId - The exercise ID to check
 * @returns True if the exercise is a default exercise, false otherwise
 *
 * @example
 * isDefaultExercise("default-bench-press") // Returns true
 * isDefaultExercise("1704067200000-a7b3k9x") // Returns false
 */
export function isDefaultExercise(exerciseId: string): boolean {
  return exerciseId.startsWith("default-");
}

/**
 * Retrieves all user-created exercises from localStorage.
 * Does not include default exercises.
 *
 * @returns Array of user exercises, or empty array if none exist or on error
 *
 * @example
 * const exercises = getExercises();
 * console.log(`Found ${exercises.length} user exercises`);
 */
export function getExercises(): Exercise[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Saves user-created exercises to localStorage.
 * Overwrites any existing exercises.
 *
 * @param exercises - Array of exercises to save
 *
 * @example
 * const exercises = [...getExercises(), newExercise];
 * saveExercises(exercises);
 */
export function saveExercises(exercises: Exercise[]): void {
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
}

/**
 * Retrieves all completed workouts from localStorage.
 * Workouts are returned in the order they were saved.
 *
 * @returns Array of completed workouts, or empty array if none exist or on error
 *
 * @example
 * const workouts = getWorkouts();
 * const recentWorkouts = workouts.slice(-5); // Get last 5 workouts
 */
export function getWorkouts(): Workout[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Saves completed workouts to localStorage.
 * Overwrites the entire workout history.
 *
 * @param workouts - Array of workouts to save
 *
 * @example
 * const workouts = [...getWorkouts(), completedWorkout];
 * saveWorkouts(workouts);
 */
export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
}

/**
 * Retrieves the currently active (in-progress) workout from localStorage.
 * There can only be one active workout at a time.
 *
 * @returns The active workout object, or null if no workout is in progress or on error
 *
 * @example
 * const activeWorkout = getActiveWorkout();
 * if (activeWorkout) {
 *   console.log(`Resuming workout: ${activeWorkout.name}`);
 * }
 */
export function getActiveWorkout(): Workout | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Saves or clears the active workout in localStorage.
 * Pass null to clear the active workout (e.g., after completing or canceling).
 *
 * @param workout - The workout to save as active, or null to clear
 *
 * @example
 * // Start a new workout
 * saveActiveWorkout(newWorkout);
 *
 * // Complete the workout (clear active state)
 * saveActiveWorkout(null);
 */
export function saveActiveWorkout(workout: Workout | null): void {
  if (workout) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  }
}

/**
 * Retrieves all workout templates from localStorage.
 * Templates allow users to quickly start predefined workout routines.
 *
 * @returns Array of workout templates, or empty array if none exist or on error
 *
 * @example
 * const templates = getTemplates();
 * const pplTemplate = templates.find(t => t.name === "PPL Split");
 */
export function getTemplates(): WorkoutTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Saves workout templates to localStorage.
 * Overwrites any existing templates.
 *
 * @param templates - Array of templates to save
 *
 * @example
 * const templates = [...getTemplates(), newTemplate];
 * saveTemplates(templates);
 */
export function saveTemplates(templates: WorkoutTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}
