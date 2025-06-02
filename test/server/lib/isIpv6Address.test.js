import { describe, expect, test, } from '@jest/globals';
import isIpv6Address from '~/server/lib/isIpv6Address';

describe('[lib] isIpv6Address;', () => {
  test('The output of the function isIpv6Address should be correct.', () => {
    expect(isIpv6Address('2408:826c:118:3908:80d:728:2c50:d540')).toBe(true);
  });
});
