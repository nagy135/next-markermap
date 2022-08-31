import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useCallback, memo } from "react";
import { defaultMapCenter, defaultZoom } from "../constants";
import Profile from "./profile";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapComponent() {
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
      <Profile />
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultMapCenter}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      ) : (
        <div>loading ...</div>
      )}
    </>
  );
}

export default memo(MapComponent);
