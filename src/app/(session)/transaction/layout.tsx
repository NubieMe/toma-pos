import config from '@/config'

export const metadata = {
  title: `${config.title} | Transaction`,
  description: 'Transaction',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
