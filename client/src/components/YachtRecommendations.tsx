import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Anchor } from "lucide-react";
import { recommendationEngine, type YachtFeatures, type UserPreferences } from "@/lib/recommendation-engine";
import { NavigatingShip, WaterRipple } from "@/components/ui/maritime-interactions";

export function YachtRecommendations() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Array<{ yacht: YachtFeatures; score: number }>>([]);

  // Fetch available yachts
  const { data: yachts, isLoading } = useQuery<YachtFeatures[]>({
    queryKey: ['/api/services/recommendations'],
    queryFn: async () => {
      const preferences: UserPreferences = {
        preferredSize: 50, // Default values, should be customizable
        budget: 10000,
        partySize: 8,
        luxuryPreference: 7,
        preferredLocation: {
          lat: 37.7749, // San Francisco coordinates
          lng: -122.4194
        }
      };

      const response = await fetch('/api/services/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return response.json();
    }
  });

  useEffect(() => {
    async function initializeRecommendations() {
      if (!yachts) return;

      try {
        await recommendationEngine.initialize();
        
        const userPreferences: UserPreferences = {
          preferredSize: 50,
          budget: 10000,
          partySize: 8,
          luxuryPreference: 7,
          preferredLocation: {
            lat: 37.7749,
            lng: -122.4194
          }
        };

        const topRecommendations = await recommendationEngine.getTopRecommendations(
          yachts,
          userPreferences
        );

        setRecommendations(topRecommendations);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate recommendations",
          variant: "destructive"
        });
      }
    }

    initializeRecommendations();
  }, [yachts, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Anchor className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-display font-bold">Recommended for You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(({ yacht, score }, index) => (
          <Card key={index} className="relative overflow-hidden group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NavigatingShip />
                {yacht.size}ft Luxury Yacht
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Match Score: {(score * 100).toFixed(1)}%
                </p>
                <p className="font-medium">${yacht.price.toLocaleString()} per day</p>
                <p className="text-sm">Capacity: {yacht.capacity} guests</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: yacht.luxuryScore }).map((_, i) => (
                    <span key={i} className="text-secondary">★</span>
                  ))}
                </div>
              </div>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
            {/* Add water ripple effect on hover */}
            <WaterRipple center className="opacity-0 group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}
