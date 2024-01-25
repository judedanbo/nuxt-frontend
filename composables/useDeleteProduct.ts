export const useDeleteProduct = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/products/' + id + '/', {
    method: 'DELETE'
  })
}
