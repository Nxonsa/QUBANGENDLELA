import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpeedGauge } from "./SpeedGauge";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const lastSpeedRef = useRef(speed);
  const lastSpeedTimeRef = useRef(Date.now());

  // Check for sudden speed changes that might indicate an accident
  useEffect(() => {
    const timeDiff = (Date.now() - lastSpeedTimeRef.current) / 1000; // Convert to seconds
    const speedDiff = lastSpeedRef.current - speed;
    
    // If speed drops by more than 90km/h within 10 seconds
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

        // Add navigation and search controls
        map.current.addControl(new mapboxgl.NavigationControl());
        map.current.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

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

    // Request GPS permission and watch position
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14
        });
        toast({
          title: "Location Found",
          description: data.features[0].place_name,
        });
      } else {
        toast({
          title: "Location Not Found",
          description: "Please try a different search term.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Unable to search location. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/90 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="p-2 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white/100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
      
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="fixed top-20 right-4 z-50">
        <SpeedGauge 
          speed={speed} 
          maxSpeed={180} 
          className="bg-black/20 backdrop-blur-sm rounded-full p-2 shadow-lg"
        />
      </div>
    </div>
  );
};