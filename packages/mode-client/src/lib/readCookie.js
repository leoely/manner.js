import clearCookie from '~/lib/clearCookie';

export default function readCookie() {
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
