/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Target, Briefcase, BookOpen, Trophy, Loader2 } from "lucide-react";
import { useGetMeQuery, useUpdateProfileMutation } from "@/redux/api/authApi";
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useAddInterestMutation, useRemoveInterestMutation } from "@/redux/features/profile/profileApi";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { useState, useRef } from "react";
import { toast } from "sonner";
import * as React from "react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for form validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  currentJob: z.string().optional(),
  industry: z.string().optional(),
  experience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"]).optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  learningGoals: z.string().optional(),
  preferredLearningStyle: z.enum(["visual", "auditory", "kinesthetic", "reading", "mixed"]).optional(),
  timeZone: z.string().optional(),
  availability: z.enum(["5-10", "10-20", "20-30", "30+"]).optional(),
  areasOfInterest: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfile() {
  const { data: userData, isLoading: userLoading, error: userError } = useGetMeQuery(undefined);
  const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery(undefined);
  const { data: dashboardData } = useGetStudentDashboardDataQuery(undefined);
  const [updateUserProfile, { isLoading: isUpdatingUser }] = useUpdateProfileMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [addInterest] = useAddInterestMutation();
  const [removeInterest] = useRemoveInterestMutation();
  const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdating = isUpdatingUser || isUpdatingProfile;

  // React Hook Form setup
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      address: '',
      currentJob: '',
      industry: '',
      experience: undefined,
      skillLevel: undefined,
      learningGoals: '',
      preferredLearningStyle: undefined,
      timeZone: '',
      availability: undefined,
      areasOfInterest: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const [newInterest, setNewInterest] = useState('');

  // Handle photo upload
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadResult = await uploadImage(formData).unwrap();
      
      await updateUserProfile({
        profilePicture: uploadResult.data.url,
      }).unwrap();

      toast.success("Profile photo updated successfully.");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      let errorMessage = "Failed to upload photo. Please try again.";
      
      if (error && typeof error === 'object') {
        if ('status' in error) {
          const fetchError = error as { status: number; data?: any };
          errorMessage = fetchError.data?.message || `Upload failed with status ${fetchError.status}`;
        } else if ('data' in error) {
          const apiError = error as { data?: { message?: string } };
          errorMessage = apiError.data?.message || errorMessage;
        } else if ('message' in error) {
          const generalError = error as { message: string };
          errorMessage = generalError.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  // Update form data when user and profile data loads
  React.useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      const profile = profileData?.data;

      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', profile?.phone || '');
      setValue('bio', profile?.bio || '');
      setValue('address', profile?.address || '');
      setValue('currentJob', profile?.currentJob || '');
      setValue('industry', profile?.industry || '');
      setValue('experience', profile?.experience || undefined);
      setValue('skillLevel', profile?.skillLevel || undefined);
      setValue('learningGoals', profile?.learningGoals || '');
      setValue('preferredLearningStyle', profile?.preferredLearningStyle || undefined);
      setValue('timeZone', profile?.timeZone || '');
      setValue('availability', profile?.availability || undefined);
      setValue('areasOfInterest', profile?.areasOfInterest || []);
    }
  }, [userData, profileData, setValue]);

  const handleAddInterest = async () => {
    const currentInterests = watch('areasOfInterest') || [];
    if (newInterest.trim() && !currentInterests.includes(newInterest.trim())) {
      try {
        await addInterest(newInterest.trim()).unwrap();
        setValue('areasOfInterest', [...currentInterests, newInterest.trim()]);
        setNewInterest('');
        toast.success('Interest added successfully!');
      } catch {
        toast.error('Failed to add interest');
      }
    }
  };

  const handleRemoveInterest = async (interest: string) => {
    const currentInterests = watch('areasOfInterest') || [];
    try {
      await removeInterest(interest).unwrap();
      setValue('areasOfInterest', currentInterests.filter(i => i !== interest));
      toast.success('Interest removed successfully!');
    } catch {
      toast.error('Failed to remove interest');
    }
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      // Save user basic info (name, phoneNumber, profilePicture)
      await updateUserProfile({
        name: data.name,
        phoneNumber: data.phone
      }).unwrap();

      // Filter out empty strings and undefined values for enum fields
      const profileUpdateData: any = {};

      if (data.phone?.trim()) profileUpdateData.phone = data.phone.trim();
      if (data.bio?.trim()) profileUpdateData.bio = data.bio.trim();
      if (data.address?.trim()) profileUpdateData.address = data.address.trim();
      if (data.currentJob?.trim()) profileUpdateData.currentJob = data.currentJob.trim();
      if (data.industry?.trim()) profileUpdateData.industry = data.industry.trim();
      if (data.experience) profileUpdateData.experience = data.experience;
      if (data.skillLevel) profileUpdateData.skillLevel = data.skillLevel;
      if (data.learningGoals?.trim()) profileUpdateData.learningGoals = data.learningGoals.trim();
      if (data.preferredLearningStyle) profileUpdateData.preferredLearningStyle = data.preferredLearningStyle;
      if (data.timeZone?.trim()) profileUpdateData.timeZone = data.timeZone.trim();
      if (data.availability) profileUpdateData.availability = data.availability;
      if (data.areasOfInterest?.length > 0) profileUpdateData.areasOfInterest = data.areasOfInterest;

      await updateProfile(profileUpdateData).unwrap();

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (userError || !userData?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading profile data</p>
      </div>
    );
  }

  const user = userData.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 pt-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
            {user.image ? (
              <Image src={user.image} alt={user.name} className="w-full h-full object-cover" height={96} width={96} />
            ) : (
              user.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handlePhotoClick}
            disabled={uploadLoading}
          >
            {uploadLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Change Photo"
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here. Note: Additional profile fields below are for future enhancement and will be saved when backend support is implemented.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    {...register('name')}
                    value={watch('name')?.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = watch('name')?.split(' ')[1] || '';
                      setValue('name', e.target.value + (lastName ? ' ' + lastName : ''));
                    }}
                    placeholder="First name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={watch('name')?.split(' ')[1] || ''}
                    onChange={(e) => {
                      const firstName = watch('name')?.split(' ')[0] || '';
                      setValue('name', firstName + ' ' + e.target.value);
                    }}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  readOnly
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  required
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Your full address..."
                  className="min-h-[80px]"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about your design philosophy, favorite tools, and creative journey..."
                  className="min-h-[100px]"
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <Button
                type="submit"
                form="profile-form"
                disabled={isUpdating || isSubmitting}
              >
                {(isUpdating || isSubmitting) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your contact details for communication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{watch('phone') || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{watch('address') || 'Not provided'}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Background
              </CardTitle>
              <CardDescription>Tell us about your professional experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentJob">Current Job Title</Label>
                  <Input
                    id="currentJob"
                    {...register('currentJob')}
                    placeholder="e.g. Graphic Designer, UI/UX Designer, Art Director"
                  />
                  {errors.currentJob && (
                    <p className="text-sm text-red-500">{errors.currentJob.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    {...register('industry')}
                    placeholder="e.g. Advertising, Digital Media, Branding, Web Design"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-500">{errors.industry.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={watch('experience') || ''}
                  onValueChange={(value) => setValue('experience', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>

              <Button
                type="submit"
                form="profile-form"
                disabled={isUpdating || isSubmitting}
              >
                {(isUpdating || isSubmitting) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </form>
    </div>
  );
}