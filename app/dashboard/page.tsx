"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock, LogOut } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Type definitions
interface UserType {
  name: string
  enrollmentNumber: string
  department: string
  semester: string
  section: string
  idCard?: string
}

interface Equipment {
  id: string
  type: string
  name: string
  available: boolean
  category: string
}

interface IssuedEquipment {
  id: string
  equipmentId: string
  equipmentName: string
  equipmentType: string
  equipmentCategory: string
  issuedAt: string
  dueAt: string
  returnedAt: string | null
  lateFee: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [issuedEquipment, setIssuedEquipment] = useState<IssuedEquipment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock equipment data
  const mockEquipment: Equipment[] = [
    // Table Tennis - 6 bats
    { id: "tt-bat-1", type: "table-tennis", name: "Table Tennis Bat 1", available: true, category: "Table Tennis" },
    { id: "tt-bat-2", type: "table-tennis", name: "Table Tennis Bat 2", available: true, category: "Table Tennis" },
    { id: "tt-bat-3", type: "table-tennis", name: "Table Tennis Bat 3", available: true, category: "Table Tennis" },
    { id: "tt-bat-4", type: "table-tennis", name: "Table Tennis Bat 4", available: true, category: "Table Tennis" },
    { id: "tt-bat-5", type: "table-tennis", name: "Table Tennis Bat 5", available: true, category: "Table Tennis" },
    { id: "tt-bat-6", type: "table-tennis", name: "Table Tennis Bat 6", available: true, category: "Table Tennis" },
    { id: "tt-ball-1", type: "table-tennis", name: "Table Tennis Ball", available: true, category: "Table Tennis" },

    // Volleyball - 2 balls
    { id: "vb-1", type: "volleyball", name: "Volleyball 1", available: true, category: "Volleyball" },
    { id: "vb-2", type: "volleyball", name: "Volleyball 2", available: true, category: "Volleyball" },

    // Basketball - 4 balls
    { id: "bb-1", type: "basketball", name: "Basketball 1", available: true, category: "Basketball" },
    { id: "bb-2", type: "basketball", name: "Basketball 2", available: true, category: "Basketball" },
    { id: "bb-3", type: "basketball", name: "Basketball 3", available: true, category: "Basketball" },
    { id: "bb-4", type: "basketball", name: "Basketball 4", available: true, category: "Basketball" },

    // Cricket - 4 bats and balls
    { id: "cr-bat-1", type: "cricket", name: "Cricket Bat 1", available: true, category: "Cricket" },
    { id: "cr-bat-2", type: "cricket", name: "Cricket Bat 2", available: true, category: "Cricket" },
    { id: "cr-bat-3", type: "cricket", name: "Cricket Bat 3", available: true, category: "Cricket" },
    { id: "cr-bat-4", type: "cricket", name: "Cricket Bat 4", available: true, category: "Cricket" },
    { id: "cr-ball-1", type: "cricket", name: "Cricket Ball 1", available: true, category: "Cricket" },
    { id: "cr-ball-2", type: "cricket", name: "Cricket Ball 2", available: true, category: "Cricket" },
    { id: "cr-ball-3", type: "cricket", name: "Cricket Ball 3", available: true, category: "Cricket" },
    { id: "cr-ball-4", type: "cricket", name: "Cricket Ball 4", available: true, category: "Cricket" },

    // Football - 2 balls
    { id: "fb-1", type: "football", name: "Football 1", available: true, category: "Football" },
    { id: "fb-2", type: "football", name: "Football 2", available: true, category: "Football" },

    // Badminton - 4 pairs of rackets and shuttles
    { id: "bd-racket-1", type: "badminton", name: "Badminton Racket 1", available: true, category: "Badminton" },
    { id: "bd-racket-2", type: "badminton", name: "Badminton Racket 2", available: true, category: "Badminton" },
    { id: "bd-racket-3", type: "badminton", name: "Badminton Racket 3", available: true, category: "Badminton" },
    { id: "bd-racket-4", type: "badminton", name: "Badminton Racket 4", available: true, category: "Badminton" },
    { id: "bd-racket-5", type: "badminton", name: "Badminton Racket 5", available: true, category: "Badminton" },
    { id: "bd-racket-6", type: "badminton", name: "Badminton Racket 6", available: true, category: "Badminton" },
    { id: "bd-racket-7", type: "badminton", name: "Badminton Racket 7", available: true, category: "Badminton" },
    { id: "bd-racket-8", type: "badminton", name: "Badminton Racket 8", available: true, category: "Badminton" },
    { id: "bd-shuttle-1", type: "badminton", name: "Badminton Shuttle", available: true, category: "Badminton" },
  ]

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(currentUser))

    // Load equipment data
    const storedEquipment = localStorage.getItem("equipment")
    if (!storedEquipment) {
      localStorage.setItem("equipment", JSON.stringify(mockEquipment))
      setEquipment(mockEquipment)
    } else {
      setEquipment(JSON.parse(storedEquipment))
    }

    // Load issued equipment
    const storedIssuedEquipment = localStorage.getItem("issuedEquipment")
    if (storedIssuedEquipment) {
      const parsedIssuedEquipment = JSON.parse(storedIssuedEquipment)

      // Update late fees for all issued equipment
      const updatedIssuedEquipment = parsedIssuedEquipment.map((item: IssuedEquipment) => {
        if (!item.returnedAt) {
          const dueDate = new Date(item.dueAt)
          const currentDate = new Date()
          const daysLate = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

          if (daysLate > 0) {
            // Calculate late fee: 10 rupees for first day, 20 for second, 30 for third, etc.
            let lateFee = 0
            for (let i = 0; i < daysLate; i++) {
              lateFee += 10 * (i + 1)
            }
            return { ...item, lateFee }
          }
        }
        return item
      })

      setIssuedEquipment(updatedIssuedEquipment)
      localStorage.setItem("issuedEquipment", JSON.stringify(updatedIssuedEquipment))
    } else {
      setIssuedEquipment([])
    }

    setLoading(false)

    // Set up timer to update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const issueEquipment = (equipmentId: string) => {
    if (!user) return

    // Find the equipment
    const selectedEquipment = equipment.find((e) => e.id === equipmentId)
    if (!selectedEquipment) return

    // Check equipment type limits
    const userIssuedByType = issuedEquipment.filter(
      (item) => !item.returnedAt && item.equipmentType === selectedEquipment.type,
    )

    // Apply specific limits based on equipment type
    if (selectedEquipment.type === "table-tennis" && selectedEquipment.name.includes("Bat")) {
      const issuedTTBats = userIssuedByType.filter((item) => item.equipmentName.includes("Bat")).length
      if (issuedTTBats >= 2) {
        toast({
          title: "Issue Failed",
          description: "You can only issue a maximum of 2 table tennis bats at a time",
          variant: "destructive",
        })
        return
      }

      // Check if all table tennis bats are issued
      const availableTTBats = equipment.filter(
        (e) => e.type === "table-tennis" && e.name.includes("Bat") && e.available,
      )
      if (availableTTBats.length <= 1) {
        // Including the current one being issued
        toast({
          title: "Limited Availability",
          description: "This is the last table tennis bat available",
        })
      }
    } else if (selectedEquipment.type === "table-tennis" && selectedEquipment.name.includes("Ball")) {
      const issuedTTBalls = userIssuedByType.filter((item) => item.equipmentName.includes("Ball")).length
      if (issuedTTBalls >= 1) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 1 table tennis ball at a time",
          variant: "destructive",
        })
        return
      }
    } else if (selectedEquipment.type === "volleyball") {
      const issuedVolleyballs = userIssuedByType.length
      if (issuedVolleyballs >= 1) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 1 volleyball at a time",
          variant: "destructive",
        })
        return
      }
    } else if (selectedEquipment.type === "basketball") {
      const issuedBasketballs = userIssuedByType.length
      if (issuedBasketballs >= 1) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 1 basketball at a time",
          variant: "destructive",
        })
        return
      }
    } else if (selectedEquipment.type === "cricket") {
      const issuedCricketItems = userIssuedByType.length
      if (issuedCricketItems >= 2) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 1 cricket bat and 1 cricket ball at a time",
          variant: "destructive",
        })
        return
      }

      // Check if trying to issue more than one bat or ball
      const issuedCricketBats = userIssuedByType.filter((item) => item.equipmentName.includes("Bat")).length
      const issuedCricketBalls = userIssuedByType.filter((item) => item.equipmentName.includes("Ball")).length

      if (
        (selectedEquipment.name.includes("Bat") && issuedCricketBats >= 1) ||
        (selectedEquipment.name.includes("Ball") && issuedCricketBalls >= 1)
      ) {
        toast({
          title: "Issue Failed",
          description: `You already have a cricket ${selectedEquipment.name.includes("Bat") ? "bat" : "ball"} issued`,
          variant: "destructive",
        })
        return
      }
    } else if (selectedEquipment.type === "football") {
      const issuedFootballs = userIssuedByType.length
      if (issuedFootballs >= 1) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 1 football at a time",
          variant: "destructive",
        })
        return
      }
    } else if (selectedEquipment.type === "badminton") {
      const issuedBadmintonItems = userIssuedByType.length
      if (issuedBadmintonItems >= 3) {
        toast({
          title: "Issue Failed",
          description: "You can only issue 2 badminton rackets and 1 shuttle at a time",
          variant: "destructive",
        })
        return
      }

      // Check if trying to issue more than two rackets or one shuttle
      const issuedBadmintonRackets = userIssuedByType.filter((item) => item.equipmentName.includes("Racket")).length
      const issuedBadmintonShuttles = userIssuedByType.filter((item) => item.equipmentName.includes("Shuttle")).length

      if (
        (selectedEquipment.name.includes("Racket") && issuedBadmintonRackets >= 2) ||
        (selectedEquipment.name.includes("Shuttle") && issuedBadmintonShuttles >= 1)
      ) {
        toast({
          title: "Issue Failed",
          description: `You have reached the limit for badminton ${selectedEquipment.name.includes("Racket") ? "rackets" : "shuttles"}`,
          variant: "destructive",
        })
        return
      }
    }

    // Create issue record
    const issueDate = new Date()
    const dueDate = new Date(issueDate)
    dueDate.setHours(dueDate.getHours() + 2) // Due in 2 hours

    const newIssue: IssuedEquipment = {
      id: Date.now().toString(),
      equipmentId,
      equipmentName: selectedEquipment.name,
      equipmentType: selectedEquipment.type,
      equipmentCategory: selectedEquipment.category,
      issuedAt: issueDate.toISOString(),
      dueAt: dueDate.toISOString(),
      returnedAt: null,
      lateFee: 0,
    }

    // Update equipment availability
    const updatedEquipment = equipment.map((e) => (e.id === equipmentId ? { ...e, available: false } : e))

    // Save changes
    const updatedIssuedEquipment = [...issuedEquipment, newIssue]
    setEquipment(updatedEquipment)
    setIssuedEquipment(updatedIssuedEquipment)
    localStorage.setItem("equipment", JSON.stringify(updatedEquipment))
    localStorage.setItem("issuedEquipment", JSON.stringify(updatedIssuedEquipment))

    toast({
      title: "Equipment Issued",
      description: `You have issued ${selectedEquipment.name}. Maximum usage time is 2 hours. Please return by ${formatDate(dueDate)}`,
    })
  }

  const returnEquipment = (issueId: string) => {
    // Find the issue record
    const issueRecord = issuedEquipment.find((item) => item.id === issueId)
    if (!issueRecord) return

    // Update issue record
    const updatedIssuedEquipment = issuedEquipment.map((item) =>
      item.id === issueId ? { ...item, returnedAt: new Date().toISOString() } : item,
    )

    // Update equipment availability
    const updatedEquipment = equipment.map((e) => (e.id === issueRecord.equipmentId ? { ...e, available: true } : e))

    // Save changes
    setEquipment(updatedEquipment)
    setIssuedEquipment(updatedIssuedEquipment)
    localStorage.setItem("equipment", JSON.stringify(updatedEquipment))
    localStorage.setItem("issuedEquipment", JSON.stringify(updatedIssuedEquipment))

    // Show toast with late fee if applicable
    if (issueRecord.lateFee > 0) {
      toast({
        title: "Equipment Returned with Late Fee",
        description: `You have returned ${issueRecord.equipmentName}. Late fee: ₹${issueRecord.lateFee}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Equipment Returned",
        description: `You have successfully returned ${issueRecord.equipmentName}`,
      })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const calculateTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()

    // Calculate time difference in milliseconds
    const diff = due.getTime() - now.getTime()

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isLate: true, percentRemaining: 0 }
    }

    // Convert to hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    // Calculate percentage of time remaining (2 hours = 7200000 milliseconds)
    const totalTimeMs = 2 * 60 * 60 * 1000
    const percentRemaining = Math.max(0, Math.min(100, (diff / totalTimeMs) * 100))

    return { hours, minutes, seconds, isLate: false, percentRemaining }
  }

  const formatTimeRemaining = (dueDate: string) => {
    const { hours, minutes, seconds, isLate } = calculateTimeRemaining(dueDate)

    if (isLate) {
      return "Time expired"
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#003366] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold flex items-center gap-3">
            <Image
              src="/images/amity-logo.png"
              alt="Amity University Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span>Amity Sports Department</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-[#003366]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Your registration details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Enrollment Number</p>
                  <p className="text-lg">{user?.enrollmentNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-lg">{user?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Semester & Section</p>
                  <p className="text-lg">
                    Semester {user?.semester}, Section {user?.section}
                  </p>
                </div>
              </div>

              {user?.idCard && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">ID Card</p>
                  <div className="w-full max-w-xs mx-auto border rounded-md overflow-hidden">
                    <Image
                      src={user.idCard || "/placeholder.svg"}
                      alt="Student ID Card"
                      width={300}
                      height={200}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="issue">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="issue">Issue Equipment</TabsTrigger>
              <TabsTrigger value="current">Current Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="issue">
              <Card>
                <CardHeader>
                  <CardTitle>Available Equipment</CardTitle>
                  <CardDescription>
                    Select from our range of sports equipment. Each category has specific borrowing limits. Maximum
                    usage time for any equipment is 2 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="table-tennis" className="w-full">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                      <TabsTrigger value="table-tennis">Table Tennis</TabsTrigger>
                      <TabsTrigger value="volleyball">Volleyball</TabsTrigger>
                      <TabsTrigger value="basketball">Basketball</TabsTrigger>
                      <TabsTrigger value="cricket">Cricket</TabsTrigger>
                      <TabsTrigger value="football">Football</TabsTrigger>
                      <TabsTrigger value="badminton">Badminton</TabsTrigger>
                    </TabsList>

                    {/* Table Tennis Equipment */}
                    <TabsContent value="table-tennis">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">Borrowing Limit: Maximum 2 bats and 1 ball at a time</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "table-tennis")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Table Tennis Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "table-tennis").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No table tennis equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Volleyball Equipment */}
                    <TabsContent value="volleyball">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">Borrowing Limit: Maximum 1 volleyball at a time</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "volleyball")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Volleyball Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "volleyball").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No volleyball equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Basketball Equipment */}
                    <TabsContent value="basketball">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">Borrowing Limit: Maximum 1 basketball at a time</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "basketball")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Basketball Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "basketball").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No basketball equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Cricket Equipment */}
                    <TabsContent value="cricket">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">
                            Borrowing Limit: Maximum 1 cricket bat and 1 cricket ball at a time
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "cricket")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Cricket Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "cricket").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No cricket equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Football Equipment */}
                    <TabsContent value="football">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">Borrowing Limit: Maximum 1 football at a time</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "football")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Football Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "football").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No football equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Badminton Equipment */}
                    <TabsContent value="badminton">
                      <div className="grid gap-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <p className="text-sm font-medium">
                            Borrowing Limit: Maximum 2 badminton rackets and 1 shuttle at a time
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {equipment
                            .filter((item) => item.available && item.type === "badminton")
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-4">Badminton Equipment</p>
                                </div>
                                <Button
                                  onClick={() => issueEquipment(item.id)}
                                  className="w-full bg-[#003366] hover:bg-[#002244]"
                                >
                                  Issue
                                </Button>
                              </div>
                            ))}
                        </div>

                        {equipment.filter((item) => item.available && item.type === "badminton").length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-lg">
                            <p className="text-muted-foreground font-medium">
                              No badminton equipment available for issue at the moment
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please check back later or try another sport
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="current">
              <Card>
                <CardHeader>
                  <CardTitle>Your Issued Equipment</CardTitle>
                  <CardDescription>
                    Equipment you have currently issued. Maximum usage time is 2 hours. Late returns incur fees.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Issued On</TableHead>
                        <TableHead>Due By</TableHead>
                        <TableHead>Time Remaining</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Late Fee</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issuedEquipment
                        .filter((item) => !item.returnedAt)
                        .map((item) => {
                          const issuedDate = new Date(item.issuedAt)
                          const dueDate = new Date(item.dueAt)
                          const currentDate = new Date()
                          const isLate = currentDate > dueDate
                          const timeRemaining = calculateTimeRemaining(item.dueAt)

                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.equipmentName}</TableCell>
                              <TableCell>{item.equipmentCategory}</TableCell>
                              <TableCell>{formatDate(issuedDate)}</TableCell>
                              <TableCell>{formatDate(dueDate)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">{formatTimeRemaining(item.dueAt)}</span>
                                  </div>
                                  <Progress
                                    value={timeRemaining.percentRemaining}
                                    className={`h-2 ${timeRemaining.percentRemaining < 25 ? "bg-red-100" : "bg-slate-100"}`}
                                    indicatorClassName={
                                      timeRemaining.percentRemaining < 25
                                        ? "bg-red-500"
                                        : timeRemaining.percentRemaining < 50
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                {isLate ? (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Late
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> On Time
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{item.lateFee > 0 ? `₹${item.lateFee}` : "-"}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" onClick={() => returnEquipment(item.id)}>
                                  Return
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}

                      {issuedEquipment.filter((item) => !item.returnedAt).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6">
                            You have no equipment currently issued
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {issuedEquipment.some((item) => item.returnedAt) && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Equipment History</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Equipment</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Issued On</TableHead>
                            <TableHead>Returned On</TableHead>
                            <TableHead>Late Fee Paid</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {issuedEquipment
                            .filter((item) => item.returnedAt)
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.equipmentName}</TableCell>
                                <TableCell>{item.equipmentCategory}</TableCell>
                                <TableCell>{formatDate(new Date(item.issuedAt))}</TableCell>
                                <TableCell>{formatDate(new Date(item.returnedAt!))}</TableCell>
                                <TableCell>{item.lateFee > 0 ? `₹${item.lateFee}` : "None"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-[#003366] text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Amity University Madhya Pradesh - Sports Department</p>
        </div>
      </footer>
    </div>
  )
}
