import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox"; // Added import for Checkbox
import { YachtDetailsForm } from "./YachtDetailsForm";
import {
  User,
  Briefcase,
  Ship,
  ShieldCheck,
  Clock,
  Bell,
  Settings,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type ProducerProfileFieldsProps = {
  form: ReturnType<typeof useForm<any>>;
};

export function ProducerProfileFields({ form }: ProducerProfileFieldsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full">
        <TabsTrigger value="personal">
          <User className="w-4 h-4 mr-2" />
          Personal
        </TabsTrigger>
        <TabsTrigger value="professional">
          <Briefcase className="w-4 h-4 mr-2" />
          Professional
        </TabsTrigger>
        <TabsTrigger value="yacht">
          <Ship className="w-4 h-4 mr-2" />
          Yacht
        </TabsTrigger>
        <TabsTrigger value="certifications">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Certifications
        </TabsTrigger>
        <TabsTrigger value="availability">
          <Clock className="w-4 h-4 mr-2" />
          Availability
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" />
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
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
                  <Input {...field} type="tel" placeholder="Enter your phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter your address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      <TabsContent value="professional" className="space-y-6">
        <div className="grid gap-6">
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
                    <SelectItem value="crew">Crew Member</SelectItem>
                    <SelectItem value="manager">Yacht Manager</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience.yearsOfExperience"
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
            name="experience.specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter your specialties (comma-separated)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience.languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <div className="space-y-4">
                  {field.value?.map((lang: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`experience.languages.${index}.language`}
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
                          name={`experience.languages.${index}.proficiency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proficiency</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select proficiency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="basic">Basic</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
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
                          <Trash2 className="w-4 h-4 mr-2" />
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
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      <TabsContent value="yacht" className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="yachtDetails.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yacht Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter yacht name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4">
            <FormField
              control={form.control}
              name="yachtDetails.specifications.length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter length" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yachtDetails.specifications.beam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beam</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter beam" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yachtDetails.specifications.enginePower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Power</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter engine power" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yachtDetails.specifications.fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter fuel type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="capacity" className="space-y-4">
            <FormField
              control={form.control}
              name="yachtDetails.capacity.guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Capacity</FormLabel>
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
              name="yachtDetails.capacity.crew"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crew Capacity</FormLabel>
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
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <FormField
              control={form.control}
              name="yachtDetails.features.amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {["Spa", "Dining Area", "Sunbeds", "Bar", "Gym", "Cinema", "WiFi", "Air Conditioning"].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(amenity)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, amenity]);
                            } else {
                              field.onChange(currentValue.filter((val) => val !== amenity));
                            }
                          }}
                        />
                        <label className="text-sm">{amenity}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <FormField
              control={form.control}
              name="yachtDetails.media.photos"
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
                        // You'll need to implement the actual file upload logic
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yachtDetails.media.videos"
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
                        // You'll need to implement the actual file upload logic
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
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
                        <Trash2 className="w-4 h-4 mr-2" />
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
                        <Trash2 className="w-4 h-4 mr-2" />
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

      <TabsContent value="notifications" className="space-y-6">
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
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
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