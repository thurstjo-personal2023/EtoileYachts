import { useState, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { MapPin, Loader2 } from "lucide-react";
import { loadGoogleMapsScript } from "@/lib/loadGoogleMapsScript";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  className?: string;
  placeholder?: string;
}

export function LocationPicker({ onLocationSelect, className, placeholder = "Search location..." }: LocationPickerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initAttempts, setInitAttempts] = useState(0);

  // Initialize Google Maps script
  useEffect(() => {
    let mounted = true;

    const initializeGoogleMaps = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Verify API key presence
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error("Google Maps API key is not configured");
        }

        console.log("[LocationPicker] Starting Maps initialization attempt", initAttempts + 1);
        await loadGoogleMapsScript();

        if (mounted) {
          if (!(window as any).google?.maps?.places) {
            throw new Error("Places API failed to initialize properly");
          }
          console.log("[LocationPicker] Maps initialization successful");
          setIsScriptLoaded(true);
          setError(null);
        }
      } catch (err) {
        console.error('[LocationPicker] Maps initialization failed:', err);
        if (mounted) {
          setError('Location services initialization failed. Please try again.');
          setIsScriptLoaded(false);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    if (!isScriptLoaded && initAttempts < 3) {
      initializeGoogleMaps();
    }

    return () => {
      mounted = false;
    };
  }, [initAttempts]);

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
      componentRestrictions: { country: ['us', 'fr', 'es', 'it', 'gr'] }
    },
  });

  const handleSelect = async (address: string) => {
    try {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("[LocationPicker] Location selected:", { address, lat, lng });
      onLocationSelect({ address, lat, lng });
    } catch (error) {
      console.error("[LocationPicker] Selection error:", error);
      setError("Unable to process this location. Please try another one.");
    }
  };

  const handleRetry = () => {
    console.log("[LocationPicker] Retrying initialization");
    setInitAttempts(prev => prev + 1);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-11 bg-muted/50 rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Initializing location services...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-sm border border-destructive/50 bg-destructive/10 rounded-md">
        <p className="text-destructive">{error}</p>
        <Button 
          onClick={handleRetry}
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
        >
          Retry
        </Button>
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
              {!ready ? "Initializing..." :
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