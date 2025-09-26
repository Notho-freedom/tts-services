import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  SpeakerWaveIcon, 
  LanguageIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CubeTransparentIcon 
} from '@heroicons/react/24/outline'

export default function Home() {
  const features = [
    {
      name: 'Synthèse Vocale',
      description: 'Convertissez votre texte en audio de haute qualité avec des voix naturelles.',
      icon: SpeakerWaveIcon,
    },
    {
      name: 'Traduction',
      description: 'Traduisez instantanément dans plus de 100 langues avec une précision élevée.',
      icon: LanguageIcon,
    },
    {
      name: 'Résumé de texte',
      description: 'Analysez et résumez de longs documents automatiquement.',
      icon: DocumentTextIcon,
    },
    {
      name: 'Analytics',
      description: 'Suivez votre utilisation et optimisez vos coûts avec des statistiques détaillées.',
      icon: ChartBarIcon,
    },
    {
      name: 'Sécurité',
      description: 'API sécurisée avec authentification et limitation de débit.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Intégration simple',
      description: 'Documentation complète et SDK pour une intégration rapide.',
      icon: CubeTransparentIcon,
    },
  ]

  const stats = [
    { name: 'Développeurs actifs', value: '2,500+' },
    { name: 'API calls par mois', value: '10M+' },
    { name: 'Langues supportées', value: '100+' },
    { name: 'Uptime', value: '99.9%' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-cyan-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              API puissante pour la{' '}
              <span className="text-blue-600">synthèse vocale</span> et la{' '}
              <span className="text-blue-600">traduction</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Intégrez facilement des services IA avancés dans vos applications. 
              TTS haute qualité, traduction multilingue, et bien plus encore.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/auth/signin">
                  Commencer gratuitement
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs">
                  Voir la documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-cyan-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Services complets</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour vos projets IA
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Notre plateforme offre une suite complète d'API IA prêtes à l'emploi, 
              avec une documentation détaillée et des exemples de code.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Rejoignez des milliers de développeurs qui utilisent déjà notre plateforme 
              pour créer des applications innovantes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/auth/signin">
                  Créer un compte gratuit
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-white hover:text-blue-100" asChild>
                <Link href="/pricing">
                  Voir les tarifs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
