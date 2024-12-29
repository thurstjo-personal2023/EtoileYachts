import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string | number;
  type: 'yacht' | 'location' | 'service';
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (result: SearchResult) => void;
  results: SearchResult[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function SearchBar({
  onSearch,
  onSelect,
  results,
  isLoading = false,
  placeholder = "Search yachts, locations...",
  className,
  ariaLabel = "Search"
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (value) {
      const debounceTimer = setTimeout(() => {
        onSearch(value);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [value, onSearch]);

  // Handle touch events for better mobile interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const yDiff = touchStart - e.touches[0].clientY;
    if (Math.abs(yDiff) > 10) {
      setOpen(false);
    }
  };

  return (
    <div 
      className={cn("relative w-full", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setTouchStart(null)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            className="w-full justify-start text-left"
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {value || placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0 max-w-[calc(100vw-2rem)]" 
          align="start"
          sideOffset={4}
        >
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={value}
              onValueChange={setValue}
              className="h-9 md:h-11"
            />
            <CommandList className="max-h-[60vh] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm">
                {isLoading ? "Searching..." : "No results found."}
              </CommandEmpty>

              {results.length > 0 && (
                <>
                  <CommandGroup heading="Yachts">
                    {results
                      .filter(result => result.type === 'yacht')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            onSelect(result);
                            setValue(result.title);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          {result.imageUrl && (
                            <img 
                              src={result.imageUrl} 
                              alt="" 
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-muted-foreground">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandGroup heading="Locations">
                    {results
                      .filter(result => result.type === 'location')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            onSelect(result);
                            setValue(result.title);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          <div className="text-sm">{result.title}</div>
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandGroup heading="Services">
                    {results
                      .filter(result => result.type === 'service')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => {
                            onSelect(result);
                            setValue(result.title);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          <div className="text-sm">{result.title}</div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}