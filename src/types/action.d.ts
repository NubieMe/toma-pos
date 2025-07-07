export type Action = {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
}

export type ActionTable = 'view' | 'edit' | 'delete'