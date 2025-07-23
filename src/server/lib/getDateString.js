export default function getDateString(date) {
  if (date === undefined) {
    date = new Date();
  }
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}
