export default async function discHndl(disc, process) {
  if (typeof disc !== 'boolean') {
    throw new Error('[Error] The parameter whether to connect needs to be of booean type.');
  }
  if (typeof process !== 'function') {
    throw new Error('[Error] Parameter handling should be function type.');
  }
  if (disc === false) {
    await process();
  }
}
