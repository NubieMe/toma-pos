import config from '@/config'

export const metadata = {
  title: `${config.title} | Users Management`,
  description: 'Users Management',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}