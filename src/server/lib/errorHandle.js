export default function errorHandle(requestListener) {
  if (typeof requestListener !== 'function') {
    throw new Error('[Error] The parameter request listener needs to be of function type.');
  }
  return async (req, res) => {
    try {
      await requestListener(req, res);
    } catch (error) {
      res.writeHead(500);
      res.end();
    }
  }
}
