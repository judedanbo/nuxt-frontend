export const useNumberFormat = (number: number, fractionDigit: number = 0) => {
  return new Intl.NumberFormat('en-GH', { minimumFractionDigits: fractionDigit } ).format(number) 
}
  