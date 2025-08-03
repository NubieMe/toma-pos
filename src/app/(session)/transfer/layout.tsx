import config from '@/config'

export const metadata = {
  title: `${config.title} | Transfer Stock`,
  description: 'Transfer Stock',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
