'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Photos', path: '/photos' },
  { name: 'Videos', path: '/videos' },
  { name: 'Stories', path: '/stories' },
  { name: 'Family Tree', path: '/family-tree' },
  { name: 'Events', path: '/events' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Our Family
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-gray-600 hover:text-primary transition-colors ${
                  pathname === item.path ? 'font-semibold text-primary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block px-4 py-2 text-gray-600 hover:bg-gray-100 ${
                pathname === item.path ? 'font-semibold text-primary' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

