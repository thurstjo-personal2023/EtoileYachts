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

const baseProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  preferredLanguage: z.string(),
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
  }),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    pushNotifications: z.boolean(),
  }),
  privacySettings: z.object({
    profileVisibility: z.enum(["public", "private", "registered"]),
    contactInfoVisibility: z.enum(["public", "private", "registered"]),
    experienceVisibility: z.enum(["public", "private", "registered"]),
  }),
});

const producerExtraSchema = z.object({
  boatingLicenses: z.array(z.object({
    type: z.string(),
    number: z.string(),
    expiryDate: z.string(),
    issuingCountry: z.string(),
  })),
  boatingExperience: z.object({
    yearsOfExperience: z.number(),
    vesselTypes: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string(),
    coverage: z.string(),
  }),
});

const partnerExtraSchema = z.object({
  businessInfo: z.object({
    companyName: z.string(),
    registrationNumber: z.string(),
    taxId: z.string(),
    website: z.string().url().optional(),
    yearEstablished: z.number(),
    serviceAreas: z.array(z.string()),
  }),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string(),
    coverage: z.string(),
  }),
});

const consumerProfileSchema = baseProfileSchema;
const producerProfileSchema = baseProfileSchema.merge(producerExtraSchema);
const partnerProfileSchema = baseProfileSchema.merge(partnerExtraSchema);

type ProfileFormData = z.infer<typeof baseProfileSchema> & 
  Partial<z.infer<typeof producerExtraSchema>> & 
  Partial<z.infer<typeof partnerExtraSchema>>;

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

function BaseProfileFields({ form }: { form: any }) {
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

      {/* Add all base fields here */}
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

      {/* Emergency Contact */}
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
        {/* Add other emergency contact fields */}
      </div>

      {/* Privacy Settings */}
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
        {/* Add other privacy settings */}
      </div>
    </div>
  );
}

function ProducerProfileFields({ form }: { form: any }) {
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
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add other boating experience fields */}
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Licenses & Certifications</h3>
        {/* Add license fields */}
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
        {/* Add other insurance fields */}
      </div>
    </div>
  );
}

function PartnerProfileFields({ form }: { form: any }) {
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
        {/* Add other business fields */}
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Insurance Information</h3>
        {/* Add insurance fields */}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(
      user?.userType === "producer" 
        ? producerProfileSchema 
        : user?.userType === "partner"
          ? partnerProfileSchema
          : consumerProfileSchema
    ),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      preferredLanguage: user?.preferredLanguage || "en",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      nationality: user?.nationality || "",
      location: user?.location || { country: "", city: "", address: "" },
      notificationPreferences: user?.notificationPreferences || {
        email: true,
        sms: false,
        pushNotifications: true,
      },
      privacySettings: user?.privacySettings || {
        profileVisibility: "registered",
        contactInfoVisibility: "private",
        experienceVisibility: "registered",
      },
      ...(user?.userType === "producer" && {
        boatingExperience: user?.boatingExperience || {
          yearsOfExperience: 0,
          vesselTypes: [],
          certifications: [],
        },
        boatingLicenses: user?.boatingLicenses || [],
        insuranceInfo: user?.insuranceInfo || {
          provider: "",
          policyNumber: "",
          expiryDate: "",
          coverage: "",
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
        },
        insuranceInfo: user?.insuranceInfo || {
          provider: "",
          policyNumber: "",
          expiryDate: "",
          coverage: "",
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
        description: error.message,
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
                    src={imagePreview || user?.profileImage}
                    alt="Profile"
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
                    <TabsContent value="licenses" className="space-y-4">
                      {/* License fields */}
                    </TabsContent>
                  </>
                )}

                {user?.userType === "partner" && (
                  <>
                    <TabsContent value="business" className="space-y-4">
                      <PartnerProfileFields form={form} />
                    </TabsContent>
                    <TabsContent value="service-areas" className="space-y-4">
                      {/* Service area fields */}
                    </TabsContent>
                  </>
                )}

                <TabsContent value="privacy" className="space-y-4">
                  {/* Privacy settings */}
                </TabsContent>
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