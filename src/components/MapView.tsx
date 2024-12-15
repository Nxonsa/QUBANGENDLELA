import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpeedGauge } from "./SpeedGauge";
import { toast } from "@/components/ui/use-toast";

const defaultCenter = {
  lat: 51.505,
  lng: -0.09
};

interface MapViewProps {
  speed: number;
}

export const MapView = ({ speed }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  useEffect(() => {
    // Initialize map
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentPosition.lng, currentPosition.lat],
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Request GPS permission and watch position
    if (navigator.geolocation) {
      // First, show a toast guiding the user to enable GPS
      toast({
        title: "GPS Required",
        description: "Please enable GPS for real-time location tracking. Check your device settings if prompted.",
      });

      navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(newPosition);
          
          // Update map center
          if (map.current) {
            map.current.setCenter([newPosition.lng, newPosition.lat]);
          }
          
          console.log("Updated position:", position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your current location. ";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please enable GPS in your device settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
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