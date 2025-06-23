// app/offline/page.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  useEffect(() => {
    const handleOnline = () => {
      window.location.reload()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md text-center shadow-xl border border-red-200">
        <CardHeader className="flex flex-col items-center gap-2">
          <WifiOff className="text-red-500 w-12 h-12" />
          <CardTitle className="text-2xl text-red-600">Oops !</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Vous n&apos;êtes pas connecté à Internet. Veuillez vérifier votre connexion réseau.
          </p>

          <div className="flex flex-col gap-2">
            <Button variant="default">
            <Link href="/">Retour à l&apos;accueil</Link>
            </Button>

           
          </div>

          <div className="mt-4 text-sm text-gray-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            En attente d’une reconnexion automatique...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
