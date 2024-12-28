import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Loader2, Upload, UserCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SelectUser } from "@db/schema";

// Matching schema types with database schema
const baseProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  preferredLanguage: z.string().default("en"),
  bio: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationality: z.string().optional(),
  identificationNumber: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }).optional(),
  location: z.object({
    country: z.string(),
    city: z.string(),
    address: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    pushNotifications: z.boolean(),
    marketingEmails: z.boolean(),
    bookingReminders: z.boolean(),
    paymentAlerts: z.boolean(),
  }).default({
    email: true,
    sms: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    paymentAlerts: true,
  }),
  privacySettings: z.object({
    profileVisibility: z.enum(["public", "private", "registered"]),
    contactInfoVisibility: z.enum(["public", "private", "registered"]),
    experienceVisibility: z.enum(["public", "private", "registered"]),
    businessInfoVisibility: z.enum(["public", "private", "registered"]),
  }).default({
    profileVisibility: "registered",
    contactInfoVisibility: "private",
    experienceVisibility: "registered",
    businessInfoVisibility: "registered",
  }),
});

const producerProfileSchema = baseProfileSchema.extend({
  boatingLicenses: z.array(z.object({
    type: z.string(),
    number: z.string(),
    expiryDate: z.string(),
    issuingCountry: z.string(),
    documentId: z.number(),
  })).default([]),
  boatingExperience: z.object({
    yearsOfExperience: z.number(),
    vesselTypes: z.array(z.string()),
    certifications: z.array(z.string()),
    safetyTraining: z.array(z.object({
      type: z.string(),
      completionDate: z.string(),
      issuingAuthority: z.string(),
    })),
  }).default({
    yearsOfExperience: 0,
    vesselTypes: [],
    certifications: [],
    safetyTraining: [],
  }),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string(),
    coverage: z.string(),
    documentId: z.number(),
  }).optional(),
});

const partnerProfileSchema = baseProfileSchema.extend({
  businessInfo: z.object({
    companyName: z.string(),
    registrationNumber: z.string(),
    taxId: z.string(),
    website: z.string().url().optional(),
    yearEstablished: z.number(),
    serviceAreas: z.array(z.string()),
    operatingHours: z.array(z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
    })),
    registrationDocumentId: z.number(),
    taxDocumentId: z.number(),
    businessType: z.string(),
    employeeCount: z.number(),
  }).optional(),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string(),
    coverage: z.string(),
    documentId: z.number(),
  }).optional(),
});

type BaseProfileData = z.infer<typeof baseProfileSchema>;
type ProducerProfileData = z.infer<typeof producerProfileSchema>;
type PartnerProfileData = z.infer<typeof partnerProfileSchema>;

type ProfileFormData = BaseProfileData & Partial<ProducerProfileData> & Partial<PartnerProfileData>;

async function updateProfile(data: ProfileFormData) {
  const response = await fetch("/api/users/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

function BaseProfileFields({ form }: { form: ReturnType<typeof useForm<ProfileFormData>> }) {
  return (
    <div className="space-y-4">
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
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Calendar 
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Emergency Contact</h3>
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
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Privacy Settings</h3>
        <FormField
          control={form.control}
          name="privacySettings.profileVisibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="registered">Registered Users Only</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function ProducerProfileFields({ form }: { form: ReturnType<typeof useForm<ProfileFormData>> }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Boating Experience</h3>
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
      </div>

      <div className="space-y-4 border rounded-lg p-4">
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
      </div>
    </div>
  );
}

function PartnerProfileFields({ form }: { form: ReturnType<typeof useForm<ProfileFormData>> }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Business Information</h3>
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
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(
      user?.userType === "producer" 
        ? producerProfileSchema 
        : user?.userType === "partner"
          ? partnerProfileSchema
          : baseProfileSchema
    ),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      preferredLanguage: user?.preferredLanguage || "en",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      nationality: user?.nationality || "",
      location: user?.location,
      notificationPreferences: user?.notificationPreferences || {
        email: true,
        sms: false,
        pushNotifications: true,
        marketingEmails: false,
        bookingReminders: true,
        paymentAlerts: true,
      },
      privacySettings: user?.privacySettings || {
        profileVisibility: "registered",
        contactInfoVisibility: "private",
        experienceVisibility: "registered",
        businessInfoVisibility: "registered",
      },
      ...(user?.userType === "producer" && {
        boatingExperience: user?.boatingExperience || {
          yearsOfExperience: 0,
          vesselTypes: [],
          certifications: [],
          safetyTraining: [],
        },
        boatingLicenses: user?.boatingLicenses || [],
        insuranceInfo: user?.insuranceInfo || {
          provider: "",
          policyNumber: "",
          expiryDate: "",
          coverage: "",
          documentId: 0,
        },
      }),
      ...(user?.userType === "partner" && {
        businessInfo: user?.businessInfo || {
          companyName: "",
          registrationNumber: "",
          taxId: "",
          website: "",
          yearEstablished: new Date().getFullYear(),
          serviceAreas: [],
          operatingHours: [],
          registrationDocumentId: 0,
          taxDocumentId: 0,
          businessType: "",
          employeeCount: 0,
        },
        insuranceInfo: user?.insuranceInfo || {
          provider: "",
          policyNumber: "",
          expiryDate: "",
          coverage: "",
          documentId: 0,
        },
      }),
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/users/profile/image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-16">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                {(imagePreview || user?.profileImage) ? (
                  <img
                    src={imagePreview || user?.profileImage || ''}
                    alt={user?.fullName || 'Profile'}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-32 h-32 text-muted-foreground" />
                )}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  {user?.userType === "producer" && (
                    <>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="licenses">Licenses</TabsTrigger>
                    </>
                  )}
                  {user?.userType === "partner" && (
                    <>
                      <TabsTrigger value="business">Business Info</TabsTrigger>
                      <TabsTrigger value="service-areas">Service Areas</TabsTrigger>
                    </>
                  )}
                  <TabsTrigger value="privacy">
                    <Lock className="w-4 h-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <BaseProfileFields form={form} />
                </TabsContent>

                {user?.userType === "producer" && (
                  <>
                    <TabsContent value="experience" className="space-y-4">
                      <ProducerProfileFields form={form} />
                    </TabsContent>
                  </>
                )}

                {user?.userType === "partner" && (
                  <>
                    <TabsContent value="business" className="space-y-4">
                      <PartnerProfileFields form={form} />
                    </TabsContent>
                  </>
                )}
              </Tabs>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}