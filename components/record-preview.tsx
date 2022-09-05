import { RecordWithImages } from "@ctypes/response";
import { MouseEvent, useRef } from "react";
interface IImagePreview {
  open: boolean;
  toggleOpen: (state: boolean) => void;
  record: RecordWithImages | null;
}

const RecordPreview: React.FC<IImagePreview> = ({
  open,
  toggleOpen,
  record,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const clickedAround = (e: MouseEvent<HTMLElement>) => {
    if (e.target == modalRef.current) toggleOpen(false);
  };
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
          {record ? (
            <div>
              <h3 className="font-bold text-lg text-center">{record.name}</h3>
              <p className="py-4">{record.description}</p>
              {record.images.map((e, i) => (
                <img src={e.path} key={`image-${i}`} alt={`image-${i}`} />
              ))}
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <th>Latitude</th>
                      <td>{record.lat}</td>
                    </tr>
                    <tr>
                      <th>Longitude</th>
                      <td>{record.lon}</td>
                    </tr>
                    <tr>
                      <th>Altitude</th>
                      <td>{record.alt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RecordPreview;
