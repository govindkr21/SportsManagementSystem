import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#003366] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/amity-logo.png"
              alt="Amity University Logo"
              width={60}
              height={60}
              className="rounded-md"
            />
            <h1 className="text-xl font-bold text-[#FFCC00]">Amity University Madhya Pradesh</h1>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline" className="text-[#FFCC00] border-[#FFCC00] hover:bg-[#FFCC00] hover:text-[#003366]">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#FFCC00] text-[#003366] hover:bg-yellow-300">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#003366] to-[#004080] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/amity-logo.png"
                alt="Amity University Logo"
                width={120}
                height={120}
                className="rounded-md"
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#FFCC00]">Sports Equipment Management System</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Welcome to Amity University Madhya Pradesh's Sports Equipment Management Portal. Sign up or login to issue
              sports equipment for your activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#FFCC00] hover:bg-yellow-300 text-[#003366] px-8 font-semibold">
                  Register Now
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8 border-[#FFCC00] text-white hover:bg-[#FFCC00]/10">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#003366] mb-12">Available Sports Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <EquipmentCard
                title="Table Tennis"
                description="6 bats and balls available for issue"
                imageSrc="/images/sports/table-tennis.png"
              />
              <EquipmentCard
                title="Volleyball"
                description="2 volleyballs available for issue"
                imageSrc="/images/sports/volleyball.png"
              />
              <EquipmentCard
                title="Basketball"
                description="4 basketballs available for issue"
                imageSrc="/basket.png"
              />
              <EquipmentCard
                title="Cricket"
                description="4 bats and balls available for issue"
                imageSrc="/images/sports/cricket.png"
              />
              <EquipmentCard
                title="Football"
                description="2 footballs available for issue"
                imageSrc="/images/sports/football.png"
              />
              <EquipmentCard
                title="Badminton"
                description="4 pairs of rackets and shuttles"
                imageSrc="/images/sports/badminton.png"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#003366] mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-[#FFCC00]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#003366]">{step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#003366]">
                    {step === 1 && "Sign Up"}
                    {step === 2 && "Issue Equipment"}
                    {step === 3 && "Return On Time"}
                  </h3>
                  <p className="text-gray-600">
                    {step === 1 && "Register with your name, enrollment number, password, upload your ID card, and select your department (ASET, ALS, ABS, etc.)"}
                    {step === 2 && "Browse available equipment and issue what you need for your sports activities. Maximum usage time is 2 hours."}
                    {step === 3 && "Return equipment within 2 hours to avoid late fees (₹10 first day, ₹20 second day, etc.)"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#003366] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#FFCC00]">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join the Amity University sports community and access our equipment management system today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-[#FFCC00] hover:bg-yellow-300 text-[#003366] px-8 font-semibold">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#002244] text-white p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/amity-logo.png"
                  alt="Amity University Logo"
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <h3 className="text-lg font-semibold text-[#FFCC00]">Amity University Madhya Pradesh</h3>
              </div>
              <p className="text-sm text-gray-300">
                Sports Department
                <br />
                Maharajpura, Gwalior, Madhya Pradesh
                <br />
                PIN: 474005
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#FFCC00]">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sports Facilities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    University Website
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#FFCC00]">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Email: sports@amity.edu</li>
                <li>Phone: +91 123 456 7890</li>
                <li>Hours: Mon-Sat, 9:00 AM - 5:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} Amity University Madhya Pradesh - Sports Department. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function EquipmentCard({ title, description, imageSrc }: { title: string; description: string; imageSrc?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      {imageSrc && (
        <Image src={imageSrc} alt={`${title} equipment`} width={96} height={96} className="mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2 text-[#003366]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
