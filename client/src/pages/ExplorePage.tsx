import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { YachtFilter } from "@/components/filters/YachtFilter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchResult {
  id: string | number;
  type: 'yacht' | 'location' | 'service';
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', searchQuery, filterValues],
    enabled: !!searchQuery || Object.keys(filterValues).length > 0,
    queryFn: async () => {
      const params = new URLSearchParams({
        q: searchQuery,
        ...filterValues
      });
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json() as Promise<SearchResult[]>;
    }
  });

  return (
    <div className="container py-4 space-y-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>

        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearchQuery}
              onSelect={(result) => {
                // Handle selection based on result type
                if (result.type === 'yacht') {
                  window.location.href = `/yachts/${result.id}`;
                } else if (result.type === 'location') {
                  window.location.href = `/locations/${result.id}`;
                } else if (result.type === 'service') {
                  window.location.href = `/services/${result.id}`;
                }
              }}
              results={searchResults}
              isLoading={isLoading}
              placeholder="Search yachts, locations..."
              className="w-full"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <YachtFilter
                onFilter={setFilterValues}
                initialValues={filterValues}
                className="mt-4"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-32 animate-pulse bg-muted rounded-lg"
              />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          // Results
          <div className="grid gap-4">
            {searchResults.map((result) => (
              <div 
                key={result.id}
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
              >
                <div className="flex gap-3">
                  {result.imageUrl && (
                    <img 
                      src={result.imageUrl}
                      alt=""
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{result.title}</h3>
                    {result.subtitle && (
                      <p className="text-sm text-muted-foreground">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No results or initial state
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? (
              `No results found for "${searchQuery}"`
            ) : (
              "Start searching for yachts, locations, or activities"
            )}
          </div>
        )}
      </div>
    </div>
  );
}