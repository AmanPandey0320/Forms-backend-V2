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
  ER_BAD_FIELD_ERROR:{
    code:"ERR0000002",
    message:"Server error! Please try again later.",
    status:500
  }
};

module.exports = error;