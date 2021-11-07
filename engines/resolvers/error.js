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
  ER_BAD_FIELD_ERROR: {
    code: "ERR0000002",
    message: "Server error! Please try again later.",
    status: 500,
  },
  FRM_NO_RECORD: {
    code: "ERR0000003",
    message: "No record found",
    status: 200,
  },
  FRM_INVALID_SESSION: {
    code: "ERR0000004",
    message: "Session timeout! Please login again!",
    status: 401,
  },
  ER_TRUNCATED_WRONG_VALUE: {
    code: "ERR0000005",
    message: "Server error! Please try again later.",
    status: 500,
  },
  FRM_NO_DATA_AVAILABLE: {
    code: "ERR0000006",
    message: "Unable to fetch data!",
    status: 500,
  },
  FRM_BAD_DATA_FORMAT: {
    code: "ERR0000007",
    message: "Some data is missing",
    status: 400,
  },
};

module.exports = error;
