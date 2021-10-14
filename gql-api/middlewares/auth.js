const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const logs = require("../../engines/logs/log");

const IS_AUTHENTICATED = async (req, res, next) => {
  const { akp_auth_token } = req.cookies;
  let { auth_token } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const info = `accessing api `;
  let status = "";

  auth_token = auth_token ? auth_token : akp_auth_token;

  // console.log("auth token----->",auth_token)

  if (auth_token === null || auth_token === undefined) {
    status = `no auth token found`;
    logs.add_log(ip, endpoint, info, status);
    const resData = {
      err: [
        {
          code: "ER00001",
          message: "No token found",
        },
      ],
      data: [],
      messages: [],
    };
    return res.status(200).json(resData);
  }

  // console.log(auth_token,jwt_key);

  try {
    const { user_id } = await jwt.verify(auth_token, jwt_key);

    if (user_id === null || user_id === undefined) {
      status = `invalid auth token`;
      logs.add_log(ip, endpoint, info, status);
      const resData = {
        err: [
          {
            code: "ER00001",
            message: "Invalid token found",
          },
        ],
        data: [],
        messages: [],
      };
      return res.status(200).json(resData);
    }

    const sql = `SELECT * FROM users WHERE user_id=?`;
    pool.query(sql, [user_id], (err, result) => {
      if (err) {
        // console.log(err);
        status = `operation failed with an error : ${JSON.stringify(err)}`;
        logs.add_log(ip, endpoint, info, status);
        const resData = {
          err: [
            {
              code: "ER00002",
              message: err.message,
            },
          ],
          data: [],
          messages: [],
        };
        return res.status(200).json(resData);
      }
      if (result.length === 0) {
        status = `no user found with id : ${user_id}`;
        logs.add_log(ip, endpoint, info, status);
        const resData = {
          err: [
            {
              code: "ER00001",
              message: "No user found",
            },
          ],
          data: [],
          messages: [
            {
              type: "info",
              data: "Please sign-in or sign-up to continue!",
            },
          ],
        };
        return res.status(200).json(resData);
      }
      if (result[0].isverified === false) {
        status = `user in not authorized to sign-in with id : ${user_id}`;
        logs.add_log(ip, endpoint, info, status);

        const resData = {
          err: [
            {
              code: "ER00001",
              message: "Unauthorised user",
            },
          ],
          data: [],
          messages: [
            {
              type: "info",
              data: "You are not authorised to visit this site",
            },
          ],
        };
        return res.status(200).json(resData);
      }

      req.user = result[0];
      next();
    });
  } catch (error) {
    // console.log("is authenticated error",error)
    if (error.message === "invalid signature") {
      status = `operation failed with a message : ${error.message}`;
      logs.add_log(ip, endpoint, info, status);
      const resData = {
        err: [
          {
            code: "ER00000",
            message: error.message,
          },
        ],
        data: [],
        messages: [
          {
            type: "error",
            data: "Unknown error occured",
          },
          {
            type: "info",
            data: "Please try again later",
          },
        ],
      };
      return res.status(200).json(resData);
    }

    status = `operation failed with an error : ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    const resData = {
      err: [
        {
          code: "ER00000",
          message: error.message,
        },
      ],
      data: [],
      messages: [
        {
          type: "error",
          data: "Unknown error occured",
        },
        {
          type: "info",
          data: "Please try again later",
        },
      ],
    };
    return res.status(200).json(resData);
  }
};

module.exports = { IS_AUTHENTICATED };
