import Image from 'next/image'
import Link from 'next/link'
import { Carousel } from './components/Carousel'
import { PageHeader } from './components/PageHeader'

export default function Home() {
  // This would be fetched from your database in a real application
  const recentPhotos = [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ]

  return (
    <div>
      <PageHeader 
        title="Welcome to Our Family Website" 
        description="A place to share and cherish our memories together"
      />
      <div className="mb-12">
        <Carousel images={recentPhotos} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Recent Updates</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              New photos from the summer picnic
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Upcoming family reunion details
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Grandma's special recipe added to the cookbook
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/photos" className="text-primary hover:underline">View Photo Gallery</Link>
            </li>
            <li>
              <Link href="/events" className="text-primary hover:underline">Check Upcoming Events</Link>
            </li>
            <li>
              <Link href="/stories" className="text-primary hover:underline">Read Family Stories</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

