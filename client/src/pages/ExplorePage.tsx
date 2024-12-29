import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: string | number;
  type: 'yacht' | 'location' | 'service';
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    enabled: !!searchQuery,
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json() as Promise<SearchResult[]>;
    }
  });

  return (
    <div className="container py-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Explore</h1>
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

        {/* Show search results or featured content when no search */}
        <div className="mt-6">
          {searchQuery ? (
            // Search Results View
            <div className="space-y-4">
              {isLoading ? (
                <div>Loading...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  >
                    <h3 className="font-medium">{result.title}</h3>
                    {result.subtitle && (
                      <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            // Featured Content when no search
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-4">Featured Yachts</h2>
                {/* Add featured yachts grid/carousel here */}
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-4">Popular Destinations</h2>
                {/* Add popular destinations grid here */}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
