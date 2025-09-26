import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/utils'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      )
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        key: true,
        active: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ apiKeys })

  } catch (error) {
    console.error('Erreur récupération clés API:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      )
    }

    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la clé est requis' }, 
        { status: 400 }
      )
    }

    // Vérifier le nombre de clés existantes
    const existingKeys = await prisma.apiKey.count({
      where: {
        userId: session.user.id,
        active: true
      }
    })

    if (existingKeys >= 5) {
      return NextResponse.json(
        { error: 'Limite de 5 clés API atteinte' }, 
        { status: 400 }
      )
    }

    const apiKey = generateApiKey()
    
    const newApiKey = await prisma.apiKey.create({
      data: {
        name,
        key: apiKey,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      apiKey: {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key,
        active: newApiKey.active,
        createdAt: newApiKey.createdAt
      }
    })

  } catch (error) {
    console.error('Erreur création clé API:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'ID de la clé requis' }, 
        { status: 400 }
      )
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id
      }
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API non trouvée' }, 
        { status: 404 }
      )
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { active: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Clé API désactivée'
    })

  } catch (error) {
    console.error('Erreur suppression clé API:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}