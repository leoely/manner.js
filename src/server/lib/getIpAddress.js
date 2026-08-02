import net from 'net';

export default function getIpAddress(ip, port) {
  if (net.isIPv6(ip)) {
    const ipv6 = ip;
    return '[' + ipv6 + ']:' + port;
  }
  if (net.isIPv4(ip)) {
    const ipv4 = ip;
    return ipv4 + ':' + port;
  }
}
