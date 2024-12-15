import { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { SpeedGauge } from "./SpeedGauge";
import { toast } from "@/components/ui/use-toast";

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 51.505,
  lng: -0.09
};

interface MapViewProps {
  speed: number;
}

export const MapView = ({ speed }: MapViewProps) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("Updated position:", position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enable GPS.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full h-screen">
      <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={15}
        />
      </LoadScript>
      <div className="absolute top-4 right-4 z-10">
        <SpeedGauge 
          speed={speed} 
          maxSpeed={120} 
          className="bg-black/20 backdrop-blur-sm rounded-full p-2"
        />
      </div>
    </div>
  );
};