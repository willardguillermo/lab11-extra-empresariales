import { useCallback, useEffect, useRef, useState } from "react";

const IDLE = { status: "idle", plan: null, result: null, error: null };

// useAgentRun(runAgent) is the state machine of a plan run:
//
//   idle ──start(plan)──▶ running ──ok, R1──▶ done
//                            ├──ok, R2──▶ awaiting_approval ──approve()──▶ done
//                            └──fails──▶ error
//   reject() in running or awaiting_approval cancels and goes back to idle.
//
// Security rule: an R2 plan NEVER goes from running to done; only approve() applies it.
// Every hook is called on every render, in the same order, even while runAgent is still missing.
export default function useAgentRun(runAgent) {
  const [run, setRun] = useState(IDLE);
  // The latest state, readable inside start/approve/reject without waiting for a render.
  const latest = useRef(IDLE);
  // The AbortController of the current run.
  const controller = useRef(null);

  const update = useCallback((next) => {
    latest.current = next;
    setRun(next);
  }, []);

  // On unmount: abort the run in progress. Its promise then sees `signal.aborted` and does not touch the state.
  useEffect(() => {
    return () => controller.current?.abort();
  }, []);

  const start = useCallback(
    (plan) => {
      if (!runAgent) return; // The app is not connected yet: stay in idle.
      const { status } = latest.current;
      if (status === "running" || status === "awaiting_approval") return;

      const current = new AbortController();
      controller.current = current;
      update({ status: "running", plan, result: null, error: null });

      let request;
      try {
        request = Promise.resolve(runAgent(plan, { signal: current.signal }));
      } catch (error) {
        request = Promise.reject(error);
      }

      request.then(
        (result) => {
          if (current.signal.aborted) return;
          // R2 waits for the person; only R1 is applied directly.
          const status = plan.risk === "R1" ? "done" : "awaiting_approval";
          update({ status, plan, result, error: null });
        },
        (error) => {
          if (current.signal.aborted) return;
          update({ status: "error", plan, result: null, error });
        }
      );
    },
    [runAgent, update]
  );

  const approve = useCallback(() => {
    if (latest.current.status !== "awaiting_approval") return;
    update({ ...latest.current, status: "done" });
  }, [update]);

  const reject = useCallback(() => {
    const { status } = latest.current;
    if (status !== "running" && status !== "awaiting_approval") return;
    controller.current?.abort();
    update(IDLE);
  }, [update]);

  return { ...run, start, approve, reject };
}
