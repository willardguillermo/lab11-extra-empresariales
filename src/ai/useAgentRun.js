import { useCallback, useRef, useState } from "react";

const IDLE = { status: "idle", plan: null, result: null, error: null };

export default function useAgentRun(runAgent) {
  const [run, setRun] = useState(IDLE);
  // FIX 4: no early return before the hooks. Every hook runs on every render in the same order;
  // a missing runAgent is handled inside start() instead.
  const latest = useRef(IDLE);
  const controller = useRef(null);

  const update = (next) => {
    latest.current = next;
    setRun(next);
  };

  const start = useCallback(
    (plan) => {
      if (!runAgent) return;
      const { status } = latest.current;
      if (status === "running" || status === "awaiting_approval") return;

      const current = new AbortController();
      controller.current = current;
      update({ status: "running", plan, result: null, error: null });

      runAgent(plan, { signal: current.signal }).then(
        (result) => {
          if (current.signal.aborted) return;
          // FIX 5: an R2 plan never goes from running to done; it waits for approve().
          const status = plan.risk === "R1" ? "done" : "awaiting_approval";
          update({ status, plan, result, error: null });
        },
        (error) => {
          if (current.signal.aborted) return;
          update({ status: "error", plan, result: null, error });
        }
      );
    },
    [runAgent]
  );

  const approve = useCallback(() => {
    if (latest.current.status !== "awaiting_approval") return;
    update({ ...latest.current, status: "done" });
  }, []);

  const reject = useCallback(() => {
    const { status } = latest.current;
    if (status !== "running" && status !== "awaiting_approval") return;
    controller.current?.abort();
    update(IDLE);
  }, []);

  return { ...run, start, approve, reject };
}
