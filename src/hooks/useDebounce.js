import { useEffect, useState } from "react";

// useDebounce(value, delay) returns the "quiet" value: the last `value` that stayed unchanged for `delay` ms.
// On the first render it returns `value` as is. Every change (of value or delay) cancels the previous timer
// in the effect cleanup, so intermediate values are never returned and no timer survives an unmount.
export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Cleanup: runs before the effect repeats (new value or delay) and on unmount.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
