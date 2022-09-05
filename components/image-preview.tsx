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
  return (
    <>
      <input
        type="checkbox"
        id="add-image-modal"
        className="modal-toggle"
        readOnly
        checked={open}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            onClick={() => toggleOpen(false)}
            className="btn btn-sm btn-error btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-center">Image</h3>
          {imageUrls
            ? imageUrls.map((e, i) => <img src={e} key={`image-${i}`} alt={`image-${i}`} />)
            : null}
        </div>
      </div>
    </>
  );
};

export default ImagePreview;
