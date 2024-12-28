import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, Calendar as CalendarIcon } from "lucide-react";
import { yachtDetailsSchema, type YachtDetails } from "@/lib/types/yacht";

type YachtDetailsFormProps = {
  onSubmit: (data: YachtDetails) => void;
  defaultValues?: YachtDetails;
};

export function YachtDetailsForm({ onSubmit, defaultValues }: YachtDetailsFormProps) {
  const form = useForm<YachtDetails>({
    resolver: zodResolver(yachtDetailsSchema),
    defaultValues: defaultValues || {
      name: "",
      model: "",
      year: new Date().getFullYear(),
      capacity: 1,
      features: {
        hasSpa: false,
        hasDiningArea: false,
        hasChildFriendlyAmenities: false,
        additionalFeatures: []
      },
      availability: []
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Ship className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Yacht Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yacht Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (passengers)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-4">Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="features.hasSpa"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Spa</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features.hasDiningArea"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Dining Area</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features.hasChildFriendlyAmenities"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Child-Friendly Amenities</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Availability Schedule</h4>
              </div>
              <Calendar
                mode="multiple"
                selected={form.watch("availability")?.map(a => a.date)}
                onSelect={(dates) => {
                  if (!Array.isArray(dates)) return;

                  const availability = dates.map(date => ({
                    date,
                    slots: [
                      {
                        start: "09:00",
                        end: "17:00",
                        maxCapacity: form.watch("capacity")
                      }
                    ]
                  }));

                  form.setValue("availability", availability);
                }}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Save Yacht Details</Button>
      </form>
    </Form>
  );
}