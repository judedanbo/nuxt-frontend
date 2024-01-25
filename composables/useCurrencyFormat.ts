export const useCurrencyFormat = (number: number) => {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS'} ).format(number) 
}
