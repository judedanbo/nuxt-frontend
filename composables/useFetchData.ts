
export const useFetchData = (url: string ) => {
  const config = useRuntimeConfig()
  const fetchData=  useLazyFetch(config.public.API_BASE_URL + url, {
  })
  return fetchData
}
