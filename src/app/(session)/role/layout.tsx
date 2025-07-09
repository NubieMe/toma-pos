import config from '@/config'

export const metadata = {
  title: `${config.title} | Role Management`,
  description: 'Role management page',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
