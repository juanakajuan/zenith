import { useState, useEffect } from "react";

import "./WorkoutTimer.css";

/**
 * Props for the WorkoutTimer component.
 */
interface WorkoutTimerProps {
  startTime: string;
}

/**
 * Formats elapsed seconds into HH:MM:SS format.
 *
 * @param seconds - Total elapsed seconds
 * @returns Formatted time string in HH:MM:SS format
 *
 * @example
 * formatElapsedTime(3665) // Returns "1:01:05"
 * formatElapsedTime(45) // Returns "0:00:45"
 */
function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * WorkoutTimer component displays a live-updating timer showing workout duration.
 * Tracks elapsed time from the provided start time and updates every second.
 *
 * @remarks
 * Features:
 * - Displays time in HH:MM:SS format (e.g., "1:23:45")
 * - Updates automatically every second
 * - Persists across page refreshes (uses startTime from localStorage)
 * - Cleans up interval on unmount to prevent memory leaks
 * - Uses monospace font for consistent digit width
 *
 * @param props - Component props
 * @param props.startTime - ISO timestamp string of when the workout started
 *
 * @example
 * <WorkoutTimer startTime="2024-01-15T10:30:00.000Z" />
 */
export function WorkoutTimer({ startTime }: WorkoutTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // Calculate initial elapsed time
    const startTimeMs = new Date(startTime).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeMs) / 1000);
      setElapsedSeconds(elapsed);
    };

    // Update immediately
    updateElapsed();

    // Set up interval to update every second
    const interval = setInterval(updateElapsed, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="workout-timer">
      <span className="workout-timer-label">Elapsed:</span>
      <time className="workout-timer-display">{formatElapsedTime(elapsedSeconds)}</time>
    </div>
  );
}
