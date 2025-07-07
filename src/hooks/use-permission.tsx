import { useAuth } from "../context/auth-context";
import useMenuStore from "@/store/menu";

export function usePermission() {
    const { user } = useAuth()
    const { activeMenu } = useMenuStore()

    const permissions = activeMenu?.permissions || []
    const permit = permissions.find((item) => item.role_id === user?.role.id)
    const permission = permit ?
        {
            create: permit.create,
            read: permit.read,
            update: permit.update,
            delete: permit.delete,
            collapsible: activeMenu?.path === ''
        } : 
        null

    return {
        permission
    }
}