const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const logs = require("../services/logs");

const IS_AUTHENTICATED = async (req, res, next) => {
  const { auth_token } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const info = `accessing api `;
  let status = "";

  if (auth_token === null || auth_token === undefined) {
    status = `no auth token found`;
    logs.add_log(ip, endpoint, info, status);
    return res.sendStatus(401);
  }

  // console.log(auth_token,jwt_key);

  try {
    const { user_id } = await jwt.verify(auth_token, jwt_key);

    if (user_id === null || user_id === undefined) {
      status = `invalid auth token`;
      logs.add_log(ip, endpoint, info, status);
      return res.sendStatus(400);
    }

    const sql = `SELECT * FROM users WHERE user_id=?`;
    pool.query(sql, [user_id], (err, result) => {
      if (err) {
        console.log(err);
        status = `operation failed with an error : ${JSON.stringify(err)}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(404);
      }
      if (result.length === 0) {
        status = `no user found with id : ${user_id}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(401);
      }
      if (result[0].isverified === false) {
        status = `user in not authorized to sign-in with id : ${user_id}`;
        logs.add_log(ip, endpoint, info, status);

        return res.sendStatus(401);
      }

      req.user = result[0];
      next();
    });
  } catch (error) {
    if (error.message === "invalid signature") {
      status = `operation failed with a message : ${error.message}`;
      logs.add_log(ip, endpoint, info, status);
      return res.sendStatus(400);
    }

    status = `operation failed with an error : ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    return res.sendStatus(500);
  }
};

module.exports = { IS_AUTHENTICATED };
