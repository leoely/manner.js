import { describe, expect, test, } from '@jest/globals';
import * as byteArray from '~/server/lib/byteArray';

describe('[lib] byteArray;', () => {
  test('The output of the function byteArray should be correct.', () => {
    const buf = byteArray.fromInt(243423423n);
    expect(String(byteArray.toInt(buf))).toBe('243423423');
  });
});
