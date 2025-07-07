export interface TableColumn<T> {
    key: keyof T
    label: string
    numeric?: boolean
    disablePadding?: boolean
    render?: (value: T[keyof T], row: T) => React.ReactNode
}
  