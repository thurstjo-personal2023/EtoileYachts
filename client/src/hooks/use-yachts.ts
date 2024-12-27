import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface Yacht {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  pricePerDay: number;
  capacity: number;
  length: number;
  location: { lat: number; lng: number };
  features: string[];
  available: boolean;
  reviews?: Review[];
}

interface Review {
  id: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    username: string;
  };
}

export function useYachts() {
  return useQuery<Yacht[]>({
    queryKey: ['/api/yachts'],
  });
}

export function useYacht(id: string) {
  return useQuery<Yacht>({
    queryKey: [`/api/yachts/${id}`],
    enabled: !!id,
  });
}

export function useCreateReview() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: { yachtId: number; rating: number; comment?: string }) => {
      const response = await fetch('/api/reviews', {
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
        description: "Review submitted successfully",
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
