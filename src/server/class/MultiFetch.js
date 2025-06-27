import https from 'https';
import net from 'net';
import fetch from 'node-fetch';
import { Ipv4Router, Ipv6Router, } from 'advising.js';
import Blockable from './Blockable';

class MultiFetch extends Blockable {
  constructor(bases, interval) {
    super();
    this.index = -1;
    this.dealParams(bases, interval);
    this.bases = bases;
    if (interval !== undefined) {
      this.interval = interval;
    }
    this.ipv4Block = new Ipv4Router({ debug: false, hideError: true, });
    this.ipv6Block = new Ipv6Router({ debug: false, hideError: true, });
    this.cleanIpAddress = this.cleanIpAddress.bind(this);
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
    const { ip, } = expandOptions;
    let ans;
    if (ip !== undefined) {
      const { interval, } = this;
      if (net.isIPv4(ip)) {
        const { ipv4Block, } = this;
        ans = this.examineIpAddress(ip, ipv4Block);
      } else if (net.isIPv6(ip)) {
        const { ipv6Block, } = this;
        ans = this.examineIpAddress(ip, ipv6Block);
      } else {
        throw new Error('[Error] The Ip type is not expected.');
      }
    }
    if (ans === false) {
      throw new Error('[Error] The current IP address is blocked because it is accessed too frequently.');
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
