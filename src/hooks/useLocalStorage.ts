import { useState, useEffect, useCallback } from "react";

/**
 * Custom React hook for persisting state in localStorage with cross-tab synchronization.
 * Provides a useState-like interface that automatically syncs with localStorage and
 * responds to storage changes from other tabs/windows.
 *
 * @template T - The type of value to store
 * @param key - The localStorage key to use for persistence
 * @param initialValue - Default value if no stored value exists
 * @returns A tuple of [storedValue, setValue] similar to useState
 *
 * @example
 * // Store an array of exercises
 * const [exercises, setExercises] = useLocalStorage<Exercise[]>("zenith_exercises", []);
 *
 * // Update exercises
 * setExercises([...exercises, newExercise]);
 *
 * // Use functional update
 * setExercises(prev => [...prev, newExercise]);
 *
 * @remarks
 * - Values are automatically serialized to JSON when stored and parsed when retrieved
 * - Listens to the 'storage' event to sync changes from other browser tabs
 * - Handles errors gracefully, falling back to initial value on parse errors
 * - The setValue function supports both direct values and functional updates
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
