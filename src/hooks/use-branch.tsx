import { useQuery } from "@tanstack/react-query";

export default function useBranch() {
  async function fetchBranches() {
    const res = await fetch("/api/branch?limit=10000");
    const { data } = await res.json();
    return data
  }

  const query = useQuery({
    queryKey: ['branches-option'],
    queryFn: fetchBranches,
  })

  return {
    query
  }
}