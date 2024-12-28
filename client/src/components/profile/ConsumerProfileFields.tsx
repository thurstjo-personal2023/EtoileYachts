import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreditCard, MapPin, Gift, Clock, Phone, Shield, Wallet } from "lucide-react";

type ConsumerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ConsumerProfileFields({ form }: ConsumerProfileFieldsProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-4 lg:grid-cols-8">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="demographics">Demographics</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="travel">Travel</TabsTrigger>
        <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="emergency">Emergency</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>

      {/* Basic Information */}
      <TabsContent value="basic" className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      {/* Demographics */}
      <TabsContent value="demographics" className="space-y-4">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      {/* Travel Preferences */}
      <TabsContent value="travel" className="space-y-4">
        <FormField
          control={form.control}
          name="travelPreferences.preferredDestinations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Destinations</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter destinations, separated by commas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="travelPreferences.travelFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Travel Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="travelPreferences.budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range (per day)</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={field.value?.min}
                    onChange={(e) =>
                      field.onChange({ ...field.value, min: Number(e.target.value) })
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={field.value?.max}
                    onChange={(e) =>
                      field.onChange({ ...field.value, max: Number(e.target.value) })
                    }
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      {/* Loyalty Program */}
      <TabsContent value="loyalty" className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Loyalty Program Status</h3>
          </div>
          
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="loyaltyProgram.memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member ID</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="loyaltyProgram.tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Tier</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="loyaltyProgram.pointsBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Balance</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </TabsContent>

      {/* Payment Methods */}
      <TabsContent value="payment" className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Payment Methods</h3>
          </div>
          
          {/* Display existing payment methods */}
          {form.watch("paymentMethods")?.map((method: any, index: number) => (
            <Card key={method.id} className="p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {method.type === "credit_card" ? "Credit Card" : "Debit Card"} ending in {method.lastFourDigits}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const methods = form.getValues("paymentMethods");
                    methods.splice(index, 1);
                    form.setValue("paymentMethods", methods);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Emergency Contact */}
      <TabsContent value="emergency" className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Emergency Contact</h3>
          </div>
          
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="emergencyContact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergencyContact.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergencyContact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergencyContact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
