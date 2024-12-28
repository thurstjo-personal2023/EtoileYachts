import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import type { SelectService } from "@db/schema";

export function ServicesGrid() {
  const { data: services, isLoading, error } = useQuery<SelectService[]>({
    queryKey: ['/api/services'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Failed to load services. Please try again later.
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No services available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service}
          onBook={() => {
            // TODO: Implement booking flow
            console.log('Book service:', service.id);
          }}
        />
      ))}
    </div>
  );
}
