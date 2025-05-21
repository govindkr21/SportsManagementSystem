"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // In a real app, you would validate against your backend
    // For now, we'll check localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find(
      (u: any) => u.enrollmentNumber === formData.enrollmentNumber && u.password === formData.password,
    )

    if (user) {
      // Store current user info
      localStorage.setItem("currentUser", JSON.stringify(user))

      toast({
        title: "Login Successful",
        description: "Welcome to the Sports Department",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      setError("Invalid enrollment number or password")
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
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Enter your credentials to access the sports equipment management system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <Button type="submit" className="w-full bg-[#003366] hover:bg-[#002244]">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#003366] font-medium hover:underline">
                Sign Up
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
