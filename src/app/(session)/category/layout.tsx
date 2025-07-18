import config from '@/config'

export const metadata = {
  title: `${config.title} | Category`,
  description: 'Category',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}