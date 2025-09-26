import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function formatNumber(number) {
  return new Intl.NumberFormat('fr-FR').format(number)
}

export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'tts_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateApiKey(apiKey) {
  return apiKey && apiKey.startsWith('tts_') && apiKey.length === 36
}

export const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    limits: {
      tts: 1000,
      translation: 5000,
      requests: 100
    }
  },
  STARTER: {
    name: 'Starter',
    price: 19,
    limits: {
      tts: 10000,
      translation: 50000,
      requests: 1000
    }
  },
  PRO: {
    name: 'Pro',
    price: 49,
    limits: {
      tts: 50000,
      translation: 200000,
      requests: 5000
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 199,
    limits: {
      tts: -1, // unlimited
      translation: -1,
      requests: -1
    }
  }
}