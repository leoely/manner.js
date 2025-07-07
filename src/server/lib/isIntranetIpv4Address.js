export default function isIntranetIpv4Address(address) {
  let total = 0;
  let value = 0;;
  let count = 0;
  for (let i = 0; i <= address.length; i += 1) {
    const char = address.charAt(i);
    switch (char) {
      case '':
      case '.':
        count += 1;
        total *= 256;
        total += value;
        value = 0;
        break;
      default:
        if (!(char >= '0' && char <= '9')) {
          return false;
        }
        value *= 10;
        value += parseInt(char);
    }
  }
  if (count !== 4) {
    return false;
  }
  let ans = false;
  if (total >= 167772160 && total <= 184549375) {
    ans = true;
  }
  if (total >= 2886729728 && total <= 2887778303) {
    ans = true;
  }
  if (total >= 3232235520 && total <= 3232301055) {
    ans = true;
  }
  return ans;
}
