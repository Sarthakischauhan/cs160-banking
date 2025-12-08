"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CreditCard } from "lucide-react";

import type { Customer } from "@prisma/client";
import AddressAutocomplete from "./AddressAutoComplete";

// Validation

const minAge = 18;

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine(
      (v) => /^[A-Za-z\s\-]+$/.test(v),
      "First name can only contain letters, spaces, and hyphens"
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine(
      (v) => /^[A-Za-z\s\-]+$/.test(v),
      "Last name can only contain letters, spaces, and hyphens"
    ),

  dateOfBirth: z
    .string()
    .refine((val) => {
      const dob = new Date(val);
      if (Object.prototype.toString.call(dob) !== "[object Date]" || isNaN(dob.getTime())) {
        return false;
      }

      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;

      return age >= 18;
    }, "You must be at least 18 years old"),

  phone: z
    .string()
    .refine((v) => /^\d{10}$/.test(v), "Phone number must be exactly 10 digits"),

  address: z.string().min(3, "Street address is required"),

  city: z
    .string()
    .min(1, "City is required")
    .refine(
      (v) => /^[A-Za-z\s\-]+$/.test(v),
      "City can only contain letters, spaces, and hyphens"
    ),

  state: z
    .string()
    .transform((s) => s.toUpperCase())
    .refine((v) => /^[A-Z]{2}$/.test(v), "Use a 2-letter state abbreviation (e.g. NY)"),

  zipCode: z
    .string()
    .refine((v) => /^\d{5}$/.test(v), "ZIP must be 5 digits"),
});


type ProfileFormData = z.infer<typeof profileSchema>;

// Component
export const ProfileCompletion: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Watch the address field to keep it in sync with the autocomplete input
  const addressValue = watch("address");

  // helper: normalize phone input to digits-only
  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");   // remove non-digits
    const trimmed = digitsOnly.slice(0, 10);                // limit to 10 digits
    setValue("phone", trimmed, { shouldValidate: true });
  };

  // helper: uppercase state
  const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
    setValue("state", val, { shouldValidate: true });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    // Map to your API payload shape (Partial<Customer>)
    const payload: Partial<Customer> = {
      first_name: data.firstName,
      last_name: data.lastName,
      // dateOfBirth left for later per your comment; could be data.dateOfBirth
      phone: data.phone,
      address: `${data.address} ${data.city} ${data.state} ${data.zipCode}`,
    };

    try {
      const resp = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Failed to save profile: ${resp.status} ${text}`);
      }

      // refresh server components that depend on the profile (like layout)
      router.refresh();
    } catch (err) {
      console.error(err);
      // You can replace alert with a nicer toast if you have one
      alert("Failed to save profile — please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-10">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Please provide the following information to complete your banking profile. All fields are required for
          regulatory compliance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input id="firstName" {...register("firstName")} placeholder="John" />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} max={new Date().toISOString().split("T")[0]} />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="5551234567"
                {...register("phone")}
                onChange={(e) => {
                  // Remove non-digits
                  e.target.value = e.target.value.replace(/\D/g, "");

                  // Call RHF's built-in onChange so validation still works
                  register("phone").onChange(e);
                }}
              />

              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Address Information</h3>
            </div>

            <div>
              <Label htmlFor="address">
                Street Address <span className="text-destructive">*</span>
              </Label>

              <AddressAutocomplete 
                setValue={setValue}
                value={addressValue || ""}
                onChange={(value) => {
                  setValue("address", value, { shouldValidate: true });
                }}
              />

              {errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input id="city" {...register("city")} placeholder="New York" />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="NY"
                  maxLength={2}
                  onChange={onStateChange}
                />
                {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
              </div>

              <div>
                <Label htmlFor="zipCode">
                  ZIP Code <span className="text-destructive">*</span>
                </Label>
                <Input id="zipCode" {...register("zipCode")} placeholder="10001" maxLength={5} inputMode="numeric" />
                {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
            {isLoading ? "Saving Profile..." : "Complete Profile"}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
          >
            <a href="/auth/logout">Logout</a>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
