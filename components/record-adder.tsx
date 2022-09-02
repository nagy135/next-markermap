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
      className={`absolute right-1 top-1/2 z-50 btn btn-circle ${
        addingMode ? "btn-error" : ""
      }`}
      onClick={() => toggleAddingMode()}
    >
      {addingMode ? "Stop" : "Add"}
    </button>
  );
};

export default RecordAdder;
