import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import getRecords from "../services/internal/api/get-records";
import postRecord from "../services/internal/api/post-record";
import { useState, useCallback, memo } from "react";
import { defaultMapCenter, defaultZoom } from "../constants";
import Profile from "./profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecordAdder from "./record-adder";
import { TPostRecordRequest } from "@ctypes/request";
import { useMockSession } from "../hooks/session-mock";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapComponent() {
  // hooks {{{
  const queryClient = useQueryClient();
  const { data: records } = useQuery(["records"], () => getRecords());
  const mutation = useMutation((newRecord: TPostRecordRequest) =>
    postRecord(newRecord)
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
  // }}}

  // handlers {{{
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleAddingMode = () => {
    map?.setOptions({
      draggableCursor: addingMode ? "default" : "crosshair",
    });
    setAddingMode(!addingMode);
  };

  const mapClick = (e: google.maps.MapMouseEvent) => {
    if (!addingMode) return;
    const lat = e.latLng?.lat();
    const lon = e.latLng?.lng();
    if (!lat || !lon) return;
    toggleAddingMode();
    mutation.mutate(
      {
        lat,
        lon,
        alt: 0,
        name: "test",
        description: "",
        email: session!.user!.email!, // TODO: this should be always present at this stage, verify!
      },
      {
        onSuccess: () => queryClient.invalidateQueries(["records"]),
      }
    );
  };
  // }}}

  return (
    <>
      <RecordAdder {...{ addingMode, toggleAddingMode }} />
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
    </>
  );
}

export default memo(MapComponent);
