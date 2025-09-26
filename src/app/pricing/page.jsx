import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckIcon } from '@heroicons/react/24/solid'
import { PLANS } from '@/lib/utils'

export const metadata = {
  title: 'Tarifs - TTS Services',
  description: 'Choisissez le plan qui convient le mieux à vos besoins'
}

export default function Pricing() {
  const plans = Object.entries(PLANS).map(([key, plan]) => ({
    id: key,
    ...plan,
    features: getPlanFeatures(key)
  }))

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Tarifs</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choisissez le plan parfait pour vous
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Des plans flexibles pour tous vos besoins, du développement à l'entreprise.
          Commencez gratuitement et évoluez selon votre croissance.
        </p>
        
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between ${
                plan.id === 'PRO' 
                  ? 'ring-2 ring-blue-600 scale-105' 
                  : ''
              }`}
            >
              <div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold leading-8 text-gray-900">
                      {plan.name}
                    </span>
                    {plan.id === 'PRO' && (
                      <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                        Populaire
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-4 text-sm leading-6 text-gray-600">
                    {getPlanDescription(plan.id)}
                  </CardDescription>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {plan.price === 0 ? 'Gratuit' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        /mois
                      </span>
                    )}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              
              <div className="p-6 pt-0">
                <Button
                  asChild
                  variant={plan.id === 'PRO' ? 'primary' : 'outline'}
                  className="w-full"
                >
                  <Link href="/auth/signin">
                    {plan.price === 0 ? 'Commencer gratuitement' : 'Démarrer'}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Comparaison détaillée des fonctionnalités
          </h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fonctionnalités
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Synthèse vocale (caractères/mois)
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {plan.limits.tts === -1 ? 'Illimité' : plan.limits.tts.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Traduction (caractères/mois)
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {plan.limits.translation === -1 ? 'Illimité' : plan.limits.translation.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Requêtes API/mois
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {plan.limits.requests === -1 ? 'Illimitées' : plan.limits.requests.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Support technique
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Communauté
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Email
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Email + Chat
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Support dédié
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h4>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                Les changements prennent effet immédiatement.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Que se passe-t-il si je dépasse mes limites ?
              </h4>
              <p className="text-gray-600 text-sm">
                Vos requêtes seront temporairement suspendues jusqu'au prochain cycle 
                de facturation ou jusqu'à ce que vous upgradiez votre plan.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Y a-t-il des frais cachés ?
              </h4>
              <p className="text-gray-600 text-sm">
                Non, tous nos prix sont transparents. Vous ne payez que pour 
                ce qui est affiché dans votre plan mensuel.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Puis-je annuler à tout moment ?
              </h4>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez annuler votre abonnement à tout moment. 
                Vous continuerez à avoir accès jusqu'à la fin de votre période de facturation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPlanDescription(planId) {
  const descriptions = {
    FREE: 'Parfait pour tester nos services et les petits projets',
    STARTER: 'Idéal pour les développeurs individuels et les startups', 
    PRO: 'Parfait pour les équipes et les applications en production',
    ENTERPRISE: 'Solution complète pour les grandes organisations'
  }
  return descriptions[planId]
}

function getPlanFeatures(planId) {
  const features = {
    FREE: [
      '1,000 caractères TTS/mois',
      '5,000 caractères de traduction/mois', 
      '100 requêtes API/mois',
      'Support communautaire',
      'Documentation complète'
    ],
    STARTER: [
      '10,000 caractères TTS/mois',
      '50,000 caractères de traduction/mois',
      '1,000 requêtes API/mois', 
      'Support par email',
      'Analytics de base'
    ],
    PRO: [
      '50,000 caractères TTS/mois',
      '200,000 caractères de traduction/mois',
      '5,000 requêtes API/mois',
      'Support email + chat',
      'Analytics avancées',
      'Webhooks',
      'SLA 99.9%'
    ],
    ENTERPRISE: [
      'TTS illimité',
      'Traduction illimitée', 
      'Requêtes illimitées',
      'Support dédié',
      'Analytics personnalisées',
      'Intégration sur-mesure',
      'SLA 99.99%',
      'Formation équipe'
    ]
  }
  return features[planId]
}