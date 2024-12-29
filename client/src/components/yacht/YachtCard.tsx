import { type YachtDetails } from "@/lib/types/yacht";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Anchor, Users, Calendar } from "lucide-react";

interface YachtCardProps {
  yacht: YachtDetails;
  onViewDetails?: () => void;
  onBookNow?: () => void;
}

export function YachtCard({ yacht, onViewDetails, onBookNow }: YachtCardProps) {
  const {
    name,
    manufacturer,
    length,
    capacity,
    baseDayRate,
    currency,
    features
  } = yacht;

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-primary" />
          <CardTitle>{name}</CardTitle>
        </div>
        <CardDescription>{manufacturer}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Length:</span>
              <span className="font-medium">{length}m</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{capacity} guests</span>
            </div>
          </div>

          {features && (
            <div className="flex flex-wrap gap-2">
              {features.hasSpa && (
                <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                  Spa
                </span>
              )}
              {features.hasDiningArea && (
                <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                  Dining Area
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {currency} {baseDayRate}/day
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button
          className="flex-1"
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}