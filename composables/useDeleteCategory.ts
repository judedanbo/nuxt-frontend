export const useDeleteCategory = (id: number|string) => {
 const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/categories/' + id + '/', {
    method: 'DELETE'
  })
}