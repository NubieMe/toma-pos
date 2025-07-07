export const metadata = {
    title: `${process.env.TITLE || "Toma POS"} | Login`,
    description: "One stop solution for your business",
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>{children}</div>
    )
}