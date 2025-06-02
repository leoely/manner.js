export default function parseHttpDate(httpDate) {
  let [_, rest] = httpDate.split(', ');
  let [day, month, year, time] = rest.split(' ');
  const [hours, minutes, seconds] = time.split(':');
  const date = new Date();
  date.setFullYear(parseInt(year));
  switch (month) {
    case 'Jan':
      month = 0;
      break;
    case 'Feb':
      month = 1;
      break;
    case 'Mar':
      month = 2;
      break;
    case 'Apr':
      month = 3;
      break;
    case 'May':
      month = 4;
      break;
    case 'Jun':
      month = 5;
      break;
    case 'Jul':
      month = 6;
      break;
    case 'Aug':
      month = 7;
      break;
    case 'Sep':
      month = 8;
      break;
    case 'Oct':
      month = 9;
      break;
    case 'Nov':
      month = 10;
      break;
    case 'Dec':
      month = 11;
      break;
  }
  date.setMonth(month);
  date.setUTCDate(parseInt(day));
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  date.setSeconds(parseInt(seconds));
  return date;
}
