export const useDeleteUnit = (id: number|string) => {
  const config = useRuntimeConfig()
  return  useFetch(config.public.API_BASE_URL + '/inventory/units/' + id + '/', {
    method: 'DELETE'
  })
}
