import net from 'net';
import { Ipv4Router, Ipv6Router, } from 'advising.js';

function getIntervalFromTime(time) {
  const currentTime = new Date().getTime();
  return Math.floor(currentTime - time);
}

class Blocks {
  constructor(interval) {
    this.dealParams(interval);
    this.interval = interval;
    this.count = 0;
    this.ipv4Blocks = new Ipv4Router({ debug: false, hideError: true, });
    this.ipv6Blocks = new Ipv6Router({ debug: false, hideError: true, });
  }

  dealParams(interval) {
    if (!Number.isInteger(interval)) {
      throw new Error('[Error] The interval parameter should be of integer type.');
    }
    if (interval <= 0) {
      throw new Error('[Error] The interval should be a positive integer otherwise it has no meaning.');
    }
    if (!Number.isInteger(interval / 500)) {
      throw new Error('[Error] The parameter interval should be divisible by 500 milliseconds.');
    }
  }

  getCount() {
    return this.count;
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
    let ipBlocks;
    if (net.isIPv4(ip)) {
      ipBlocks = this.ipv4Blocks;
    } else if (net.isIPv6(ip)) {
      ipBlocks = this.ipv6Blocks;
    } else {
      throw new Error('[Error] The Ip type is not expected');
    }
    const block = ipBlocks.gain(ip);
    if (block !== undefined) {
      const { time, } = block;
      const interval = getIntervalFromTime(time);
      if (interval >= formerInterval) {
        ipBlocks.ruin(ip);
        this.count = 0;
      }
    }
  }

  examineIpAddress(ip, ipBlocks) {
    let ans = true;
    const block = ipBlocks.gain(ip);
    if (block === undefined) {
      const currentTime = new Date().getTime();
      ipBlocks.attach(ip, { time: currentTime, count: 1, });
      this.count = 1;
      const { interval, } = this;
      setTimeout(() => this.cleanIpAddress(ip, this.interval), interval);
    } else {
      const { time, } = block;
      const interval = getIntervalFromTime(time);
      if (interval < this.interval) {
        let { count, } = block;
        count += 1;
        ipBlocks.revise(ip, { time, count, });
        this.count = count;
        ans = false;
      } else {
        ipBlocks.ruin(ip);
        this.count = 0;
      }
    }
    return ans;
  }

  examine(ip) {
    if (ip !== undefined) {
      const { interval, } = this;
      if (net.isIPv4(ip)) {
        const { ipv4Blocks, } = this;
        return this.examineIpAddress(ip, ipv4Blocks);
      } else if (net.isIPv6(ip)) {
        const { ipv6Blocks, } = this;
        return this.examineIpAddress(ip, ipv6Blocks);
      } else {
        throw new Error('[Error] The Ip type is not expected.');
      }
    }
  }
}

export default Blocks;
