import config from '@/config'

export const metadata = {
  title: `${config.title} | Stock Out`,
  description: 'Stock Out',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}