export default async function disconnectHandle(isDisconnect, process) {
  if (typeof isDisconnect !== 'boolean') {
    throw new Error('[Error] The parameter whether to connect needs to be of booean type.');
  }
  if (typeof process !== 'function') {
    throw new Error('[Error] Parameter handling should be function type.');
  }
  if (isDisconnect === false) {
    await process();
  }
}
