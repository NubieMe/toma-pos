// app/dashboard/layout.tsx
import Header from '@/components/header';
import Sidebar from '@/components/sidebar'
import config from '@/config'

export const metadata = {
  title: `${config.title} | Dashboard`,
  description: config.description
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="flex min-h-screen position-relative">
      {/* Sidebar di Kiri */}
      <Sidebar />

      {/* Konten Utama di Kanan */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* 1. Header yang baru dibuat diletakkan di sini */}
        <Header />

        {/* 2. Konten Halaman */}
        <main className="flex-grow p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
