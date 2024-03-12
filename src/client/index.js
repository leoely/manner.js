export function clearCookie(namespaces) {
  Object.keys(namespaces).forEach((n) => {
    if (n.expires !== undefined) {
      Object.keys(n).forEach((k) => {
        if (n === 'user') {
          document.cookie[n + '_' + k] = '';
        }
        window.localStorage.removeItem(n + '_' + k);
      });
      delete namespaces[n];
    }
  });
  return namespaces;
}

export function filterNamespace(namespace) {
  const ans = {};
  Object.keys(namespace).forEach((k) => {
    if (k !== 'expires') {
      ans[k] = namespace[k];
    }
  });
  return ans;
}

export function readCookie() {
  const cookies = {};
  document.cookie.split(';').forEach((i) => {
    const [key, value] = i.split('=');
    cookies[key.trim()] = value;
  });
  const namespaces = {};
  Object.keys(cookies).forEach((k) => {
    const result = k.split('_');
    if (result.length === 2) {
      const [namespace, key] = result;
      if (namespaces[namespace] === undefined) {
        namespaces[namespace] = {};
      }
      namespaces[namespace][key] = cookies[k];
    }
  });
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    const result = k.split('_');
    if (result.length === 2) {
      const [namespace, key] = result;
      if (namespaces[namespace] === undefined) {
        namespaces[namespace] = {};
      }
      namespaces[namespace][key] = window.localStorage.getItem(k);
    }
  }
  return clearCookie(namespaces);
}

export function setCookie(response) {
  const cookie = response.headers.get('cookie');
  if (cookie !== null) {
    if (cookie === '') {
      document.cookie.split(';').forEach((c) => {
        const [k, v] = c.split('=');
        const [namespace] = k.split('_');
        if (namespace === 'user') {
          document.cookie = k + '=' + v;
        }
        window.localStorage.set(k, v);
      });
    } else {
      cookie.split(';').forEach((c) => {
        document.cookie=c;
      });
    }
  }
}
