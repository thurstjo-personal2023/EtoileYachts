import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useYacht, useCreateReview } from "../hooks/use-yachts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Loader2, Anchor, Users, Ruler } from "lucide-react";
import { useUser } from "../hooks/use-user";

// Add Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
      };
    };
  }
}

export default function YachtDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { data: yacht, isLoading } = useYacht(id ?? "");
  const { user } = useUser();
  const { mutate: createReview } = useCreateReview();

  useEffect(() => {
    if (yacht && process.env.VITE_GOOGLE_MAPS_API_KEY) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, {
            center: yacht.location,
            zoom: 12,
          });
          new window.google.maps.Marker({
            position: yacht.location,
            map,
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        const scriptElement = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement);
        }
      };
    }
  }, [yacht]);

  if (!id || isLoading || !yacht) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const averageRating =
    yacht.reviews && yacht.reviews.length > 0
      ? yacht.reviews.reduce((acc, review) => acc + review.rating, 0) /
        yacht.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary">Etoile Yachts</a>
            </Link>
            <Link href="/yachts">
              <Button variant="outline">Back to Listings</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {yacht.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={url}
                      alt={`${yacht.name} - Image ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{yacht.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  ({yacht.reviews?.length || 0} reviews)
                </span>
              </div>
              <span className="text-2xl font-bold">
                ${yacht.pricePerDay.toLocaleString()}/day
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5" />
                <span>{yacht.features.includes("Crew") ? "Crewed" : "Bareboat"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Up to {yacht.capacity} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                <span>{yacht.length}m length</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{yacht.description}</p>

            <Link href={`/booking/${yacht.id}`}>
              <Button className="w-full" size="lg">
                Book Now
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="features" className="mt-8">
          <TabsList>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {yacht.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <span>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardContent className="p-6">
                <div id="map" className="h-[400px] w-full rounded-lg"></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                {yacht.reviews?.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 last:border-0 py-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {review.user?.username || "Anonymous"}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}