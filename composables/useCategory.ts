export const useCategory = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch<Category|null>(config.public.API_BASE_URL + '/inventory/categories/' + id + '/')
}