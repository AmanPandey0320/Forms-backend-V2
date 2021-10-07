const errorCode = require('./error')


/**
 * @description function to resolve errors into messages
 * @param {*} error 
 * @returns 
 */
const resolveError = (error) => {
  const { code, message } = error;
  if (code && message) {
    return errorCode[code];
  } else {
    return errorCode["DEFAULT"];
  }
};

module.exports = { resolveError };
