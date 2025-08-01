import { COMMON_FEATURES } from "@/constant/enum"

export type Action = {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
}

export type ActionTable = (typeof COMMON_FEATURES)[number]