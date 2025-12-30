/**
 * Represents a muscle group that can be targeted by exercises.
 * Used for categorizing and filtering exercises in the workout tracker.
 */
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abs"
  | "traps";

/**
 * Represents the type of equipment or method used for an exercise.
 * Used for filtering and organizing exercises by equipment availability.
 */
export type ExerciseType =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "machine-assistance"
  | "smith-machine"
  | "cable"
  | "freemotion"
  | "bodyweight"
  | "loaded-bodyweight";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  exerciseType: ExerciseType;
  notes: string;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface TemplateExercise {
  id: string;
  exerciseId: string | null;
  setCount: number;
}

export interface TemplateMuscleGroup {
  id: string;
  muscleGroup: MuscleGroup;
  exercises: TemplateExercise[];
}

export interface TemplateDay {
  id: string;
  name: string;
  muscleGroups: TemplateMuscleGroup[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  days: TemplateDay[];
}

/**
 * Array of all available muscle groups in the application.
 * Used for generating UI elements and validation.
 */
export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "abs",
  "traps",
];

/**
 * Array of all available exercise types in the application.
 * Used for generating UI elements and validation.
 */
export const EXERCISE_TYPES: ExerciseType[] = [
  "barbell",
  "dumbbell",
  "machine",
  "machine-assistance",
  "smith-machine",
  "cable",
  "freemotion",
  "bodyweight",
  "loaded-bodyweight",
];

/**
 * Human-readable labels for muscle groups.
 * Maps muscle group keys to display names for UI rendering.
 */
export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Forearms",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  abs: "Abs",
  traps: "Traps",
};

/**
 * Human-readable labels for exercise types.
 * Maps exercise type keys to display names for UI rendering.
 */
export const exerciseTypeLabels: Record<ExerciseType, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  machine: "Machine",
  "machine-assistance": "Machine Assistance",
  "smith-machine": "Smith Machine",
  cable: "Cable",
  freemotion: "Freemotion",
  bodyweight: "Bodyweight",
  "loaded-bodyweight": "Loaded Bodyweight",
};

/**
 * Color codes for muscle groups used in UI tags and visual elements.
 * Maps muscle group keys to hex color values for consistent theming.
 */
export const muscleGroupColors: Record<MuscleGroup, string> = {
  chest: "#e67a6f",
  shoulders: "#db9d5e",
  triceps: "#c99470",
  back: "#6ba3cc",
  traps: "#94b8d4",
  biceps: "#8f92cc",
  forearms: "#b58fc2",
  quads: "#6bcfb0",
  hamstrings: "#7db492",
  glutes: "#92ca7d",
  calves: "#a5d18a",
  abs: "#e8b566",
};

/**
 * Generates a CSS class name for a muscle group tag.
 *
 * @param muscleGroup - The muscle group to generate a class name for
 * @returns CSS class name in the format "tag-muscle-{muscleGroup}"
 *
 * @example
 * getMuscleGroupClassName("chest") // Returns "tag-muscle-chest"
 */
export function getMuscleGroupClassName(muscleGroup: MuscleGroup): string {
  return `tag-muscle-${muscleGroup}`;
}
