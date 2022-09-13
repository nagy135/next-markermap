import getUsers from "../services/internal/api/get-users";
import { useQuery } from "@tanstack/react-query";
import {
  FC,
  useRef,
  MouseEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { TGetRecordsRequest } from "@ctypes/request";

interface IFilter {
  open: boolean;
  toggleOpen: (state: boolean) => void;
  filters: TGetRecordsRequest;
  setFilters: Dispatch<SetStateAction<TGetRecordsRequest>>;
  filterLoading: boolean;
}

const Filter: FC<IFilter> = ({
  open,
  toggleOpen,
  filters,
  setFilters,
  filterLoading,
}) => {
  const { data: users } = useQuery(["users"], () => getUsers());
  const modalRef = useRef<HTMLDivElement>(null);
  const clickedAround = (e: MouseEvent<HTMLElement>) => {
    if (e.target == modalRef.current) toggleOpen(false);
  };

  const handleAddEmailFilter = (email: string | null) => {
    if (email === null) setFilters({ email: [] });
    else {
      setFilters((prev) => {
        const newVal = { ...prev };
        if (newVal.email.includes(email)) {
          newVal.email = newVal.email.filter((e) => e != email);
        } else newVal.email.push(email);
        return newVal;
      });
    }
  };

  const isSelectedEmail = useCallback(
    (email: string) => filters.email.includes(email),
    [filters]
  );
  if (!open) return null;
  return (
    <div onClick={(e) => clickedAround(e)}>
      <input
        type="checkbox"
        id="show-image-modal"
        className="modal-toggle"
        readOnly
        checked={open}
      />
      <div ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          {filterLoading ? (
            <label className="btn loading btn-sm animate-spin btn-info btn-circle absolute left-2 top-2">
            </label>
          ) : null}
          <label
            htmlFor="show-image-modal"
            onClick={() => toggleOpen(false)}
            className="btn btn-sm btn-error btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-center">Filter</h3>
          {users?.length ? (
            <div>
              <div key={"wrapper-all"} className="flex my-2">
                <input
                  type="checkbox"
                  name="user-all"
                  key="user-all"
                  checked={!filters.email.length}
                  onChange={() => handleAddEmailFilter(null)}
                  className="checkbox mr-2"
                />
                <label key="label-user-all" htmlFor="user-all">
                  All
                </label>
              </div>
              {users.map((e, i) => {
                const name = `user-${i}`;
                return (
                  <div key={"wrapper-" + name} className="flex my-2">
                    <input
                      type="checkbox"
                      name={name}
                      key={name}
                      checked={isSelectedEmail(e)}
                      onChange={() => handleAddEmailFilter(e)}
                      className="checkbox mr-2"
                    />
                    <label key={"label-" + name} htmlFor={name}>
                      {e}
                    </label>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

interface IFilterButton {
  toggleOpen: (state: boolean) => void;
  filtersEnabled: boolean;
}

export const FilterButton: FC<IFilterButton> = ({ toggleOpen, filtersEnabled }) => {
  return (
    <button
      className={`btn m-1 ${filtersEnabled ? "btn-error" : ""}`}
      onClick={() => toggleOpen(true)}
    >
      Filters <br/>{filtersEnabled ? "(active)" : ""}
    </button>
  );
};

export default Filter;
