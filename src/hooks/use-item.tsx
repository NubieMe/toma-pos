import { useQuery } from "@tanstack/react-query"

export default function useItem() {
  async function fetchItems() {
    const res = await fetch("/api/item?limit=10000")
    const { data } = await res.json()
    return data
  }

  const query = useQuery({
    queryKey: ['item-option'],
    queryFn: fetchItems,
  })

  return {
    query
  }
}