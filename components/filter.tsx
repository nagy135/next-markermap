import getUsers from "../services/internal/api/get-users";
import { useQuery } from "@tanstack/react-query";
import { FC, useRef, MouseEvent, Dispatch, SetStateAction } from "react";
import { TGetRecordsRequest } from "@ctypes/request";

interface IFilter {
  open: boolean;
  toggleOpen: (state: boolean) => void;
  filters: TGetRecordsRequest;
  setFilters: Dispatch<SetStateAction<TGetRecordsRequest>>;
  invalidateRecords: () => void;
}

const Filter: FC<IFilter> = ({ open, toggleOpen, filters, setFilters, invalidateRecords }) => {
  const { data: users } = useQuery(["users"], () => getUsers());
  const modalRef = useRef<HTMLDivElement>(null);
  const clickedAround = (e: MouseEvent<HTMLElement>) => {
    if (e.target == modalRef.current) toggleOpen(false);
  };

  const handleAddEmailFilter = (email: string) => {
    setFilters((prev) => {
      prev.email = prev.email ?? [];

      if (prev.email.includes(email)) {
        prev.email = prev.email.filter((e) => e != email);
      } else prev.email.push(email);

      return prev;
    });
    invalidateRecords();
  };
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
              {users.map((e, i) => {
                const name = `user-${i}`;
                return (
                  <div key={"wrapper-" + name} className="flex my-2">
                    <input
                      type="checkbox"
                      name={name}
                      key={name}
                      defaultChecked={filters.email?.includes(e)}
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
  open: boolean;
  toggleOpen: (state: boolean) => void;
}

export const FilterButton: FC<IFilterButton> = ({ open, toggleOpen }) => {
  return (
    <button
      className={`btn btn-circle m-1 ${open ? "btn-error" : ""}`}
      onClick={() => toggleOpen(true)}
    >
      {open ? "Close" : "Filter"}
    </button>
  );
};

export default Filter;
