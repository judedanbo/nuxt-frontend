export const useDeleteClassification = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/classification/' + id + '/', {
    method: 'DELETE'
  })
}