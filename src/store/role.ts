import { Role } from '@prisma/client'
import { create } from 'zustand'

interface RoleStore {
  roles: Role[]
  setRoles: (roles: Role[]) => void
  getRoleById: (id: string) => Role | null
  addRole: (role: Role) => void
  editRole: (role: Role) => void
  deleteRole: (id: string) => void
}

const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
  getRoleById: (id: string) => get().roles.find(role => role.id === id) || null,
  addRole: (role: Role) => set({ roles: [...get().roles, role] }),
  editRole: (role: Role) => set({ roles: get().roles.map(m => m.id === role.id ? role : m) }),
  deleteRole: (id: string) => set({ roles: get().roles.filter(role => role.id !== id) }),
}))

export default useRoleStore