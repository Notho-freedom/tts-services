import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, PLANS } from '@/lib/utils'

export async function POST(request) {
  try {
    const { text, from = 'auto', to = 'fr', apiKey } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Le texte est requis' }, 
        { status: 400 }
      )
    }

    if (!to) {
      return NextResponse.json(
        { error: 'La langue cible est requise' }, 
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API requise' }, 
        { status: 401 }
      )
    }

    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Clé API invalide' }, 
        { status: 401 }
      )
    }

    // Vérifier la clé API
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          include: {
            subscriptions: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    })

    if (!apiKeyRecord || !apiKeyRecord.active) {
      return NextResponse.json(
        { error: 'Clé API non trouvée ou inactive' }, 
        { status: 401 }
      )
    }

    const user = apiKeyRecord.user
    const subscription = user.subscriptions[0]
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Aucun abonnement trouvé' }, 
        { status: 403 }
      )
    }

    // Vérifier les limites
    const plan = PLANS[subscription.plan]
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyUsage = await prisma.usage.aggregate({
      where: {
        userId: user.id,
        service: 'TRANSLATION',
        createdAt: {
          gte: currentMonth
        }
      },
      _sum: {
        characters: true,
        requests: true
      }
    })

    const totalCharacters = monthlyUsage._sum.characters || 0
    const totalRequests = monthlyUsage._sum.requests || 0

    // Vérifier les limites
    if (plan.limits.translation !== -1 && totalCharacters >= plan.limits.translation) {
      return NextResponse.json(
        { 
          error: 'Limite de caractères de traduction dépassée pour ce mois',
          usage: { characters: totalCharacters, limit: plan.limits.translation }
        }, 
        { status: 429 }
      )
    }

    if (plan.limits.requests !== -1 && totalRequests >= plan.limits.requests) {
      return NextResponse.json(
        { 
          error: 'Limite de requêtes dépassée pour ce mois',
          usage: { requests: totalRequests, limit: plan.limits.requests }
        }, 
        { status: 429 }
      )
    }

    // Effectuer la traduction
    const translation = await translateText(text, from, to)
    
    // Enregistrer l'usage
    await prisma.usage.create({
      data: {
        userId: user.id,
        apiKeyId: apiKeyRecord.id,
        service: 'TRANSLATION',
        characters: text.length,
        requests: 1,
        cost: calculateTranslationCost(text.length, subscription.plan)
      }
    })

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translation,
      detectedLanguage: from === 'auto' ? 'auto-detected' : from,
      targetLanguage: to,
      usage: {
        characters: text.length,
        totalThisMonth: totalCharacters + text.length,
        limit: plan.limits.translation
      }
    })

  } catch (error) {
    console.error('Erreur traduction:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}

// Fonction pour traduire le texte
async function translateText(text, from, to) {
  try {
    // Simulation avec Google Translate API
    // En production, remplacez par votre vraie API
    
    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from === 'auto' ? undefined : from,
        target: to,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error('Erreur API de traduction')
    }

    const data = await response.json()
    return data.data.translations[0].translatedText
    
  } catch {
    // Fallback simple pour la démo
    return `[Traduction simulée de "${text}" vers ${to}]`
  }
}

function calculateTranslationCost(characters, plan) {
  const rates = {
    FREE: 0,
    STARTER: 0.00002,
    PRO: 0.000015,
    ENTERPRISE: 0.00001
  }
  
  return characters * (rates[plan] || 0)
}