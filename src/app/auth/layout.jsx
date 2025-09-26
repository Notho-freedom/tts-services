import { Metadata } from 'next'

export const metadata = {
  title: 'Connexion - TTS Services',
  description: 'Connectez-vous à votre compte TTS Services'
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  )
}