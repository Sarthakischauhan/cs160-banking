"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Briefcase, CreditCard } from "lucide-react"

interface ProfileFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  ssn: string
  employmentStatus: string
  annualIncome: string
  idType: string
  idNumber: string
  citizenship: string
  accountType: string
}

export const ProfileCompletion = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    ssn: "",
    employmentStatus: "",
    annualIncome: "",
    idType: "",
    idNumber: "",
    citizenship: "",
    accountType: "",
  })

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Profile data:", formData)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Profile completed successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
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
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Personal Information Section */}
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
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
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
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="NY"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">
                  ZIP Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="10001"
                  maxLength={5}
                  required
                />
              </div>
            </div>
          </div>

          {/* Identity Verification Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Identity Verification</h3>
            </div>

            <div>
              <Label htmlFor="ssn">
                Social Security Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ssn"
                type="password"
                value={formData.ssn}
                onChange={(e) => handleInputChange("ssn", e.target.value)}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Required for tax reporting and identity verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idType">
                  ID Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="state_id">State ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idNumber">
                  ID Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  placeholder="Enter ID number"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="citizenship">
                Citizenship Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.citizenship}
                onValueChange={(value) => handleInputChange("citizenship", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select citizenship status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us_citizen">U.S. Citizen</SelectItem>
                  <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
                  <SelectItem value="visa_holder">Visa Holder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employment & Financial Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Employment & Financial Information</h3>
            </div>

            <div>
              <Label htmlFor="employmentStatus">
                Employment Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.employmentStatus}
                onValueChange={(value) => handleInputChange("employmentStatus", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self_employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="annualIncome">
                Annual Income <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.annualIncome}
                onValueChange={(value) => handleInputChange("annualIncome", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25000">Under $25,000</SelectItem>
                  <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50000-75000">$50,000 - $75,000</SelectItem>
                  <SelectItem value="75000-100000">$75,000 - $100,000</SelectItem>
                  <SelectItem value="100000-150000">$100,000 - $150,000</SelectItem>
                  <SelectItem value="150000+">Over $150,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountType">
                Preferred Account Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => handleInputChange("accountType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="both">Both Checking & Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving Profile..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
