import { useCallback, useEffect, useState } from "react";

const LOADING = { status: "loading", plans: [], error: null };

// usePlans(fetchPlans) loads the agent's plans and resolves the three states of a request:
// "loading" | "ready" | "error". reload() asks again. A late answer from a previous request (after a
// reload, a new fetchPlans or an unmount) is ignored, so a slow old response never overwrites a new one.
export default function usePlans(fetchPlans) {
  const [state, setState] = useState(LOADING);
  // Bumping this counter repeats the effect: that is how reload() asks again.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState(LOADING);

    fetchPlans().then(
      (plans) => {
        if (!cancelled) setState({ status: "ready", plans, error: null });
      },
      (error) => {
        if (!cancelled) setState({ status: "error", plans: [], error });
      }
    );

    // Cleanup: the answer of this request no longer belongs to the screen.
    return () => {
      cancelled = true;
    };
  }, [fetchPlans, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
