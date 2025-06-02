export default function formatHttpDate(ms) {
  const date = new Date(ms);
  let [week, month, day, year, time, zone] = date.toString().split(' ');
  zone = zone.split('+')[0];
  return week + ', ' + day + ' ' + month + ' ' + year + ' ' + time + ' ' + zone;
}
