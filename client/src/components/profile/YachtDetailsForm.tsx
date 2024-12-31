import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, Gauge, Heart, Upload } from "lucide-react";
import { z } from "zod";

// Available amenities list
const AMENITIES = [
  "Spa",
  "Dining Area",
  "Sunbeds",
  "Swimming Pool",
  "Gym",
  "Cinema Room",
  "Jacuzzi",
  "Beach Club",
  "Wi-Fi",
  "Air Conditioning"
];

interface YachtDetailsFormProps {
  form: ReturnType<typeof useForm>;
}

export function YachtDetailsForm({ form }: YachtDetailsFormProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="capacity">Capacity</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Ship className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vessels[0].name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vessel Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter vessel name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vessel Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vessel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="motor_yacht">Motor Yacht</SelectItem>
                        <SelectItem value="sailing_yacht">Sailing Yacht</SelectItem>
                        <SelectItem value="catamaran">Catamaran</SelectItem>
                        <SelectItem value="gulet">Gulet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter manufacturer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        min={1900}
                        max={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="specifications" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Gauge className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vessels[0].specifications.length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter length" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].specifications.beam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beam</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter beam" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].specifications.enginePower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Power</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter engine power" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].specifications.fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter fuel type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="capacity" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Capacity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vessels[0].capacity.guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].capacity.crew"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Crew</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Features</h3>
            </div>
            <FormField
              control={form.control}
              name="vessels[0].features.amenities"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {AMENITIES.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="vessels[0].features.amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, amenity]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter((value) => value !== amenity)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {amenity}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="media" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Media</h3>
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="vessels[0].media.photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          // Handle file upload logic here
                          field.onChange(files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].media.videos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Videos</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          // Handle file upload logic here
                          field.onChange(files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}