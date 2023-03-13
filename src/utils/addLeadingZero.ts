export default function addLeadingZero(num: number | string) {
  return ("0" + num).slice(-2);
}