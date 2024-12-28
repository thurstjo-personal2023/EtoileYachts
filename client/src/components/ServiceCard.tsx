import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign } from "lucide-react";
import type { SelectService } from "@db/schema";

type ServiceCardProps = {
  service: SelectService;
  onBook?: () => void;
};

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
          <img 
            src={service.images?.[0] || "https://images.unsplash.com/photo-1648997578849-39d477982104"}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle>{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground mb-4">{service.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>Location coordinates: {JSON.stringify(service.location)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Available times: {JSON.stringify(service.availability)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span>${service.price}/hour</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
