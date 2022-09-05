import { MouseEvent, useRef } from "react";
interface IImagePreview {
  open: boolean;
  toggleOpen: (state: boolean) => void;
  imageUrls: string[];
}

const ImagePreview: React.FC<IImagePreview> = ({
  open,
  toggleOpen,
  imageUrls,
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
          <h3 className="font-bold text-lg text-center">Image</h3>
          {imageUrls
            ? imageUrls.map((e, i) => (
                <img src={e} key={`image-${i}`} alt={`image-${i}`} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
