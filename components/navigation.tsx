"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Phone, LogIn, Menu, X } from "lucide-react"

// Define navigation items as an array of objects for easier management
const navItems = [
  { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
  { href: "/homebot", label: "Homebot", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Effect to handle background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect for section detection on the homepage using IntersectionObserver
  useEffect(() => {
    // Only run this logic on the homepage
    if (pathname !== "/") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When a section is intersecting by at least 40%, update the active section state
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      // Options: trigger when 40% of the section is visible
      { root: null, rootMargin: "0px", threshold: 0.4 }
    )

    // Observe all elements with the .snap-section class
    const sections = document.querySelectorAll(".snap-section")
    sections.forEach((section) => observer.observe(section))

    // Cleanup function to unobserve all sections
    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [pathname]) // Rerun effect if the path changes

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);


  // Memoize style calculations to avoid re-calculating on every render
  const navStyles = useMemo(() => {
    // Default styles for pages other than home
    if (pathname !== "/") {
      return {
        textColor: "text-foreground",
        buttonStyle: "bg-gray-900 text-white border-gray-900/20 hover:bg-gray-800",
        navBg: "bg-white/80 dark:bg-black/80 backdrop-blur-sm"
      }
    }

    // Sections with a light background that need dark text
    const lightBgSections = ["statistics", "about-us"]

    if (lightBgSections.includes(activeSection)) {
      return {
        textColor: "text-gray-900 font-medium",
        buttonStyle: "bg-gray-900 text-white border-gray-900/20 hover:bg-gray-800",
        navBg: isScrolled ? "bg-white/80 backdrop-blur-sm" : "bg-transparent"
      }
    }

    // Default styles for dark sections on the homepage (e.g., "hero")
    return {
      textColor: "text-white font-medium",
      buttonStyle: "bg-white text-black border-white/20 hover:bg-white/90",
      navBg: isScrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
    }
  }, [pathname, activeSection, isScrolled])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 transition-all duration-300 ${navStyles.navBg} ${navStyles.textColor}`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            Properlytic
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium hover:opacity-70 transition-opacity flex items-center gap-1.5"
                // Add aria-current for accessibility on the active page
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <Link href="/signin">
              <Button variant="outline" className={`rounded-full px-5 flex items-center gap-1.5 ${navStyles.buttonStyle}`}>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-white dark:bg-black">
           <div className="flex flex-col items-center justify-center h-full gap-8 text-xl">
             {navItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="font-medium text-foreground hover:opacity-70 transition-opacity flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className={`rounded-full px-6 py-3 text-lg flex items-center gap-2 bg-gray-900 text-white`}>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </Button>
              </Link>
           </div>
        </div>
      )}
    </>
  )
}
