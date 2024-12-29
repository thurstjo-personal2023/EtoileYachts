import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Waves } from "lucide-react";

interface ActivityDetailsFormProps {
  form: ReturnType<typeof useForm>;
}

export function ActivityDetailsForm({ form }: ActivityDetailsFormProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Waves className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Activity Details</h3>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="activities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activities</FormLabel>
                {field.value?.map((activity: any, index: number) => (
                  <Card key={index} className="p-4 mt-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`activities.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`activities.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`activities.${index}.status`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const activities = form.getValues("activities");
                          activities.splice(index, 1);
                          form.setValue("activities", activities);
                        }}
                      >
                        Remove Activity
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    const activities = form.getValues("activities") || [];
                    form.setValue("activities", [
                      ...activities,
                      {
                        name: "",
                        description: "",
                        status: "active"
                      }
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Activity
                </Button>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}