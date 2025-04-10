'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * A hook for managing state that's persisted in sessionStorage.
 *
 * @param key The key to store the value under in sessionStorage
 * @param initialValue The initial value to use if no value is found in sessionStorage
 * @returns A tuple of [storedValue, setValue] - similar to useState
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // State to store our value
  // Initialize with the value from sessionStorage if available, otherwise use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Memoized version of the setValue function
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to sessionStorage
        if (isBrowser) {
          sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [isBrowser, key, storedValue]
  );

  // Listen for changes to sessionStorage from other tabs/windows
  useEffect(() => {
    if (!isBrowser) return;

    // Update state when storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        try {
          const newValue = event.newValue
            ? JSON.parse(event.newValue)
            : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Error handling storage event for key "${key}":`,
            error
          );
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isBrowser, initialValue, key]);

  return [storedValue, setValue];
}
