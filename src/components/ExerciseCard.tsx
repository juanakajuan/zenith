import type { Exercise } from "../types";
import { exerciseTypeLabels, muscleGroupLabels, getMuscleGroupClassName } from "../types";

import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  isDefault?: boolean;
}

/**
 * Card component for displaying exercise information.
 * Shows the exercise name, muscle group, exercise type, and optional notes.
 * Can be marked as a default exercise with a special tag.
 *
 * @param props - Component props
 *
 * @example
 * <ExerciseCard
 *   exercise={benchPress}
 *   onClick={() => handleEdit(benchPress)}
 *   isDefault={false}
 * />
 */
export function ExerciseCard({ exercise, onClick, isDefault = false }: ExerciseCardProps) {
  return (
    <div className="exercise-card card" onClick={onClick}>
      <h3 className="exercise-name">{exercise.name}</h3>
      <div className="exercise-card-meta">
        <span className={`tag ${getMuscleGroupClassName(exercise.muscleGroup)}`}>
          {muscleGroupLabels[exercise.muscleGroup]}
        </span>
        <span className="tag tag-muted">{exerciseTypeLabels[exercise.exerciseType]}</span>
        {isDefault && <span className="tag tag-default">Default</span>}
      </div>
      {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
    </div>
  );
}
