import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, Calendar, User, Menu } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Add debug logging
    console.log("MobileLayout rendered, current location:", location);
    console.log("Attempting to load logo from:", "/etoile-yachts-logo.png");
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation with Logo and Search */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-2">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/etoile-yachts-logo.png"
              alt="Etoile Yachts"
              className="h-8 w-auto"
              onError={(e) => {
                console.error("Error loading logo:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
          <SearchBar
            onSearch={(query) => {
              console.log("Search query:", query);
            }}
            onSelect={(result) => {
              console.log("Selected result:", result);
              if (result.type === 'yacht') {
                window.location.href = `/yachts/${result.id}`;
              } else if (result.type === 'location') {
                window.location.href = `/locations/${result.id}`;
              } else if (result.type === 'service') {
                window.location.href = `/services/${result.id}`;
              }
            }}
            results={[]}
            placeholder="Search yachts, locations..."
            className="w-full max-w-sm"
          />
          <button
            className="ml-auto rounded-md p-2 hover:bg-accent"
            aria-label="Menu"
            onClick={() => console.log("Menu button clicked")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <div className="flex h-16 items-center justify-around">
            {[
              { href: "/", icon: Home, label: "Home" },
              { href: "/search", icon: Search, label: "Search" },
              { href: "/bookings", icon: Calendar, label: "Bookings" },
              { href: "/profile", icon: User, label: "Profile" }
            ].map(({ href, icon: Icon, label }) => (
              <Link 
                key={href} 
                href={href}
                className={`flex flex-col items-center ${
                  location === href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}