import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Shield } from "lucide-react";

type ProducerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ProducerProfileFields({ form }: ProducerProfileFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Boating Experience */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Boating Experience
        </h3>
        
        <FormField
          control={form.control}
          name="boatingExperience.yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="boatingExperience.vesselTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Types</FormLabel>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((type: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {type}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => {
                        const newTypes = [...field.value];
                        newTypes.splice(index, 1);
                        field.onChange(newTypes);
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
                    const type = window.prompt("Enter vessel type:");
                    if (type) {
                      field.onChange([...(field.value || []), type]);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Type
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="boatingExperience.certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((cert: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => {
                        const newCerts = [...field.value];
                        newCerts.splice(index, 1);
                        field.onChange(newCerts);
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
                    const cert = window.prompt("Enter certification name:");
                    if (cert) {
                      field.onChange([...(field.value || []), cert]);
                    }
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Certification
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Insurance Information */}
      <div className="space-y-4">
        <h3 className="font-medium">Insurance Information</h3>
        
        <FormField
          control={form.control}
          name="insuranceInfo.provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Provider</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceInfo.policyNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceInfo.coverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coverage Details</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceInfo.expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Upload */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">Upload Insurance Document</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your insurance documentation for verification
          </p>
          <input
            type="file"
            className="mt-2"
            accept="application/pdf,image/*"
            onChange={(e) => {
              // Handle file upload
              console.log(e.target.files?.[0]);
            }}
          />
        </Card>
      </div>
    </div>
  );
}
