import type { Exercise } from "../types";
import { chestExercises } from "./exercises/chest";
import { tricepsExercises } from "./exercises/triceps";
import { shouldersExercises } from "./exercises/shoulders";
import { backExercises } from "./exercises/back";
import { bicepsExercises } from "./exercises/biceps";
import { quadsExercises } from "./exercises/quads";
import { hamstringsExercises } from "./exercises/hamstrings";
import { glutesExercises } from "./exercises/glutes";
import { calvesExercises } from "./exercises/calves";
import { trapsExercises } from "./exercises/traps";
import { forearmsExercises } from "./exercises/forearms";
import { absExercises } from "./exercises/abs";

export const DEFAULT_EXERCISES: Exercise[] = [
  ...chestExercises,
  ...tricepsExercises,
  ...shouldersExercises,
  ...backExercises,
  ...bicepsExercises,
  ...quadsExercises,
  ...hamstringsExercises,
  ...glutesExercises,
  ...calvesExercises,
  ...trapsExercises,
  ...forearmsExercises,
  ...absExercises,
];
