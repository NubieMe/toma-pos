import config from '@/config'

export const metadata = {
  title: `${config.title} | Cashier`,
  description: 'Cashier',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
