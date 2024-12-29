import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, Calendar, User, Menu } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation with Logo and Search */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-2">
          <Link href="/">
            <a className="flex-shrink-0">
              <img
                src="/etoile-yachts-logo.png"
                alt="Etoile Yachts"
                className="h-8 w-auto"
              />
            </a>
          </Link>
          <SearchBar
            onSearch={(query) => {
              // TODO: Implement search handler
              console.log("Searching:", query);
            }}
            onSelect={(result) => {
              // TODO: Handle selection based on result type
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
            <Link href="/">
              <a className={`flex flex-col items-center ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </a>
            </Link>
            <Link href="/search">
              <a className={`flex flex-col items-center ${location === "/search" ? "text-primary" : "text-muted-foreground"}`}>
                <Search className="h-5 w-5" />
                <span className="text-xs mt-1">Search</span>
              </a>
            </Link>
            <Link href="/bookings">
              <a className={`flex flex-col items-center ${location === "/bookings" ? "text-primary" : "text-muted-foreground"}`}>
                <Calendar className="h-5 w-5" />
                <span className="text-xs mt-1">Bookings</span>
              </a>
            </Link>
            <Link href="/profile">
              <a className={`flex flex-col items-center ${location === "/profile" ? "text-primary" : "text-muted-foreground"}`}>
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}