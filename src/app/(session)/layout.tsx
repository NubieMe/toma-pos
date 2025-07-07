// app/dashboard/layout.tsx
import Sidebar from '@/components/sidebar'
import config from '@/config'

export const metadata = {
  title: `${config.title} | Dashboard`,
  description: config.description
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
