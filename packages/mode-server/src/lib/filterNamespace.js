export default function filterNamespace(namespace) {
  const ans = {};
  if (typeof namespace === 'object') {
    Object.keys(namespace).forEach((k) => {
      if (k !== 'expires') {
        ans[k] = namespace[k];
      }
    });
  }
  return ans;
}
