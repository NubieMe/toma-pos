import config from "@/config"

export const metadata = {
  title: `${config.title} | Menu Permission`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
