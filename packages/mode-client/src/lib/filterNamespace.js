export default function filterNamespace(namespace) {
  const ans = {};
  Object.keys(namespace).forEach((k) => {
    if (k !== 'expires') {
      ans[k] = namespace[k];
    }
  });
  return ans;
}
