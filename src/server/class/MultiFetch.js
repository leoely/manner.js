import https from 'https';
import fetch from 'node-fetch';

class MultiFetch {
  constructor(bases) {
    this.index = -1;
    this.dealParams(bases);
    this.bases = bases;
  }

  dealParams(bases) {
    if (!Array.isArray(bases)) {
      throw new Error('[Error] The bases parameter bases should be a array type.');
      const { length, } = bases;
      if (length === 0) {
        throw new Error('[Error] The bases parameter bases cannot have zero length.');
      }
    }
  }

  async fetch(path, options) {
    if (typeof path !== 'string') {
      throw new Error('[Error] The path parameter path should be of string type.');
    }
    if (typeof options !== 'object') {
      throw new Error('[Error] The options parameter should be a object type.');
    }
    const { bases, } = this;
    const { length, } = bases;
    if (this.index < length - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }
    const { index, } = this;
    const base = bases[index];
    if (base.startsWith('https')) {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false, });
      options.agent = httpsAgent;
    }
    const url = base + path;
    return fetch(url, options);
  }
}

export default MultiFetch;
