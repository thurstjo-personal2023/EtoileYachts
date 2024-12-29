import { useState, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { MapPin, Loader2 } from "lucide-react";
import { loadGoogleMapsScript } from "@/lib/loadGoogleMapsScript";

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  className?: string;
  placeholder?: string;
}

export function LocationPicker({ onLocationSelect, className, placeholder = "Search location..." }: LocationPickerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Google Maps script
  useEffect(() => {
    console.log("[LocationPicker] Initializing...");
    setIsInitializing(true);

    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();
        console.log("[LocationPicker] Script loaded successfully");
        setIsScriptLoaded(true);
      } catch (err) {
        console.error('[LocationPicker] Failed to load Google Maps:', err);
        setError('Failed to load location services. Please try again later.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGoogleMaps();
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: isScriptLoaded,
    debounce: 300,
    requestOptions: {
      types: ['(cities)', 'establishment', 'geocode'],
      componentRestrictions: { country: ['us', 'fr', 'es', 'it', 'gr'] }
    },
  });

  // Monitor Places API status
  useEffect(() => {
    console.log("[LocationPicker] Ready:", ready, "Status:", status, "Results:", data.length);
  }, [ready, status, data.length]);

  const handleSelect = async (address: string) => {
    console.log("[LocationPicker] Selected address:", address);
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("[LocationPicker] Geocoded coordinates:", { lat, lng });
      onLocationSelect({ address, lat, lng });
    } catch (error) {
      console.error("[LocationPicker] Error selecting location:", error);
      setError("Failed to get location details. Please try a different location.");
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-11 bg-muted/50 rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading location services...</span>
      </div>
    );
  }

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
            onValueChange={(newValue) => {
              console.log("[LocationPicker] Input value changed:", newValue);
              setValue(newValue);
            }}
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