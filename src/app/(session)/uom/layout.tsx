import config from '@/config'
import Page from './page'

export const metadata = {
  title: `${config.title} | UOM`,
  description: 'Unit of Measurement',
}

export default function Layout() {
  return (
    <Page />
  )
}
