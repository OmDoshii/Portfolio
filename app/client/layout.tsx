import { ClientAuthProvider } from './auth-context'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Client Portal — Oriange',
  description: 'Client login and support portal',
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ClientAuthProvider>{children}</ClientAuthProvider>
}
