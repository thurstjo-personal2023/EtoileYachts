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
  type: 'yacht' | 'location';
  title: string;
  subtitle?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (result: SearchResult) => void;
  results: SearchResult[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  onSelect,
  results,
  isLoading = false,
  placeholder = "Search yachts, locations...",
  className
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      onSearch(value);
    }
  }, [value, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left"
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {value || placeholder}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
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
                    >
                      <div>
                        <div className="text-sm">{result.title}</div>
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
                    >
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
