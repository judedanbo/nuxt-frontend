export const useUnit = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch<Unit|null>(config.public.API_BASE_URL + '/inventory/units/' + id + '/')
}
