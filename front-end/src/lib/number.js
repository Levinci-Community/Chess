export function formatNumber(number) {
  const numStr = number.toString();
  const parts = numStr.split(".");
  const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formattedNumber =
    parts.length === 2 ? `${formattedInteger},${parts[1]}` : formattedInteger;
  return formattedNumber;
}
