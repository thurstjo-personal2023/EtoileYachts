import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, Anchor, Gauge, Map, Heart, Shield, CreditCard, Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

// Define form schema for validation
const vesselSchema = z.object({
  name: z.string().min(1, "Vessel name is required"),
  type: z.string().min(1, "Vessel type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string(),
  year: z.number().min(1900).max(new Date().getFullYear()),
  registration: z.object({
    number: z.string(),
    country: z.string(),
    port: z.string()
  }),
  specifications: z.object({
    length: z.number().min(0),
    beam: z.number().min(0),
    draft: z.number().min(0),
    grossTonnage: z.number().min(0),
    engineHours: z.number().min(0),
    fuelCapacity: z.number().min(0),
    waterCapacity: z.number().min(0),
    maxSpeed: z.number().min(0),
    cruisingSpeed: z.number().min(0),
    range: z.number().min(0)
  }),
  capacity: z.object({
    guests: z.object({
      day: z.number().min(0),
      overnight: z.number().min(0)
    }),
    cabins: z.object({
      guest: z.number().min(0),
      crew: z.number().min(0)
    }),
    crew: z.object({
      minimum: z.number().min(0),
      maximum: z.number().min(0)
    })
  })
});

interface YachtDetailsFormProps {
  form: ReturnType<typeof useForm>;
}

export function YachtDetailsForm({ form }: YachtDetailsFormProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-7">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="capacity">Capacity</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
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
                    <FormLabel>Length (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        min={0}
                        step={0.1}
                      />
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
                    <FormLabel>Beam (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        min={0}
                        step={0.1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].specifications.draft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Draft (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        min={0}
                        step={0.1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessels[0].specifications.grossTonnage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Tonnage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
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
                name="vessels[0].capacity.guests.day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day Guests</FormLabel>
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
                name="vessels[0].capacity.guests.overnight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overnight Guests</FormLabel>
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
    </Tabs>
  );
}