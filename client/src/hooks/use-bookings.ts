import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: number;
  yachtId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  yacht?: {
    name: string;
    imageUrls: string[];
  };
}

export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
}

export function useCreateBooking() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      yachtId: number;
      startDate: string;
      endDate: string;
      totalPrice: number;
    }) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
