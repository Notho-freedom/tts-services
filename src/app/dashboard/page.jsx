'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ChartBarIcon, 
  KeyIcon, 
  SpeakerWaveIcon,
  LanguageIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { data: session } = useSession()
  const [usage, setUsage] = useState({
    totalRequests: 0,
    totalCharacters: 0,
    totalCost: 0,
    ttsUsage: 0,
    translationUsage: 0
  })

  // Simuler des données d'usage pour la démo
  useEffect(() => {
    // En production, vous récupéreriez ces données depuis votre API
    setUsage({
      totalRequests: 1247,
      totalCharacters: 45892,
      totalCost: 12.45,
      ttsUsage: 28450,
      translationUsage: 17442
    })
  }, [])

  const stats = [
    {
      name: 'Requêtes ce mois',
      value: usage.totalRequests.toLocaleString(),
      icon: ChartBarIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Caractères traités',
      value: usage.totalCharacters.toLocaleString(),
      icon: SpeakerWaveIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Coût total',
      value: `$${usage.totalCost.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      name: 'Clés API actives',
      value: '3',
      icon: KeyIcon,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-gray-600">
          Bienvenue, {session?.user?.name || session?.user?.email} ! Voici un aperçu de votre utilisation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SpeakerWaveIcon className="h-5 w-5 mr-2 text-blue-600" />
              Synthèse Vocale (TTS)
            </CardTitle>
            <CardDescription>
              Utilisation du service de synthèse vocale ce mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Caractères utilisés</span>
                <span className="font-medium">{usage.ttsUsage.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Limite: 50,000</span>
                <span>65% utilisé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LanguageIcon className="h-5 w-5 mr-2 text-green-600" />
              Traduction
            </CardTitle>
            <CardDescription>
              Utilisation du service de traduction ce mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Caractères traduits</span>
                <span className="font-medium">{usage.translationUsage.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: '35%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Limite: 100,000</span>
                <span>35% utilisé</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Vos dernières requêtes API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: 'TTS', text: 'Bonjour, comment allez-vous ?', time: 'Il y a 2 minutes' },
              { service: 'Traduction', text: 'Hello world', time: 'Il y a 15 minutes' },
              { service: 'TTS', text: 'Ceci est un test de synthèse vocale', time: 'Il y a 1 heure' },
              { service: 'Traduction', text: 'Welcome to our platform', time: 'Il y a 2 heures' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.service === 'TTS' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {activity.service === 'TTS' ? (
                      <SpeakerWaveIcon className="h-4 w-4" />
                    ) : (
                      <LanguageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.service}</p>
                    <p className="text-sm text-gray-600">{activity.text}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}