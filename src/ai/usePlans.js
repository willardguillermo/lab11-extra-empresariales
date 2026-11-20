import { useCallback, useEffect, useState } from "react";

export default function usePlans(fetchPlans) {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // FIX 3: a late answer of a previous request (reload, new fetchPlans, unmount) must not touch the state.
    let cancelled = false;
    setPlans([]);
    setStatus("loading");
    setError(null);
    fetchPlans()
      .then((data) => {
        if (cancelled) return;
        setPlans(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        // FIX 2: a failed request must reach the "error" state, not stay in "loading" forever.
        setPlans([]);
        setError(err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPlans, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { status, plans, error, reload };
}
