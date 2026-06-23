import { describe, expect, test, } from '@jest/globals';
import getOwnIpAddresses from '~/server/lib/getOwnIpAddresses';

describe('[lib] getOwnIpAddress;', () => {
  test('The output of the function getOwnIpAddress should be correct.', () => {
    expect(JSON.stringify(getOwnIpAddresses())).toMatch('[{\"ipv4\":\"192.168.1.5\",\"ipv6\":\"2408:826c:118:3908:80d:728:2c50:d540\"}]');
  });
});
