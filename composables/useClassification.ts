export const useClassification = (id: number|string) => {
   const config = useRuntimeConfig()
  return  useFetch<Classification|null>(config.public.API_BASE_URL + '/inventory/classification/' + id + '/')
}