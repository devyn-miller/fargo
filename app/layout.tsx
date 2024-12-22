import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { Providers } from './providers'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Our Family Website',
  description: 'A place to share and cherish our family memories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
              <Providers>
                <Header />
                <main className="container mx-auto px-4 py-8 relative z-10">
                  {children}
                </main>
              </Providers>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

