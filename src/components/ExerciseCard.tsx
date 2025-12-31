import { Clock } from "lucide-react";

import type { Exercise } from "../types";
import { exerciseTypeLabels, muscleGroupLabels, getMuscleGroupClassName } from "../types";

import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  isDefault?: boolean;
  lastPerformed?: string | null;
}

export function ExerciseCard({
  exercise,
  onClick,
  isDefault = false,
  lastPerformed,
}: ExerciseCardProps) {
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
      {lastPerformed && (
        <div className="exercise-last-performed">
          <Clock size={14} />
          <span>Last performed {lastPerformed}</span>
        </div>
      )}
      {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
    </div>
  );
}
