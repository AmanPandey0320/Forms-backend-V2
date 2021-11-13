const errorCode = require("./error");

/**
 * @description function to resolve errors into messages
 * @param {*} error
 * @returns
 */
const resolveError = (error) => {
  const { code } = error;
  if (code && errorCode[code]) {
    return errorCode[code];
  } else {
    return errorCode["DEFAULT"];
  }
};

module.exports = { resolveError };
