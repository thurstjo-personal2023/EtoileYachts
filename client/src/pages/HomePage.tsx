import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks/use-user";

export default function HomePage() {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1648997934392-7213a9ce50b7)`,
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Experience Luxury at Sea
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
            Discover our exclusive collection of luxury yachts for unforgettable journeys
          </p>
          <Link href="/yachts">
            <Button size="lg" className="text-lg">
              Explore Yachts
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 w-full p-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-white text-2xl font-bold">Etoile Yachts</a>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Featured Sections */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1648997578849-39d477982104"
              alt="Luxury Experience"
              className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
            <p className="text-gray-600">
              Handpicked selection of luxury yachts for the most discerning clients
            </p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1710388470825-e0d88766219c"
              alt="Water Sports"
              className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Adventure</h3>
            <p className="text-gray-600">
              Exciting water sports and activities for the whole family
            </p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
              alt="Concierge Service"
              className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Concierge Service</h3>
            <p className="text-gray-600">
              Personalized attention to every detail of your journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
