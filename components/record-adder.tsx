import { useState } from "react";
import { useMockSession } from "../hooks/session-mock";

export default function RecordAdder() {
  const { data: session } = useMockSession();
  const [addingMode, setAddingMode] = useState(false);
  if (!session) return null;
  return (
    <button
      className={`absolute right-0 top-1/2 z-50 btn btn-circle ${
        addingMode ? "btn-error" : ""
      }`}
      onClick={() => setAddingMode((e) => !e)}
    >
      {addingMode ? "Stop" : "Add"}
    </button>
  );
}
