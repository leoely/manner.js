import { describe, expect, test, } from '@jest/globals';
import isIntranetIpv4Address from '~/server/lib/isIntranetIpv4Address';

describe('[lib] isIntranetIpv4Addres;', () => {
  test('The output of the function isIntranetIpv4Address should be correct.', () => {
    expect(isIntranetIpv4Address('192.168.1.5')).toBe(true);
  });
});
