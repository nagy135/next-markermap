import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import getRecords from "../services/internal/api/get-records";
import { useState, useCallback, memo } from "react";
import { defaultMapCenter, defaultZoom } from "../constants";
import Profile from "./profile";
import { useQuery } from "@tanstack/react-query";
import RecordAdder from "./record-adder";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapComponent() {
  const { data: records} = useQuery(['records'], () => getRecords())
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <>
      <RecordAdder />
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
            {records?.map((e, i) => (
              <MarkerF key={`marker-${i}`} title={e.name} position={{ lat: e.lat, lng: e.lon }} />
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
