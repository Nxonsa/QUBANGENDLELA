import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';

interface SearchBarProps {
  map: mapboxgl.Map | null;
}

export const SearchBar = ({ map }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}&autocomplete=true`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.flyTo({
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
    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
      <Input
        type="text"
        placeholder="Search location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white/90 backdrop-blur-sm"
        autoComplete="street-address"
      />
      <button
        type="submit"
        className="p-2 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white/100 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
};