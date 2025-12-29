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
  weight: number; // lbs
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
  date: string; // ISO date
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface TemplateExercise {
  id: string;
  exerciseId: string;
  setCount: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
}

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
