import os from 'os';
import net from 'net';
import isIntranetIpv4Address from '~/server/lib/isIntranetIpv4Address';

export default function getOwnIpAddresses() {
  const networks = os.networkInterfaces();
  const ans = [];
  Object.keys(networks).forEach((key) => {
    const network = networks[key];
    const { length, } = network;
    if (length >= 2) {
      let ipv4;
      let ipv6;
      for (let i = 0; i < length; i += 1) {
        const ip = network[i];
        const { internal, } = ip
        if (internal === true) {
          break;
        } else {
          const { family, } = ip
          switch (family) {
            case 'IPv6': {
              const { address, } = ip;
              if (net.isIPv6(address)) {
                ipv6 = address;
              }
              break;
            }
            case 'IPv4': {
              const { address, } = ip;
              if (isIntranetIpv4Address(address)) {
                ipv4 = address;
              }
              break;
            }
          }
          if (ipv4 !== undefined && ipv6 !== undefined) {
            ans.push({ ipv4, ipv6, });
          }
        }
      }
    }
  });
  return ans;
}
