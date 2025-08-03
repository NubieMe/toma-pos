import config from '@/config'

export const metadata = {
  title: `${config.title} | Role Management`,
  description: 'Role management',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
