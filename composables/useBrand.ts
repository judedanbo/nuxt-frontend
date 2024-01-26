export const useBrand = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch<Brand|null>(config.public.API_BASE_URL + '/inventory/brands/' + id + '/')
}
