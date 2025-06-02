import os from 'os';
import isIntranetIpv4Address from '~/server/lib/isIntranetIpv4Address';
import isIpv6Address from '~/server/lib/isIpv6Address';

export default function getOwnIpAddresses() {
  const nets = os.networkInterfaces();
  const ans = [];
  Object.keys(nets).forEach((key) => {
    const net = nets[key];
    const { length, } = net;
    if (length >= 2) {
      let ipv4;
      let ipv6;
      for (let i = 0; i < length; i += 1) {
        const ip = net[i];
        const { internal, } = ip
        if (internal === true) {
          break;
        } else {
          const { family, } = ip
          switch (family) {
            case 'IPv6': {
              const { address, } = ip;
              if (isIpv6Address(address)) {
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
