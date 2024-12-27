import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useYacht } from "../hooks/use-yachts";
import { useCreateBooking } from "../hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export default function BookingPage() {
  const params = useParams();
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { data: yacht, isLoading } = useYacht(id ?? "");
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to || !yacht) return 0;
    const days =
      Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24)
      ) + 1;
    return yacht.pricePerDay * days;
  };

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to || !yacht) return;

    try {
      await createBooking({
        yachtId: yacht.id,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        totalPrice: calculateTotalPrice(),
      });
      setLocation("/yachts");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  if (!id || isLoading || !yacht) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                <img
                  src={yacht.imageUrls[0]}
                  alt={yacht.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{yacht.name}</h3>
                <p className="text-gray-600 mb-4">{yacht.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Price per day</span>
                  <span className="font-semibold">
                    ${yacht.pricePerDay.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Select Dates</h2>
                <div className="grid gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  {dateRange?.from && dateRange?.to && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-t pt-4">
                        <span className="font-semibold">Total Price</span>
                        <span className="text-2xl font-bold">
                          ${calculateTotalPrice().toLocaleString()}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleBooking}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}