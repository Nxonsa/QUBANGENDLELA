import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpeedGauge } from "./SpeedGauge";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./SearchBar";

const defaultCenter = {
  lat: 51.505,
  lng: -0.09
};

interface MapViewProps {
  speed: number;
  onAccidentDetected?: () => void;
}

export const MapView = ({ speed, onAccidentDetected }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const lastSpeedRef = useRef(speed);
  const lastSpeedTimeRef = useRef(Date.now());

  // Check for sudden speed changes that might indicate an accident
  useEffect(() => {
    const timeDiff = (Date.now() - lastSpeedTimeRef.current) / 1000;
    const speedDiff = lastSpeedRef.current - speed;
    
    if (timeDiff <= 10 && speedDiff > 90) {
      console.log("Potential accident detected!", {
        previousSpeed: lastSpeedRef.current,
        currentSpeed: speed,
        timeDiff,
        speedDiff
      });
      
      toast({
        title: "⚠️ Potential Accident Detected",
        description: "Emergency services have been notified. Stay calm.",
        variant: "destructive",
      });
      
      if (onAccidentDetected) {
        onAccidentDetected();
      }
    }
    
    lastSpeedRef.current = speed;
    lastSpeedTimeRef.current = Date.now();
  }, [speed, onAccidentDetected]);

  useEffect(() => {
    const initializeMap = async () => {
      if (map.current || !mapContainer.current) return;

      try {
        const { data: { secret: mapboxToken } } = await supabase.functions.invoke('get-mapbox-token');
        
        if (!mapboxToken) {
          throw new Error('Mapbox token not found');
        }

        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [currentPosition.lng, currentPosition.lat],
          zoom: 15
        });

        // Add navigation controls to the top-right corner
        const navControl = new mapboxgl.NavigationControl();
        map.current.addControl(navControl, 'top-right');

        // Add geolocate control below the navigation control
        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        });
        map.current.addControl(geolocateControl, 'top-right');

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Map Error",
          description: "Unable to initialize map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    if (navigator.geolocation) {
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

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4 z-10">
        <div className="flex flex-col gap-2">
          <div className="h-[40px]" /> {/* Spacer for the geolocate control */}
          <div className="h-[40px]" /> {/* Spacer for the navigation control */}
          <SearchBar map={map.current} />
        </div>
      </div>
      
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="fixed bottom-8 left-8 z-10">
        <SpeedGauge 
          speed={speed} 
          maxSpeed={180} 
          className="bg-black/20 backdrop-blur-sm rounded-full p-2 shadow-lg w-32 h-32"
        />
      </div>
    </div>
  );
};