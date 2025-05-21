"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Upload } from "lucide-react"

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  enrollmentNumber: z.string().min(5, { message: "Please enter a valid enrollment number" }),
  department: z.string().min(1, { message: "Department is required" }),
  semester: z.string().min(1, { message: "Semester is required" }),
  section: z.string().min(1, { message: "Section is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  idCard: z.string().min(1, { message: "ID Card upload is required" }),
})

export default function SignupPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    department: "",
    semester: "",
    section: "",
    password: "",
    idCard: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, idCard: "Please upload an image file" }))
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, idCard: "File size should be less than 5MB" }))
      return
    }

    setIsUploading(true)

    // Convert to base64 for storage
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target?.result as string
      setFormData((prev) => ({ ...prev, idCard: base64String }))
      setIdCardPreview(base64String)
      setIsUploading(false)
      // Clear any previous errors
      setErrors((prev) => ({ ...prev, idCard: "" }))
    }
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, idCard: "Error reading file" }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      signupSchema.parse(formData)

      // In a real app, you would send this data to your backend
      // For now, we'll store it in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if enrollment number already exists
      if (existingUsers.some((user: any) => user.enrollmentNumber === formData.enrollmentNumber)) {
        setErrors({ enrollmentNumber: "This enrollment number is already registered" })
        return
      }

      // Add new user
      localStorage.setItem("users", JSON.stringify([...existingUsers, formData]))

      toast({
        title: "Registration Successful",
        description: "You can now login with your enrollment number and password",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#003366] text-white p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-xl font-bold flex items-center gap-3">
            <Image
              src="/images/amity-logo.png"
              alt="Amity University Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span>Amity University Madhya Pradesh</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 bg-[#003366] text-white rounded-t-lg">
            <div className="flex justify-center mb-2">
              <Image
                src="/images/amity-logo.png"
                alt="Amity University Logo"
                width={60}
                height={60}
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Register to access the sports equipment management system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-gray-300"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  className="border-gray-300"
                />
                {errors.enrollmentNumber && <p className="text-sm text-red-500">{errors.enrollmentNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => handleSelectChange("department", value)} value={formData.department}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASET">Amity School of Engineering & Technology (ASET)</SelectItem>
                    <SelectItem value="ALS">Amity Law School (ALS)</SelectItem>
                    <SelectItem value="ABS">Amity Business School (ABS)</SelectItem>
                    <SelectItem value="AIBAS">Amity Institute of Biotechnology & Allied Sciences (AIBAS)</SelectItem>
                    <SelectItem value="AIP">Amity Institute of Pharmacy (AIP)</SelectItem>
                    <SelectItem value="AIIT">Amity Institute of Information Technology (AIIT)</SelectItem>
                    <SelectItem value="AIB">Amity Institute of Biotechnology (AIB)</SelectItem>
                    <SelectItem value="ASCO">Amity School of Communication (ASCO)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select onValueChange={(value) => handleSelectChange("semester", value)} value={formData.semester}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select onValueChange={(value) => handleSelectChange("section", value)} value={formData.section}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E"].map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.section && <p className="text-sm text-red-500">{errors.section}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCard">Upload ID Card</Label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    id="idCard"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload ID Card"}
                  </Button>

                  {idCardPreview && (
                    <div className="relative mt-2 border rounded-md overflow-hidden">
                      <Image
                        src={idCardPreview || "/placeholder.svg"}
                        alt="ID Card Preview"
                        width={300}
                        height={200}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}

                  {errors.idCard && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {errors.idCard}
                    </div>
                  )}

                  {formData.idCard && !errors.idCard && (
                    <p className="text-sm text-green-600">ID Card uploaded successfully</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#003366] hover:bg-[#002244]">
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-[#003366] font-medium hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-[#003366] text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Amity University Madhya Pradesh - Sports Department</p>
        </div>
      </footer>
    </div>
  )
}
