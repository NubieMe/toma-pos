import config from "@/config"

export const metadata = {
    title: `${config.title} | Company Configuration`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}