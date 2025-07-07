class ClientFetch {
  constructor() {
    this.filters = {};
    this.hasTimeout = true;
    this.idx = 0;
    this.abortControllers = [];
  }

  setHasTimeout(hasTimeout) {
    if (typeof hasTimeout !== 'boolean') {
      throw new Error('[Error] The parameter has a timeout and needs to be a boolean type.');
    }
    this.hasTimeout = hasTimeout;
  }

  addFilter(status, callback) {
    if (!(Number.isInteger(status) && status >= 0)) {
      throw new Error('[Error] The parameter status code should be a positive integer type.');
    }
    if (typeof callback !== 'function') {
      throw new Error('[Error] The parameter callback should be4 of function type.');
    }
    const { filters, } = this;
    if (filters[status] !== undefined) {
      throw new Error('[Error] The current status code has been bound.');
    }
    filters[status] = callback;
  }

  renew() {
    const { abortControllers, } = this;
    abortControllers.forEach((abortController) => {
      if (abortController !== undefined) {
        abortController.abort();
      }
    });
    this.idx = 0;
    this.abortControllers = [];
  }

  async fetch(url, options) {
    const abortController = new AbortController();
    const { idx, } = this;
    this.abortControllers[idx] = abortController;
    this.idx += 1;
    const { hasTimeout, } = this;
    let response;
    if (hasTimeout === true) {
      try {
        if (options !== undefined) {
          const { ownSignals, } = options;
          if (Array.isArray(ownSignals)) {
            response = await fetch(url, {
              signal: AbortSignal.any([
                AbortSignal.timeout(9000),
                abortController.signal,
                ...ownSignals,
              ]),
              ...options,
            });
          } else {
            response = await fetch(url, {
              signal: AbortSignal.any([
                AbortSignal.timeout(9000),
                abortController.signal,
              ]),
              ...options,
            });
          }
        } else {
          response = await fetch(url, {
            signal: AbortSignal.any([
              AbortSignal.timeout(9000),
              abortController.signal,
            ]),
          });
        }
      } catch (error) {
        const { name, } = error;
        switch (name) {
          case 'AbortError':
          case 'TimeoutError': {
            const { filters, } = this;
            await filters[512](response);
            break;
          }
          default:
            throw new Error('[Error] Unexpected exception occurred.');
        }
      }
    } else {
      if (options !== undefined && typeof options === 'object') {
        response = await fetch(url, {
          ...options,
          headers: { 'Has-Timeout': 'false', },
        });
      } else {
        response = await fetch(url, {
          headers: { 'Has-Timeout': 'false', },
        });
      }
    }
    if (response !== undefined) {
      if (response.ok) {
        this.abortControllers[idx] = undefined;
        return response;
      } else {
        const { status, } = response;
        const { filters, } = this;
        await filters[status](response);
        throw new Error('[Error] Receive an exception from the server.');
      }
    }
  }
}

export default ClientFetch;
