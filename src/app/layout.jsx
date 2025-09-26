import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/components/AuthProvider"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TTS Services - API de synthèse vocale et traduction",
  description: "API puissante pour la synthèse vocale, traduction et autres services IA. Plans flexibles pour développeurs.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
