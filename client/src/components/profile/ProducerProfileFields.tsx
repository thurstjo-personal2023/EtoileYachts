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
import { Plus, Shield, Book, Globe, Award, FileText, Clock } from "lucide-react";
import { YachtDetailsForm } from "./YachtDetailsForm";
import { ActivityDetailsForm } from "./ActivityDetailsForm";

type ProducerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ProducerProfileFields({ form }: ProducerProfileFieldsProps) {
  const roles = [
    { value: "yacht_owner", label: "Yacht Owner" },
    { value: "captain", label: "Captain" },
    { value: "facilitator", label: "Facilitator" },
    { value: "crew_member", label: "Crew Member" },
    { value: "instructor", label: "Instructor" }
  ];

  const commonLanguages = [
    "English", "Spanish", "French", "German", "Italian",
    "Portuguese", "Russian", "Arabic", "Chinese", "Japanese"
  ];

  return (
    <Tabs defaultValue="professional" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-8">
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="legal">Legal</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="yachts">Yachts</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="professional" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Professional Role
          </h3>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Experience
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
                    min="0"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Total years of experience in maritime industry
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Languages
          </h3>

          <FormField
            control={form.control}
            name="professionalInfo.languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages Spoken</FormLabel>
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
                  <Select
                    onValueChange={(value) => {
                      if (!field.value?.includes(value)) {
                        field.onChange([...(field.value || []), value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Add language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commonLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certifications
          </h3>

          {form.watch("professionalInfo.certifications")?.map((cert: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`professionalInfo.certifications.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="safety_training">Safety Training</SelectItem>
                          <SelectItem value="maritime_license">Maritime License</SelectItem>
                          <SelectItem value="special_permit">Special Permit</SelectItem>
                          <SelectItem value="professional_certification">Professional Certification</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`professionalInfo.certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Name</FormLabel>
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
                    name={`professionalInfo.certifications.${index}.issueDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`professionalInfo.certifications.${index}.expiryDate`}
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

                <FormField
                  control={form.control}
                  name={`professionalInfo.certifications.${index}.licenseNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License/Certificate Number</FormLabel>
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
                    const certs = form.getValues("professionalInfo.certifications");
                    certs.splice(index, 1);
                    form.setValue("professionalInfo.certifications", certs);
                  }}
                >
                  Remove Certification
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => {
              const certs = form.getValues("professionalInfo.certifications") || [];
              form.setValue("professionalInfo.certifications", [
                ...certs,
                {
                  type: "",
                  name: "",
                  issuer: "",
                  issueDate: "",
                  verificationStatus: "pending"
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4" /> Add Certification
          </Button>
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

      <TabsContent value="yachts" className="space-y-6">
        <YachtDetailsForm
          onSubmit={async (data) => {
            try {
              // Handle yacht details submission
              console.log("Yacht details:", data);
            } catch (error) {
              console.error("Error saving yacht details:", error);
            }
          }}
        />
      </TabsContent>

      <TabsContent value="activities" className="space-y-6">
        <ActivityDetailsForm
          onSubmit={async (data) => {
            try {
              // Handle activity details submission
              console.log("Activity details:", data);
            } catch (error) {
              console.error("Error saving activity details:", error);
            }
          }}
        />
      </TabsContent>
      <TabsContent value="services" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Service Offerings
          </h3>

          <FormField
            control={form.control}
            name="services.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your services..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the services you offer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services.serviceTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Types</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((service: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {service}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          const services = [...field.value];
                          services.splice(index, 1);
                          field.onChange(services);
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Select
                    onValueChange={(value) => {
                      if (!field.value?.includes(value)) {
                        field.onChange([...(field.value || []), value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Add service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yacht_charter">Yacht Charter</SelectItem>
                      <SelectItem value="sailing_lessons">Sailing Lessons</SelectItem>
                      <SelectItem value="water_sports">Water Sports</SelectItem>
                      <SelectItem value="guided_tours">Guided Tours</SelectItem>
                      <SelectItem value="event_hosting">Event Hosting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services.pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Structure</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your pricing structure..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain your pricing model, rates, and any special packages
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services.cancellationPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Policy</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible (24h)</SelectItem>
                    <SelectItem value="moderate">Moderate (3 days)</SelectItem>
                    <SelectItem value="strict">Strict (7 days)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
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