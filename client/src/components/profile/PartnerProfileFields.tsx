import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MapPin, Clock, Upload } from "lucide-react";

type PartnerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function PartnerProfileFields({ form }: PartnerProfileFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Business Information */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Business Information
        </h3>
        
        <FormField
          control={form.control}
          name="businessInfo.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessInfo.registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessInfo.taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessInfo.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessInfo.yearEstablished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Established</FormLabel>
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

      {/* Service Areas */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Service Areas
        </h3>
        
        <FormField
          control={form.control}
          name="businessInfo.serviceAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas Served</FormLabel>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((area: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {area}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => {
                        const newAreas = [...field.value];
                        newAreas.splice(index, 1);
                        field.onChange(newAreas);
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    const area = window.prompt("Enter service area:");
                    if (area) {
                      field.onChange([...(field.value || []), area]);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Area
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Operating Hours */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Operating Hours
        </h3>
        
        {/* This could be expanded into a more sophisticated time picker */}
        <p className="text-sm text-muted-foreground">
          Operating hours can be set up in your business dashboard.
        </p>
      </div>

      {/* Document Upload Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="text-sm font-medium">Required Documents</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your business registration and tax documents for verification
        </p>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Business Registration</label>
            <input
              type="file"
              className="mt-1"
              accept="application/pdf,image/*"
              onChange={(e) => {
                // Handle file upload
                console.log(e.target.files?.[0]);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tax Documentation</label>
            <input
              type="file"
              className="mt-1"
              accept="application/pdf,image/*"
              onChange={(e) => {
                // Handle file upload
                console.log(e.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
