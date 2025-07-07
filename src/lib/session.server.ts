import { cookies } from "next/headers"
import { SESSION_NAME, SESSION_SECRET } from "./session"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import { Session } from "@/types/session"
import { prisma } from "./prisma"

export async function getUserSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_NAME)?.value

  if (!token) return redirect('/login')

  try {
    return jwt.verify(token, SESSION_SECRET) as Session
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getUserFromCookie(req: Request | null = null): Promise<Session | null> {
  let token: string | undefined

  if (req instanceof Request) {
    const cookieHeader = req.headers.get('cookie') ?? ''
    const match = cookieHeader.match(`${SESSION_NAME}=([^;]+)`)
    token = match?.[1]
  }

  if (!token) return null

  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as Session
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    })

    if (!user || !user.role) return null

    return {
      id: user.id,
      username: user.username,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    }
  } catch (err) {
    console.error(err)
    return null
  }
}