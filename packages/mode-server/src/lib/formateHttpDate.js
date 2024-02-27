export default function formateHttpDate(date) {
  let [week, month, day, year, time, zone] = date.toString().split(' ');
  zone = zone.split('+')[0];
  return month + ', ' + day + ' ' + month + ' ' + year + ' ' + time + ' ' + zone;
}
