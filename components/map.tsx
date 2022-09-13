import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import getRecords from "../services/internal/api/get-records";
import postRecord from "../services/internal/api/post-record";
import postImageToRecord from "../services/internal/api/post-image-to-record";
import { useState, useCallback, memo } from "react";
import { defaultMapCenter, defaultZoom } from "../constants";
import Profile from "./profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecordAdder from "./record-adder";
import { TGetRecordsRequest, TPostRecordRequest } from "@ctypes/request";
import { useMockSession } from "../hooks/session-mock";
import RecordPreview from "./record-preview";
import { RecordWithImages } from "@ctypes/response";
import Filter, { FilterButton } from "./filter";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

type TNewRecordData = {
  name: string;
  description: string;
  alt: number;
};

const newRecordDataDefault: TNewRecordData = {
  name: "",
  description: "",
  alt: 0,
};

function MapComponent() {
  // hooks {{{
  const queryClient = useQueryClient();

  // filter
  const [filters, setFilters] = useState<TGetRecordsRequest>({ email: [] });

  const { data: records, isLoading } = useQuery(["records", filters], () => getRecords(filters));
  const mutation = useMutation((newRecord: TPostRecordRequest) =>
    postRecord(newRecord)
  );
  const imageMutation = useMutation((both: { id: number; data: FormData }) =>
    postImageToRecord(both.id, both.data)
  );
  const { data: session } = useMockSession();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  // }}}

  // states {{{
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [addingMode, setAddingMode] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [addRecordModalOpen, setAddRecordModalOpen] = useState(false);
  const [addImageToRecordModalOpen, setAddImageToRecordModalOpen] =
    useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [newRecordData, setNewRecordData] =
    useState<TNewRecordData>(newRecordDataDefault);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [image, setImage] = useState<File | null>(null);


  // imagePreview
  const [imagePreviewMode, setImagePreviewMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordWithImages | null>(
    null
  );
  // }}}

  // handlers {{{
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const updateNewRecordData = (
    key: keyof TNewRecordData,
    value: string | number
  ) => {
    setNewRecordData((previous) => {
      return {
        ...previous,
        [key]: key === "alt" ? Number(value) : value,
      };
    });
  };

  const invalidateRecords = () => queryClient.invalidateQueries(["records"]);

  const toggleFilterMode = (open?: boolean) => {
    setFilterModalOpen(open ?? !filterModalOpen);
  };

  const toggleAddingMode = (open?: boolean) => {
    const newState = open ?? !addingMode;
    map?.setOptions({
      draggableCursor: newState ? "crosshair" : "default",
    });
    setAddingMode(newState);
  };

  const handleCreateNewRecord = () => {
    if (!selectedLocation || !newRecordData) return;
    setAddRecordModalOpen(false);
    setNewRecordData(newRecordDataDefault);
    mutation.mutate(
      {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        alt: newRecordData.alt,
        name: newRecordData.name,
        description: newRecordData.description,
        email: session!.user!.email!, // TODO: this should be always present at this stage, verify!
      },
      {
        onSuccess: () => {
          invalidateRecords();
          if (addImage) setAddImageToRecordModalOpen(true);
        },
      }
    );
  };

  const handleAddImageToRecord = () => {
    if (!image) {
      alert("no image selected");
      return;
    }
    if (!mutation.data?.id) {
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    imageMutation.mutate(
      {
        id: mutation.data.id,
        data: formData,
      },
      {
        onSuccess: () => {
          invalidateRecords();
        },
        onError: (error) => {
          if (error instanceof Error) alert("error: " + error.message);
        },
      }
    );
    setAddImageToRecordModalOpen(false);
  };

  const mapClick = (e: google.maps.MapMouseEvent) => {
    if (!addingMode) return;
    const lat = e.latLng?.lat();
    const lon = e.latLng?.lng();
    if (!lat || !lon) return;
    toggleAddingMode(false);
    setSelectedLocation({
      lat,
      lon,
    });
    setAddRecordModalOpen(true);
  };

  const markerClick = (record: RecordWithImages) => {
    setSelectedRecord(record);
    setImagePreviewMode(true);
  };
  // }}}

  return (
    <>
      <div className="absolute right-1 top-1/2 z-50 flex flex-col">
        <RecordAdder {...{ addingMode, toggleAddingMode }} />
        <FilterButton open={filterModalOpen} toggleOpen={toggleFilterMode} />
      </div>
      <Profile />
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultMapCenter}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={mapClick}
        >
          <>
            {records?.map((e, i) => (
              <MarkerF
                onClick={() => markerClick(e)}
                key={`marker-${i}`}
                title={e.name}
                position={{ lat: e.lat, lng: e.lon }}
              />
            ))}
          </>
        </GoogleMap>
      ) : (
        <div>loading ...</div>
      )}
      <input
        type="checkbox"
        id="add-record-modal"
        className="modal-toggle"
        readOnly
        checked={addRecordModalOpen}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="add-record-modal"
            onClick={() => setAddRecordModalOpen(false)}
            className="btn btn-sm btn-error btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-center">Add new record</h3>
          <div className="form-control">
            <label className="input-group">
              <span>Altitude</span>
              <input
                type="number"
                placeholder="0"
                className="input input-bordered w-[100%]"
                value={newRecordData.alt}
                onChange={(e) => updateNewRecordData("alt", e.target.value)}
              />
            </label>
            <label className="input-group mt-3">
              <span>Name</span>
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-[100%]"
                value={newRecordData.name}
                onChange={(e) => updateNewRecordData("name", e.target.value)}
              />
            </label>
            <label className="input-group mt-3">
              <span>Description</span>
              <input
                type="text"
                placeholder=""
                className="input input-bordered w-[100%]"
                value={newRecordData.description}
                onChange={(e) =>
                  updateNewRecordData("description", e.target.value)
                }
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Add Image</span>
              <input
                type="checkbox"
                defaultChecked={false}
                onChange={() => setAddImage((prev) => !prev)}
                className="checkbox"
              />
            </label>
          </div>
          <div className="modal-action">
            <label
              htmlFor="add-record-modal"
              className="btn"
              onClick={handleCreateNewRecord}
            >
              Create
            </label>
          </div>
        </div>
      </div>
      <input
        type="checkbox"
        id="add-image-modal"
        className="modal-toggle"
        readOnly
        checked={addImageToRecordModalOpen}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="add-image-modal"
            onClick={() => setAddImageToRecordModalOpen(false)}
            className="btn btn-sm btn-error btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-center">Add image to record</h3>
          <div className="form-control">
            <label className="input-group mt-3">
              <input
                type="file"
                className="input pl-0"
                onChange={(e) => setImage(e.target.files![0])}
              />
            </label>
          </div>
          <div className="modal-action">
            <label
              htmlFor="add-record-modal"
              className="btn"
              onClick={handleAddImageToRecord}
            >
              Add
            </label>
          </div>
        </div>
      </div>
      <RecordPreview
        open={imagePreviewMode}
        toggleOpen={setImagePreviewMode}
        record={selectedRecord}
      />
      <Filter
        open={filterModalOpen}
        toggleOpen={toggleFilterMode}
        filters={filters}
        setFilters={setFilters}
        filterLoading={isLoading}
      />
    </>
  );
}

export default memo(MapComponent);
