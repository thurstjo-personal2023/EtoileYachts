import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Shield, Waves } from "lucide-react";
import { activityDetailsSchema, type ActivityDetails } from "@/lib/types/activity";

const defaultActivities = [
  { name: "Scuba Diving", isOffered: false },
  { name: "Water Skiing", isOffered: false },
  { name: "Snorkeling", isOffered: false },
  { name: "Fishing", isOffered: false },
  { name: "Jet Skiing", isOffered: false }
];

type ActivityDetailsFormProps = {
  onSubmit: (data: ActivityDetails) => void;
  defaultValues?: ActivityDetails;
};

export function ActivityDetailsForm({ onSubmit, defaultValues }: ActivityDetailsFormProps) {
  const form = useForm<ActivityDetails>({
    resolver: zodResolver(activityDetailsSchema),
    defaultValues: defaultValues || {
      types: defaultActivities,
      equipment: [],
      safetyMeasures: [],
      instructions: []
    }
  });

  const addEquipment = () => {
    const currentEquipment = form.getValues("equipment") || [];
    form.setValue("equipment", [
      ...currentEquipment,
      { name: "", description: "", quantity: 1, condition: "good" }
    ]);
  };

  const addSafetyMeasure = () => {
    const currentMeasures = form.getValues("safetyMeasures") || [];
    form.setValue("safetyMeasures", [
      ...currentMeasures,
      { title: "", description: "", priority: "medium", requiredCertifications: [] }
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Waves className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Activity Details</h3>
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Types of Activities</h4>
              {form.watch("types")?.map((activity, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`types.${index}.isOffered`}
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          {activity.name}
                        </FormLabel>
                        {field.value && (
                          <FormField
                            control={form.control}
                            name={`types.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Add details about this activity..."
                                    className="mt-2"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Equipment Section */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Equipment</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEquipment}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-2">Add Equipment</span>
                </Button>
              </div>

              {form.watch("equipment")?.map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`equipment.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`equipment.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
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
                        name={`equipment.${index}.condition`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`equipment.${index}.description`}
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

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const equipment = form.getValues("equipment");
                        equipment.splice(index, 1);
                        form.setValue("equipment", equipment);
                      }}
                    >
                      Remove Equipment
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Safety Measures Section */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h4 className="text-sm font-medium">Safety Measures</h4>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSafetyMeasure}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-2">Add Safety Measure</span>
                </Button>
              </div>

              {form.watch("safetyMeasures")?.map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`safetyMeasures.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`safetyMeasures.${index}.description`}
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
                      name={`safetyMeasures.${index}.priority`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
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
                        const measures = form.getValues("safetyMeasures");
                        measures.splice(index, 1);
                        form.setValue("safetyMeasures", measures);
                      }}
                    >
                      Remove Safety Measure
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Save Activity Details</Button>
      </form>
    </Form>
  );
}