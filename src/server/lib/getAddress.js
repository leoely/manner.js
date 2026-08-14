import net from 'net';

export default function getAddress(hostname, port) {
  if (net.isIPv6(hostname)) {
    const ipv6 = hostname;
    return '[' + ipv6 + ']:' + port;
  }
  if (net.isIPv4(hostname)) {
    const ipv4 = hostname;
    return ipv4 + ':' + port;
  }
  if (/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(hostname)) {
    return hostname + ':' + port;
  }
  throw new Error('[Error] The parameter hostname should belong to one of the set{ipv4, ipv6, hostname}.');
}
