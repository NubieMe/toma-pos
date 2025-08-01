import config from '@/config'

export const metadata = {
  title: `${config.title} | Stock Management`,
  description: 'Stock Management',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}