import config from '@/config'

export const metadata = {
  title: `${config.title} | Branch`,
  description: 'Branch',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}