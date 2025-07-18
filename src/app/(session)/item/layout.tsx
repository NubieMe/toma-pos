import config from "@/config"

export const metadata = {
  title: `${config.title} | Item Management`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}