import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Shield,
  Book,
  Globe,
  Award,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import { YachtDetailsForm } from "./YachtDetailsForm";
import { ActivityDetailsForm } from "./ActivityDetailsForm";

type ProducerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ProducerProfileFields({ form }: ProducerProfileFieldsProps) {
  return (
    <Tabs defaultValue="professional" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-7">
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="emergency">Emergency</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="professional" className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yacht_owner">Yacht Owner</SelectItem>
                  <SelectItem value="captain">Captain</SelectItem>
                  <SelectItem value="facilitator">Facilitator</SelectItem>
                  <SelectItem value="crew_member">Crew Member</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
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
              <div className="space-y-4">
                {field.value?.map((lang: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`professionalInfo.languages.${index}.language`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`professionalInfo.languages.${index}.proficiency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proficiency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select proficiency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                                <SelectItem value="native">Native</SelectItem>
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
                          const languages = field.value?.filter(
                            (_: any, i: number) => i !== index
                          );
                          field.onChange(languages);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    field.onChange([
                      ...(field.value || []),
                      { language: "", proficiency: "basic" },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Language
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us about your professional background" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="certifications" className="space-y-6">
        <FormField
          control={form.control}
          name="professionalInfo.certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Certifications</FormLabel>
              <div className="space-y-4">
                {field.value?.map((cert: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`professionalInfo.certifications.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="maritime">
                                  Maritime License
                                </SelectItem>
                                <SelectItem value="safety">
                                  Safety Certificate
                                </SelectItem>
                                <SelectItem value="instructor">
                                  Instructor Certification
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                            <FormLabel>Certificate Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`professionalInfo.certifications.${index}.issuingAuthority`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuing Authority</FormLabel>
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
                                <Input type="date" {...field} />
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
                                <Input type="date" {...field} />
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
                          const certs = field.value?.filter(
                            (_: any, i: number) => i !== index
                          );
                          field.onChange(certs);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    field.onChange([
                      ...(field.value || []),
                      {
                        type: "",
                        name: "",
                        issuingAuthority: "",
                        issueDate: "",
                        expiryDate: "",
                        verificationStatus: "pending",
                      },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="services" className="space-y-6">
        <FormField
          control={form.control}
          name="serviceDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the services you offer"
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Types</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
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
              </div>
              <Select
                onValueChange={(value) => {
                  if (!field.value?.includes(value)) {
                    field.onChange([...(field.value || []), value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Add service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yacht_charter">Yacht Charter</SelectItem>
                  <SelectItem value="water_sports">Water Sports</SelectItem>
                  <SelectItem value="sailing_lessons">Sailing Lessons</SelectItem>
                  <SelectItem value="fishing_trips">Fishing Trips</SelectItem>
                  <SelectItem value="special_events">Special Events</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="availability" className="space-y-6">
        <FormField
          control={form.control}
          name="availability.schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Schedule</FormLabel>
              <div className="space-y-4">
                {field.value?.map((schedule: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`availability.schedule.${index}.day`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monday">Monday</SelectItem>
                                <SelectItem value="tuesday">Tuesday</SelectItem>
                                <SelectItem value="wednesday">
                                  Wednesday
                                </SelectItem>
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
                          name={`availability.schedule.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`availability.schedule.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
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
                          const schedules = field.value?.filter(
                            (_: any, i: number) => i !== index
                          );
                          field.onChange(schedules);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    field.onChange([
                      ...(field.value || []),
                      {
                        day: "",
                        startTime: "",
                        endTime: "",
                      },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Schedule
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="yachts" className="space-y-6">
        <YachtDetailsForm form={form} />
      </TabsContent>

      <TabsContent value="activities" className="space-y-6">
        <ActivityDetailsForm form={form} />
      </TabsContent>

      <TabsContent value="insurance" className="space-y-6">
        <FormField
          control={form.control}
          name="professionalInfo.insuranceInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Information</FormLabel>
              <Card className="p-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="professionalInfo.insuranceInfo.provider"
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
                    name="professionalInfo.insuranceInfo.policyNumber"
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
                    name="professionalInfo.insuranceInfo.coverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Details</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professionalInfo.insuranceInfo.expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="emergency" className="space-y-6">
        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact</FormLabel>
              <Card className="p-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emergencyContact.name"
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
                          <Input type="tel" {...field} />
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
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <FormField
          control={form.control}
          name="notificationPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Preferences</FormLabel>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.email}
                      onCheckedChange={(checked) =>
                        form.setValue("notificationPreferences.email", checked)
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>SMS Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.sms}
                      onCheckedChange={(checked) =>
                        form.setValue("notificationPreferences.sms", checked)
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Push Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.pushNotifications}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "notificationPreferences.pushNotifications",
                          checked
                        )
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Booking Reminders</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.bookingReminders}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "notificationPreferences.bookingReminders",
                          checked
                        )
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Payment Alerts</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.paymentAlerts}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "notificationPreferences.paymentAlerts",
                          checked
                        )
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Maintenance Alerts</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.maintenanceAlerts}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "notificationPreferences.maintenanceAlerts",
                          checked
                        )
                      }
                    />
                  </FormControl>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <FormLabel>Weather Alerts</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value?.weatherAlerts}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "notificationPreferences.weatherAlerts",
                          checked
                        )
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacySettings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privacy Settings</FormLabel>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacySettings.profileVisibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="registered">
                            Registered Users
                          </SelectItem>
                          <SelectItem value="verified_only">
                            Verified Users Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacySettings.contactInfoVisibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="registered">
                            Registered Users
                          </SelectItem>
                          <SelectItem value="verified_only">
                            Verified Users Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
}