import { TGetRecordsResponse } from "@ctypes/response";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import getRecords from "../services/internal/api/get-records";
import { useState, useCallback, memo } from "react";
import { defaultMapCenter, defaultZoom } from "../constants";
import Profile from "./profile";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapComponent() {
  const [records, setRecords] = useState<TGetRecordsResponse>([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    getRecords().then((response) => setRecords(response));
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <>
      <Profile />
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultMapCenter}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <>
            {records.map((e) => (
              <MarkerF title={e.name} position={{ lat: e.lat, lng: e.lon }} />
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
