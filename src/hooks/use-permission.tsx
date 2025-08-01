import { ActionTable } from "@/types/action";
import { useAuth } from "../context/auth-context";
import useMenuStore from "@/store/menu";

export function usePermission() {
    const { user } = useAuth()
    const { activeMenu } = useMenuStore()

    const permissions = activeMenu?.permissions || []
    const permit = permissions.find((item) => item.role_id === user?.role.id)
    const permission: ActionTable[] = permit?.actions || []

    return {
        permission
    }
}