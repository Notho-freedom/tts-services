'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  KeyIcon, 
  PlusIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState(new Set())

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      } else {
        toast.error('Erreur lors du chargement des clés API')
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des clés API')
    } finally {
      setIsLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Le nom de la clé est requis')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys([data.apiKey, ...apiKeys])
        setNewKeyName('')
        setShowCreateForm(false)
        toast.success('Clé API créée avec succès')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création de la clé API')
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la clé API')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteApiKey = async (keyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette clé API ?')) {
      return
    }

    try {
      const response = await fetch(`/api/keys?id=${keyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId))
        toast.success('Clé API supprimée')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Clé copiée dans le presse-papiers')
  }

  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const maskApiKey = (key) => {
    return key.slice(0, 8) + '...' + key.slice(-4)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <KeyIcon className="h-8 w-8 mr-3" />
          Clés API
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez vos clés API pour accéder à nos services
        </p>
      </div>

      {/* Create API Key Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Créer une nouvelle clé API</CardTitle>
          <CardDescription>
            Générez une nouvelle clé pour accéder à nos API
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle clé API
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Nom de la clé</Label>
                <Input
                  id="keyName"
                  placeholder="Ex: Application mobile, Site web..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={createApiKey} 
                  disabled={isCreating}
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewKeyName('')
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Vos clés API</CardTitle>
          <CardDescription>
            {apiKeys.length === 0 
              ? 'Aucune clé API créée'
              : `${apiKeys.length} clé${apiKeys.length > 1 ? 's' : ''} API`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <KeyIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune clé API
              </h3>
              <p className="text-gray-600 mb-4">
                Créez votre première clé API pour commencer à utiliser nos services
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Créer une clé
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <KeyIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {visibleKeys.has(apiKey.id) 
                              ? apiKey.key 
                              : maskApiKey(apiKey.key)
                            }
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Créée le {new Date(apiKey.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      apiKey.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {apiKey.active ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comment utiliser vos clés API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Synthèse Vocale (TTS)</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`curl -X POST https://votre-domaine.com/api/tts \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Bonjour, ceci est un test",
    "voice": "alloy",
    "speed": 1.0,
    "apiKey": "votre-cle-api"
  }'`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Traduction</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`curl -X POST https://votre-domaine.com/api/translate \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello world",
    "from": "en",
    "to": "fr",
    "apiKey": "votre-cle-api"
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}