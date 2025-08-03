import { UserWithRelations as User } from '@/types/user'
import { create } from 'zustand'

interface UserStore {
  users: User[]
  setUsers: (users: User[]) => void
  getUserById: (id: string) => User | null
  addUser: (user: User) => void
  editUser: (user: User) => void
  deleteUser: (id: string) => void
}

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  setUsers: (users) => set({ users }),
  getUserById: (id: string) => get().users.find(user => user.id === id) || null,
  addUser: (user: User) => set({ users: [...get().users, user] }),
  editUser: (user: User) => set({ users: get().users.map(m => m.id === user.id ? user : m) }),
  deleteUser: (id: string) => set({ users: get().users.filter(user => user.id !== id) }),
}))

export default useUserStore