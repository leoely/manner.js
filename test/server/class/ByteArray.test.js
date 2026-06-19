import { describe, expect, test, } from '@jest/globals';
import ByteArray from '~/server/class/ByteArray';

describe('[class] ByteArray;', () => {
  test('The output of the function byteArray should be correct.', () => {
    const byteArray = new ByteArray({ size: 256n, shift: 0n, });
    const buf = byteArray.fromInt(243423423n);
    expect(String(byteArray.toInt(buf))).toBe('243423423');
  });
  test('The output of the function nonZeroByteArray should be correct.', () => {
    const nonZeroByteArray = new ByteArray({ size: 256n, shift: 1n, });
    const buf = nonZeroByteArray.fromInt(534535345n);
    expect(String(nonZeroByteArray.toInt(buf))).toBe('534535345');
  });
});
