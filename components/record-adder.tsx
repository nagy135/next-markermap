import { FC } from "react";
import { useMockSession } from "../hooks/session-mock";

interface IRecordAdder {
  addingMode: boolean;
  toggleAddingMode: () => void;
}

const RecordAdder: FC<IRecordAdder> = ({ addingMode, toggleAddingMode }) => {
  const { data: session } = useMockSession();
  if (!session) return null;
  return (
    <button
      className={`btn btn-circle m-1 ${
        addingMode ? "btn-error" : ""
      }`}
      onClick={() => toggleAddingMode()}
    >
      {addingMode ? "Stop" : "Add"}
    </button>
  );
};

export default RecordAdder;
