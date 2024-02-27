import readCookie from '~/lib/readCookie';

export default function clearCookie(namespaces) {
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
