import config from '@/config'

export const metadata = {
  title: `${config.title} | Stock In`,
  description: 'Stock In',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}