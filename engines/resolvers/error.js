
const error = {
  DEFAULT: {
    code: "ERR0000000",
    message: "Some error occured!",
    status: 200,
  },
  ER_DUP_ENTRY: {
    code: "ERR0000001",
    message: "Similar record already exist",
    status: 200,
  },
};

module.exports = error;