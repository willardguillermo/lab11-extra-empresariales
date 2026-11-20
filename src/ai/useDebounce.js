import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    // FIX 1: the cleanup cancels the previous timer every time the effect repeats, not only on unmount.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
