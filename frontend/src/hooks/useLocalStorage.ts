import { useState } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStorageValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  const remove = () => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  };

  return [value, setStorageValue, remove] as const;
}