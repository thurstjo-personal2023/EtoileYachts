import { useBookings } from "@/hooks/use-bookings";
import { BookingCard } from "@/components/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();

  const upcomingBookings = bookings?.filter(
    booking => new Date(booking.startTime) > new Date()
  );

  const pastBookings = bookings?.filter(
    booking => new Date(booking.startTime) <= new Date()
  );

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-[200px] animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings?.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings?.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
