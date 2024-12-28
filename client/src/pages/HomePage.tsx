import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ship, Waves, Anchor, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1648997934392-7213a9ce50b7)'
        }}
      >
        <div className="container text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Luxury Maritime Experiences
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover exclusive yacht charters and premium water activities
          </p>
          <Link href="/services">
            <Button size="lg" className="bg-primary/90 hover:bg-primary">
              Explore Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Ship className="h-10 w-10 mb-4" />,
                title: "Luxury Yachts",
                description: "Premium vessels for unforgettable journeys"
              },
              {
                icon: <Waves className="h-10 w-10 mb-4" />,
                title: "Water Sports",
                description: "Exciting activities for thrill-seekers"
              },
              {
                icon: <Anchor className="h-10 w-10 mb-4" />,
                title: "Expert Crew",
                description: "Professional and experienced staff"
              },
              {
                icon: <MapPin className="h-10 w-10 mb-4" />,
                title: "Prime Locations",
                description: "Access to exclusive destinations"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Set Sail?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join us for an extraordinary maritime experience tailored to your preferences
          </p>
          <Link href="/services">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}