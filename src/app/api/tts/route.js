import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, PLANS } from '@/lib/utils'

export async function POST(request) {
  try {
    const { text, voice = 'alloy', speed = 1, apiKey } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Le texte est requis' }, 
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
        service: 'TTS',
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

    // Vérifier les limites (sauf pour Enterprise qui a -1 = illimité)
    if (plan.limits.tts !== -1 && totalCharacters >= plan.limits.tts) {
      return NextResponse.json(
        { 
          error: 'Limite de caractères TTS dépassée pour ce mois',
          usage: { characters: totalCharacters, limit: plan.limits.tts }
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

    // Simuler un appel à l'API TTS (remplacez par votre vrai service)
    const audioUrl = await generateTTS(text, voice, speed)
    
    // Enregistrer l'usage
    await prisma.usage.create({
      data: {
        userId: user.id,
        apiKeyId: apiKeyRecord.id,
        service: 'TTS',
        characters: text.length,
        requests: 1,
        cost: calculateTTSCost(text.length, subscription.plan)
      }
    })

    return NextResponse.json({
      success: true,
      audioUrl,
      usage: {
        characters: text.length,
        totalThisMonth: totalCharacters + text.length,
        limit: plan.limits.tts
      }
    })

  } catch (error) {
    console.error('Erreur TTS:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}

// Fonction simulée pour générer du TTS
async function generateTTS(text, voice, speed) {
  // Ici vous intégreriez votre service TTS réel (OpenAI, ElevenLabs, etc.)
  // Pour l'exemple, on simule avec une URL
  
  // Simulation avec OpenAI TTS API
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        speed: speed
      })
    })

    if (!response.ok) {
      throw new Error('Erreur API TTS')
    }

    // En production, vous stockeriez le fichier et retourneriez l'URL
    return `https://votre-domaine.com/audio/${Date.now()}.mp3`
    
  } catch {
    // Fallback ou erreur
    throw new Error('Service TTS temporairement indisponible')
  }
}

function calculateTTSCost(characters, plan) {
  const rates = {
    FREE: 0,
    STARTER: 0.0001,
    PRO: 0.00008,
    ENTERPRISE: 0.00005
  }
  
  return characters * (rates[plan] || 0)
}