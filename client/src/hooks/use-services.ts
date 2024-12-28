import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SelectService } from "@db/schema";

export type ServiceFilter = {
  type?: string;
  location?: { lat: number; lng: number; radius: number };
  priceRange?: { min: number; max: number };
};

async function fetchServices(filters?: ServiceFilter): Promise<SelectService[]> {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, JSON.stringify(value));
    });
  }

  const response = await fetch(`/api/services?${queryParams.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error fetching services: ${await response.text()}`);
  }

  return response.json();
}

async function createService(service: Omit<SelectService, "id">): Promise<SelectService> {
  const response = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error creating service: ${await response.text()}`);
  }

  return response.json();
}

export function useServices(filters?: ServiceFilter) {
  return useQuery({
    queryKey: ["services", filters],
    queryFn: () => fetchServices(filters),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
