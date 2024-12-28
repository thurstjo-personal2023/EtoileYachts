import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { SelectBooking } from "@db/schema";

type BookingCardProps = {
  booking: SelectBooking;
};

export function BookingCard({ booking }: BookingCardProps) {
  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
          <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Time</span>
            <span>{format(new Date(booking.startTime), "PPP p")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">End Time</span>
            <span>{format(new Date(booking.endTime), "PPP p")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span>${booking.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge variant="outline">{booking.paymentStatus}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
