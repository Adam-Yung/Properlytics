"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"
import AnimatedPlaceholder from "@/components/animated-placeholder"
import ImageSlideshow from "@/components/image-slideshow"
import MapComponentWithNoSSR from "@/components/dynamic-map"
import ChatInterface from "@/components/chat-interface"
import TeamCard from "@/components/team-card"
import GlobeComponent from "@/components/globe-component"
import LocationPills from "@/components/location-pills"
import AnimatedStatsWithNoSSR from "@/components/dynamic-animated-stats"
import { useRouter } from "next/navigation"

// Sample data for the slideshow using the provided home images
const propertyImages = [
  { src: "/images/home1.jpeg", alt: "Modern Spanish-style home" },
  { src: "/images/home2.webp", alt: "Spanish-style home with patio" },
  { src: "/images/home_coastal.jpeg", alt: "Coastal Spanish retreat" },
  { src: "/images/home3.jpeg", alt: "Spanish colonial home" },
  { src: "/images/home4.jpeg", alt: "Modern farmhouse" },
  { src: "/images/home5.jpeg", alt: "Mediterranean-style home" },
]

// Sample team data
const teamMembers = [
  {
    name: "Daniel Lewis",
    role: "Founder",
    education: "Columbia",
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hrVoe0VIA8nAPqdu3ZMEmQOLmBbK3L.png",
  },
  {
    name: "Hailin Liang",
    role: "Founder",
    education: "Columbia",
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-71YfZ2dsS5zKfASUG9TDl48jrgwWvT.png",
  },
  {
    name: "Adam Yung",
    role: "Co-Founder",
    education: "UCLA",
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jr9mp6KtMNIA9wcd3as5eH8NdtjIxX.png",
  },
  {
    name: "Amber Shu",
    role: "Chief Marketing Officer",
    education: "USC",
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k4mrCl3sc9OG2Pyg7BL12rGFURKaU3.png",
  },
]

// Location data
const locations = [
  { name: "Manhattan", longitude: -73.9712, latitude: 40.7831 },
  { name: "Cupertino", longitude: -122.0322, latitude: 37.323 },
  { name: "Los Angeles", longitude: -118.2437, latitude: 34.0522 },
  { name: "Chicago", longitude: -87.6298, latitude: 41.8781 },
  { name: "Miami", longitude: -80.1918, latitude: 25.7617 },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)
  const [globeExpanded, setGlobeExpanded] = useState(false)

  // Ensure proper scroll behavior
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const delta = e.deltaY
      const currentScroll = container.scrollTop
      const sectionHeight = window.innerHeight

      // Calculate target section
      const currentSection = Math.round(currentScroll / sectionHeight)
      const targetSection = delta > 0 ? currentSection + 1 : currentSection - 1
      const targetScroll = targetSection * sectionHeight

      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      })
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  const handleLocationSelect = (location: (typeof locations)[0]) => {
    setSelectedLocation(location)
    if (inputRef.current) {
      setInputValue(`What is my property worth in ${location.name}?`)
      inputRef.current.value = `What is my property worth in ${location.name}?`
    }
  }

  const handleSubmit = () => {
    setGlobeExpanded(true)

    // Navigate to homebot page after animation
    setTimeout(() => {
      router.push("/homebot")
    }, 1500)
  }

  return (
    <main>
      <Navigation />

      <div ref={containerRef} className="snap-container">
        {/* Section 1: Hero */}
        <section
          id="hero"
          className="snap-section bg-black text-white relative overflow-hidden"
          style={{
            backgroundImage: "url('//unpkg.com/three-globe/example/img/night-sky.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto h-full px-4 flex">
            {/* Left side - Text content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-left">Your Insight Into Real Estate</h1>
                <p className="text-xl md:text-2xl font-medium mb-8 text-left">
                  Ask Homebot what your property will be worth
                </p>
              </div>
            </div>

            {/* Right side - Globe */}
            <div className="hidden md:flex md:w-1/2 h-full items-center justify-center">
              <div className="w-[800px] h-[800px]">
                <GlobeComponent expanded={globeExpanded} selectedLocation={selectedLocation || undefined} />
              </div>
            </div>
          </div>

          {/* Bottom section - Input and location pills */}
          <div className="absolute bottom-16 left-0 right-0 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="relative mb-6">
                <Input
                  ref={inputRef}
                  className="h-16 pl-6 pr-16 text-lg rounded-full shadow-lg bg-white/10 text-white border-white/20 w-full"
                  placeholder=" "
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                {!inputValue && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none">
                    <AnimatedPlaceholder
                      placeholders={[
                        "What will my property be worth in five years?",
                        "How about similar properties?",
                        "How much will renovations increase my home's value?",
                        "What will this neighborhood be like in five years?",
                      ]}
                    />
                  </div>
                )}
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-12 w-12 p-0"
                  size="icon"
                  onClick={handleSubmit}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex justify-start">
                <LocationPills locations={locations} onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Statistics & Showcase */}
        <section id="statistics" className="snap-section theme-light-blue">
          <div className="container mx-auto h-full flex flex-col justify-center px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-left">
                  Unparalleled Statistics and Forecasting
                </h2>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Market Growth Projections</h3>
                  <div className="h-48 rounded-lg overflow-hidden">
                    <img
                      src="/images/fan_chart_1.png"
                      alt="Market Growth Fan Chart"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Price Trend Analysis</h3>
                  <div className="h-48 rounded-lg overflow-hidden">
                    <img
                      src="/images/fan_chart_2.png"
                      alt="Price Trend Fan Chart"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="h-[500px] md:h-[700px]">
                <ImageSlideshow images={propertyImages} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <AnimatedStatsWithNoSSR value={90} suffix="%" prefix="" duration={2000} delay={200} />
                <p className="text-sm text-gray-600">Customer Retention Rate</p>
              </div>
              <div className="text-center">
                <AnimatedStatsWithNoSSR value={12} suffix="%" prefix="<" duration={2000} delay={400} />
                <p className="text-sm text-gray-600">Deviation from Zillow</p>
              </div>
              <div className="text-center">
                <AnimatedStatsWithNoSSR value={10000} suffix="" prefix="" duration={2000} delay={600} />
                <p className="text-sm text-gray-600">HomeBot Pro Subscribers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Data */}
        <section id="interactive-data" className="snap-section theme-dark-blue">
          <div className="container mx-auto h-full flex flex-col justify-center px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left">Property Data at Your Fingertips</h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-[70vh] shadow-2xl border border-white/20">
              <div className="bg-gray-900 rounded-2xl h-full overflow-hidden shadow-xl">
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <h3 className="font-medium text-white">Homebot - Real Estate Analytics</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-0 h-[calc(100%-60px)]">
                  <div className="h-full p-4">
                    <MapComponentWithNoSSR lightMode={true} />
                  </div>

                  <div className="h-full border-l border-gray-700">
                    <div className="bg-gray-700 p-4 border-b border-gray-600">
                      <h4 className="font-medium text-white">Chat with Homebot</h4>
                    </div>
                    <div className="h-[calc(100%-60px)]">
                      <ChatInterface
                        initialMessages={[
                          {
                            id: 1,
                            text: "Hello! I'm Homebot, your real estate AI assistant. How can I help you today?",
                            sender: "bot",
                          },
                          {
                            id: 2,
                            text: "What will my apartment along East 86th Street be worth five years later?",
                            sender: "user",
                          },
                          {
                            id: 3,
                            text: "Based on recent sales in ARLOPARC and similar new developments on the Upper East Side, a 2-bedroom unit of this size could be valued between $2.7 million and $3.5 million. (For reference, a 2-bedroom unit in ARLOPARC recently listed for $2,762,003.12).",
                            sender: "bot",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: About Us */}
        <section id="about-us" className="snap-section theme-colorful">
          <div className="container mx-auto h-full flex flex-col justify-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-left">Meet the Team</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  education={member.education}
                  imageSrc={member.imageSrc}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
