// Map component

"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api"; // Import the Google Maps API wrapper
import { StoryProps, TempMarkerProps } from "@/app/types/global.t";

const Map = ({ stories }: { stories: StoryProps[] }) => {
  const ref = useRef(null);
  const router = useRouter();
  const mapCenter = useMemo(() => ({ lat: 51.4480315, lng: 5.4587816 }), []);
  const [tempMarker, setTempMarker] = useState<TempMarkerProps>();
  const { data: session } = useSession();

  // Set the map optionss
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      tilt: 45,
      mapTypeId: "satellite",
      gestureHandling: "greedy",
    }),
    []
  );

  // Load the Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  // Handle map click events
  const onMapClick = (event: any) => {
    if (!session) return;
    setTempMarker({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
  };

  return isLoaded ? (
    <GoogleMap
      ref={ref}
      options={mapOptions}
      zoom={16}
      center={mapCenter}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      onClick={onMapClick}>
      {stories?.map((marker) => (
        <MarkerF
          key={marker.id.toString()}
          position={{
            lat: Number(marker.latitude),
            lng: Number(marker.longitude),
          }}
          onClick={() => router.push(`/read/${marker.id}`)}
          icon={{
            url: `${marker.imageUrl}#custom_marker`,
            scaledSize: new window.google.maps.Size(65, 65),
          }}
        />
      ))}
      {tempMarker !== undefined && (
        <MarkerF
          position={{
            lat: Number(tempMarker.latitude),
            lng: Number(tempMarker.longitude),
          }}
          onClick={() =>
            router.push(
              `/write?lat=${tempMarker.latitude}&lng=${tempMarker.longitude}`
            )
          }
          //   icon={{
          //     url: `/new-story.webp#custom_marker`,
          //     scaledSize: new window.google.maps.Size(50, 50),
          //   }}
        />
      )}
    </GoogleMap>
  ) : null;
};

export default Map;
