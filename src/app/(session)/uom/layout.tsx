import config from '@/config'

export const metadata = {
  title: `${config.title} | UOM`,
  description: 'Unit of Measurement',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}