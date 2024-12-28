import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Shield, Anchor, Clock, FileText, Star, Upload } from "lucide-react";

type ProducerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ProducerProfileFields({ form }: ProducerProfileFieldsProps) {
  return (
    <Tabs defaultValue="professional" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="legal">Legal</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {/* Professional Information */}
      <TabsContent value="professional" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Professional Experience
          </h3>

          <FormField
            control={form.control}
            name="professionalInfo.yearsOfExperience"
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
            name="professionalInfo.qualifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualifications</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((qual: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {qual}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          const newQuals = [...field.value];
                          newQuals.splice(index, 1);
                          field.onChange(newQuals);
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
                      const qual = window.prompt("Enter qualification:");
                      if (qual) {
                        field.onChange([...(field.value || []), qual]);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Qualification
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalInfo.specializations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specializations</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          const newSpecs = [...field.value];
                          newSpecs.splice(index, 1);
                          field.onChange(newSpecs);
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
                      const spec = window.prompt("Enter specialization:");
                      if (spec) {
                        field.onChange([...(field.value || []), spec]);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Specialization
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalInfo.languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((lang: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {lang}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          const newLangs = [...field.value];
                          newLangs.splice(index, 1);
                          field.onChange(newLangs);
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
                      const lang = window.prompt("Enter language:");
                      if (lang) {
                        field.onChange([...(field.value || []), lang]);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Language
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Portfolio & Achievements
          </h3>

          <FormField
            control={form.control}
            name="professionalInfo.portfolio.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalInfo.portfolio.achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notable Achievements</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((achievement: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {achievement}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          const newAchievements = [...field.value];
                          newAchievements.splice(index, 1);
                          field.onChange(newAchievements);
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
                      const achievement = window.prompt("Enter achievement:");
                      if (achievement) {
                        field.onChange([...(field.value || []), achievement]);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Achievement
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      {/* Legal Information */}
      <TabsContent value="legal" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Business Registration
          </h3>

          <FormField
            control={form.control}
            name="legalInfo.businessRegistration.number"
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
            name="legalInfo.businessRegistration.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Registration</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalInfo.businessRegistration.expiryDate"
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
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Insurance Information</h3>

          {form.watch("legalInfo.insurancePolicies")?.map((policy: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`legalInfo.insurancePolicies.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`legalInfo.insurancePolicies.${index}.provider`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`legalInfo.insurancePolicies.${index}.policyNumber`}
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

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const policies = form.getValues("legalInfo.insurancePolicies");
                    policies.splice(index, 1);
                    form.setValue("legalInfo.insurancePolicies", policies);
                  }}
                >
                  Remove Policy
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => {
              const policies = form.getValues("legalInfo.insurancePolicies") || [];
              form.setValue("legalInfo.insurancePolicies", [
                ...policies,
                {
                  type: "",
                  provider: "",
                  policyNumber: "",
                  coverage: 0,
                  expiryDate: ""
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4" /> Add Insurance Policy
          </Button>
        </div>
      </TabsContent>

      {/* Availability Settings */}
      <TabsContent value="availability" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Working Hours
          </h3>

          {form.watch("professionalInfo.availability.workingHours")?.map((hours: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`professionalInfo.availability.workingHours.${index}.day`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`professionalInfo.availability.workingHours.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`professionalInfo.availability.workingHours.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const hours = form.getValues("professionalInfo.availability.workingHours");
                    hours.splice(index, 1);
                    form.setValue("professionalInfo.availability.workingHours", hours);
                  }}
                >
                  Remove Time Slot
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => {
              const hours = form.getValues("professionalInfo.availability.workingHours") || [];
              form.setValue("professionalInfo.availability.workingHours", [
                ...hours,
                {
                  day: "",
                  start: "",
                  end: ""
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4" /> Add Working Hours
          </Button>
        </div>
      </TabsContent>

      {/* Compliance */}
      <TabsContent value="compliance" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Compliance Status
          </h3>

          <FormField
            control={form.control}
            name="legalInfo.complianceStatus.isCompliant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Compliance Status</FormLabel>
                  <FormDescription>
                    Indicates if all required certifications and documents are up to date
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("legalInfo.complianceStatus.certificates")?.map((cert: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`legalInfo.complianceStatus.certificates.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`legalInfo.complianceStatus.certificates.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`legalInfo.complianceStatus.certificates.${index}.expiryDate`}
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

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const certs = form.getValues("legalInfo.complianceStatus.certificates");
                    certs.splice(index, 1);
                    form.setValue("legalInfo.complianceStatus.certificates", certs);
                  }}
                >
                  Remove Certificate
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => {
              const certs = form.getValues("legalInfo.complianceStatus.certificates") || [];
              form.setValue("legalInfo.complianceStatus.certificates", [
                ...certs,
                {
                  type: "",
                  number: "",
                  expiryDate: ""
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        </div>
      </TabsContent>

      {/* Settings */}
      <TabsContent value="settings" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Notification Preferences</h3>

          <FormField
            control={form.control}
            name="notificationPreferences.maintenanceAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Maintenance Alerts</FormLabel>
                  <FormDescription>
                    Receive notifications about maintenance schedules and requirements
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notificationPreferences.complianceReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Compliance Reminders</FormLabel>
                  <FormDescription>
                    Get reminders about expiring certifications and compliance requirements
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Privacy Settings</h3>

          <FormField
            control={form.control}
            name="privacySettings.experienceVisibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Visibility</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacySettings.businessInfoVisibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Information Visibility</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacySettings.reviewsVisibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviews Visibility</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}