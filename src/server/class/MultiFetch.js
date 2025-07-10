import https from 'https';
import http from 'http';
import net from 'net';
import fetch from 'node-fetch';
import { Ipv4Router, Ipv6Router, } from 'advising.js';

class MultiFetch {
  constructor(bases, interval) {
    this.index = -1;
    this.dealParams(bases, interval);
    this.bases = bases;
    if (interval !== undefined) {
      this.interval = interval;
    }
  }

  dealParams(bases, interval) {
    if (!Array.isArray(bases)) {
      throw new Error('[Error] The bases parameter bases should be a array type.');
      const { length, } = bases;
      if (length === 0) {
        throw new Error('[Error] The bases parameter bases cannot have zero length.');
      }
    }
    if (interval !== undefined) {
      if (!Number.isInteger(interval)) {
        throw new Error('[Error] The interval parameter should be of integer type.');
      }
      if (interval <= 0) {
        throw new Error('[Error] The interval should be a positive integer otherwise it has no meaning.');
      }
    }
  }

  async fetch(path, options, expandOptions = {}) {
    if (typeof path !== 'string') {
      throw new Error('[Error] The path parameter path should be of string type.');
    }
    if (typeof options !== 'object') {
      throw new Error('[Error] The options parameter should be a object type.');
    }
    const { req, } = expandOptions;
    if (req !== undefined) {
      if (!(req instanceof http.ClientRequest)) {
        throw new Error('[Error] Need to pass http request objec.');
      }
    }
    const { bases, } = this;
    if (this.index < bases.length - 1) {
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
