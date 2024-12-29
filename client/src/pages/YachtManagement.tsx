import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { YachtDetailsForm } from "@/components/profile/YachtDetailsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { YachtDetails } from "@/lib/types/yacht";
import { AlertCircle } from "lucide-react";

export function YachtManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch yacht data if editing
  const { data: yacht, isLoading } = useQuery<YachtDetails>(["/api/yachts/current"]);

  // Mutation for saving yacht details
  const { mutate: saveYacht } = useMutation({
    mutationFn: async (data: YachtDetails) => {
      const response = await fetch("/api/yachts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Yacht details saved successfully",
      });
      queryClient.invalidateQueries(["/api/yachts/current"]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: YachtDetails) => {
    saveYacht(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Yacht Management</CardTitle>
          </CardHeader>
          <CardContent>
            <YachtDetailsForm
              onSubmit={handleSubmit}
              defaultValues={yacht}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default YachtManagement;
