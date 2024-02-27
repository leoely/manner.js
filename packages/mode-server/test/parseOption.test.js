import { describe, expect, test, } from '@jest/globals';
import parseOption from '~/lib/parseOption';

describe('[lib] parseOption', () => {
  test('command line option should parse correct.', () => {
    expect(parseOption('-t', 'type', '--type', 'type', '--detail-type', 'type')
    ).toEqual({ 't': 'type', 'type': 'type', 'detailType': 'type' });
  });
});
