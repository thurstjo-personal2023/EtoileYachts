import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Anchor } from "lucide-react";
import type { SelectService } from "@db/schema";
import { WaterRipple } from "@/components/ui/maritime-interactions";

type ServiceCardProps = {
  service: SelectService;
  onBook?: () => void;
};

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  const location = service.location as { lat: number; lng: number };

  return (
    <Card className="h-full flex flex-col group relative overflow-hidden">
      <CardHeader>
        <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
          {service.images?.[0] ? (
            <img 
              src={`/assets/services/${service.images[0]}`}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Anchor className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <CardTitle className="font-display">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-primary" />
            <span>
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location unavailable'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-brand-primary" />
            <span>
              {Array.isArray(service.availability) && service.availability.length > 0
                ? service.availability[0]
                : 'Contact for availability'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-brand-primary" />
            <span>${parseFloat(service.price.toString()).toLocaleString()}/day</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="w-full group-hover:bg-brand-primary/90 transition-colors">
          Book Now
        </Button>
      </CardFooter>
      {/* Add water ripple effect on hover */}
      <WaterRipple center className="opacity-0 group-hover:opacity-100" />
    </Card>
  );
}