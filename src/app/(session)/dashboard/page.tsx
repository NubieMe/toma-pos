// app/dashboard/page.tsx

import { getUserSession } from "@/utils/session"

export default async function DashboardPage() {
  const user = await getUserSession()
  
  if (!user) return null

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Welcome, {user.username}!</h1>
      <p>You&apos;re logged in as <strong>{user.role.name}</strong></p>
    </div>
  )
}
