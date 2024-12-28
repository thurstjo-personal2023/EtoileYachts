import { useUser } from "@/hooks/use-user";
import { useBookings } from "@/hooks/use-bookings";
import { useServices } from "@/hooks/use-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingCard } from "@/components/BookingCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Anchor, Calendar, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: bookings } = useBookings();
  const { data: services } = useServices();

  const stats = [
    {
      title: "Total Bookings",
      value: bookings?.length || 0,
      icon: Calendar,
    },
    {
      title: "Active Services",
      value: services?.length || 0,
      icon: Anchor,
    },
    {
      title: "Total Revenue",
      value: `$${bookings?.reduce((acc, booking) => acc + Number(booking.totalAmount), 0).toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome back, {user?.fullName}</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings?.slice(0, 3).map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Services</h2>
          <div className="space-y-4">
            {services?.slice(0, 3).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
