import https from 'https';
import net from 'net';
import fetch from 'node-fetch';
import { Ipv4Router, Ipv6Router, } from 'advising.js';

function getIntervalFromTime(time) {
  const currentTime = new Date().getTime();
  return Math.floor(currentTime - time);
}

class MultiFetch {
  constructor(bases, interval) {
    this.index = -1;
    this.dealParams(bases, interval);
    this.bases = bases;
    if (interval !== undefined) {
      this.interval = interval;
    }
    this.ipv4Block = new Ipv4Router({
      debug: false, hideError: true,
    });
    this.ipv6Block = new Ipv6Router({
      debug: false, hideError: true,
    });
    this.number = 0;;
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

  setInterval(interval) {
    if (!Number.isInteger(interval)) {
      throw new Error('[Error] The interval parameter should be of integer type.');
    }
    if (interval <= 0) {
      throw new Error('[Error] The interval should be a positive integer otherwise it has no meaning.');
    }
    this.interval = interval;
  }

  cleanIpAddress(ip, formerInterval) {
    let ipBlock;
    if (net.isIPv4(ip)) {
      ipBlock = this.ipv4Block;
    } else if (net.isIpv6(ip)) {
      ipBlock = this.ipv6Block;
    } else {
      throw new Error('[Error] The Ip type is not expected');
    }
    const time = ipBlock.gain(ip);
    if (time !== undefined) {
      const interval = getIntervalFromTime(time);
      if (interval < formerInterval) {
        ipBlock.ruin(ip);
      }
    }
  }

  dealIpAddress(ip, ipBlock) {
    const time = ipBlock.gain(ip);
    if (time === undefined) {
      const currentTime = new Date().getTime();
      ipBlock.attach(ip, currentTime);
      const { interval, } = this;
      setTimeout(() => this.cleanIpAddress(ip, interval), interval);
    } else {
      const interval = getIntervalFromTime(time);
      if (interval < this.interval) {
        const wait = this.interval - time;
        setTimeout(() => this.cleanIpAddress(ip, this.interval), wait);
        throw new Error('[Error] The current IP address is blocked because it is accessed too frequently.');
      } else {
        ipBlock.ruin(ip);
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
    if (ip !== undefined) {
      const { interval, } = this;
      if (net.isIPv4(ip)) {
        const { ipv4Block, } = this;
        await this.dealIpAddress(ip, ipv4Block);
      } else if (net.isIPv6(ip)) {
        const { ipv6Block, } = this;
        await this.dealIpAddress(ip, ipv6Block);
      } else {
        throw new Error('[Error] The Ip type is not expected.');
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
