export default function isIntranetIpv4Address(address) {
  let total = 0;
  let sectionValue = 0;;
  let sectionCount = 0;
  for (let i = 0; i <= address.length; i += 1) {
    const char = address.charAt(i);
    switch (char) {
      case '':
      case '.':
        sectionCount += 1;
        total *= 256;
        total += sectionValue;
        sectionValue = 0;
        break;
      default:
        if (!(char >= '0' && char <= '9')) {
          return false;
        }
        sectionValue *= 10;
        sectionValue += parseInt(char);
    }
  }
  if (sectionCount !== 4) {
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
