export default function readCookie(cookie) {
  const cookies = {};
  if (typeof cookie === 'string') {
    cookie.split(';').forEach((i) => {
      const [key, value] = i.split('=');
      cookies[key.trim()] = value;
    });
  }
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
  return namespaces;
}
