import config from '@/config'
import Page from './page'

export const metadata = {
  title: `${config.title} | Role Management`,
  description: 'Role management page',
}

export default function Layout() {
  return (
    <Page />
  )
}
