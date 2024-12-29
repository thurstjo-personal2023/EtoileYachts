import { useState, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { loadGoogleMapsScript } from "@/lib/loadGoogleMapsScript";

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  className?: string;
  placeholder?: string;
}

export function LocationPicker({ onLocationSelect, className, placeholder = "Search location..." }: LocationPickerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setIsScriptLoaded(true))
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load location services. Please try again later.');
      });
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['(cities)', 'establishment', 'geocode'],
      componentRestrictions: { country: ['us', 'fr', 'es', 'it', 'gr'] } // Major yacht destinations
    },
    debounce: 300,
    cache: 86400,
    enabled: isScriptLoaded,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onLocationSelect({ address, lat, lng });
    } catch (error) {
      console.error("Error selecting location:", error);
      setError("Failed to get location details. Please try a different location.");
    }
  };

  if (error) {
    return (
      <div className="text-sm text-destructive p-2 rounded-md bg-destructive/10">
        {error}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Command className="rounded-lg border shadow-none">
        <div className="flex items-center border-b px-3">
          <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            value={value}
            onValueChange={setValue}
            placeholder={placeholder}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!ready}
          />
        </div>
        {value && (
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              {!ready ? "Loading..." :
               status === "ZERO_RESULTS" ? "No locations found." :
               status === "OK" ? "Type to search locations" :
               "Loading suggestions..."}
            </CommandEmpty>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <CommandItem
                  key={place_id}
                  value={description}
                  onSelect={() => handleSelect(description)}
                  className="px-4 py-2 text-sm cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {description}
                </CommandItem>
              ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}