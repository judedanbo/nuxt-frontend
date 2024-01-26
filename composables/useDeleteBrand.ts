export const useDeleteBrand = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/brands/' + id + '/', {
    method: 'DELETE'
  })
}
