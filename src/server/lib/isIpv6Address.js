export default function isIpv6Address(address) {
  let count = 0;
  let ans = true;
  for (let i = 0; i <= address.length; i += 1) {
    const char = address.charAt(i);
    switch (char) {
      case '':
      case ':':
        count += 1;
        break;
      default:
        if (!((char >= '0' && char <= '9') || (char >= 'a' && char <= 'f'))) {
          ans = false;
        }
    }
  }
  if (count !== 8) {
    ans = false;
  }
  return ans;
}
