import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SelectUser } from "@db/schema";
import { ConsumerProfileFields } from "@/components/profile/ConsumerProfileFields";
import { ProducerProfileFields } from "@/components/profile/ProducerProfileFields";
import { PartnerProfileFields } from "@/components/profile/PartnerProfileFields";
import React from 'react';

// Enhanced error boundary with proper types
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive">
          <h2>Something went wrong</h2>
          <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Extended User type to include additional profile fields
interface ExtendedUser extends SelectUser {
  profileImage?: string;
  phoneNumber?: string;
  bio?: string;
  dateOfBirth?: Date;
  nationality?: string;
  gender?: string;
  occupation?: string;
  location?: {
    country: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    bookingReminders: boolean;
    paymentAlerts: boolean;
  };
  privacySettings?: {
    profileVisibility: "public" | "private" | "registered";
    contactInfoVisibility: "public" | "private" | "registered";
    experienceVisibility: "public" | "private" | "registered";
    businessInfoVisibility: "public" | "private" | "registered";
  };
}

export default function ProfilePage() {
  const { user } = useUser() as { user: ExtendedUser | undefined };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("[ProfilePage] Rendering with user type:", user?.userType);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      nationality: user?.nationality || "",
      gender: user?.gender || "",
      occupation: user?.occupation || "",
      location: user?.location,
      notificationPreferences: user?.notificationPreferences,
      privacySettings: user?.privacySettings,
      travelPreferences: user?.travelPreferences,
      paymentMethods: user?.paymentMethods || [],
      emergencyContact: user?.emergencyContact,
      boatingLicenses: user?.boatingLicenses || [],
      boatingExperience: user?.boatingExperience || {
        yearsOfExperience: 0,
        vesselTypes: [],
        certifications: [],
        safetyTraining: [],
      },
      insuranceInfo: user?.insuranceInfo || {
        provider: "",
        policyNumber: "",
        expiryDate: "",
        coverage: "",
        documentId: 0,
      },
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
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onMutate: () => {
      setIsSubmitting(true);
      console.log("[ProfilePage] Starting profile update");
    },
    onSuccess: () => {
      console.log("[ProfilePage] Profile update successful");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      console.error("[ProfilePage] Profile update failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("[ProfilePage] Starting image upload");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

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

      console.log("[ProfilePage] Image upload successful");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error("[ProfilePage] Image upload failed:", error);
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
    <ErrorBoundary>
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
                {user.userType === "consumer" && <ConsumerProfileFields form={form} />}
                {user.userType === "producer" && <ProducerProfileFields form={form} />}
                {user.userType === "partner" && <PartnerProfileFields form={form} />}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
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
  // Additional fields based on user type
  travelPreferences: z.object({
    preferredDestinations: z.array(z.string()),
    travelFrequency: z.string().optional(),
    typicalTripDuration: z.string().optional(),
    budgetRange: z.object({
      min: z.number(),
      max: z.number(),
      currency: z.string(),
    }).optional(),
    specialRequirements: z.array(z.string()),
  }).optional(),
  paymentMethods: z.array(z.object({
    id: z.string(),
    type: z.enum(["credit_card", "debit_card", "bank_account"]),
    lastFourDigits: z.string(),
    expiryDate: z.string().optional(),
    isDefault: z.boolean(),
    billingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      postalCode: z.string(),
    }),
  })).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    email: z.string().email("Invalid email"),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      postalCode: z.string(),
    }),
  }).optional(),
  boatingLicenses: z.array(z.object({
    type: z.string(),
    number: z.string(),
    expiryDate: z.string(),
    issuingCountry: z.string(),
    documentId: z.number(),
  })).optional(),
  boatingExperience: z.object({
    yearsOfExperience: z.number(),
    vesselTypes: z.array(z.string()),
    certifications: z.array(z.string()),
    safetyTraining: z.array(z.object({
      type: z.string(),
      completionDate: z.string(),
      issuingAuthority: z.string(),
    })),
  }).optional(),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string(),
    coverage: z.string(),
    documentId: z.number(),
  }).optional(),
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
});

type ProfileFormData = z.infer<typeof profileSchema>;

async function updateProfile(data: ProfileFormData) {
  const response = await fetch("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}