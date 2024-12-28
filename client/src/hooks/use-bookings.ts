import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SelectBooking } from "@db/schema";

async function fetchBookings(): Promise<SelectBooking[]> {
  const response = await fetch("/api/bookings", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error fetching bookings: ${await response.text()}`);
  }

  return response.json();
}

type CreateBookingData = {
  serviceId: number;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
};

async function createBooking(data: CreateBookingData): Promise<SelectBooking> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error creating booking: ${await response.text()}`);
  }

  return response.json();
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
