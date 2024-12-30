
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, Anchor, Gauge, Map, Heart, Shield, CreditCard } from "lucide-react";

interface YachtDetailsFormProps {
  form: ReturnType<typeof useForm>;
}

export function YachtDetailsForm({ form }: YachtDetailsFormProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-7">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
        <TabsTrigger value="engine">Engine</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="safety">Safety</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
      </TabsList>

      {/* Existing Basic Tab Content */}
      <TabsContent value="basic" className="space-y-6">
        {/* Keep existing basic info content */}
      </TabsContent>

      <TabsContent value="technical" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Anchor className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Technical Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="construction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Material</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classification</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Keep existing engine tab */}
      <TabsContent value="engine" className="space-y-6">
        {/* Keep existing engine content */}
      </TabsContent>

      <TabsContent value="amenities" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Amenities</h3>
            </div>
            {["entertainment", "deck", "waterToys", "interior"].map((category) => (
              <FormField
                key={category}
                control={form.control}
                name={`amenities.${category}`}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="capitalize">{category}</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Add checkboxes for common amenities in each category */}
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="safety" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Safety & Certifications</h3>
            </div>
            <FormField
              control={form.control}
              name="safetyEquipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Equipment</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Add checkboxes for safety equipment */}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastSafetyInspection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Safety Inspection</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="location" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Location</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentLocation.port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Port</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentLocation.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Pricing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing.baseDayRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Day Rate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.baseWeekRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Week Rate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
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
