export const useProduct = (id: string) => {
  const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/products/' + id + '/')
}
