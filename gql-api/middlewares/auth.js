const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const logs = require("../../api/services/logs");
const utils = require("util");
const pool = require("../../config/db");

pool.query = utils.promisify(pool.query);

const IS_AUTHENTICATED = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const info = `accessing gql api `;
  let status = " ";

  const authHeader = req.headers.authorization;

  try {
    if (
      authHeader === undefined ||
      authHeader === null ||
      authHeader.trim().length === 0
    ) {
      throw new Error("no token provided");
    }

    const [, token] = authHeader.split(" ");

    if (token === undefined) {
      throw new Error("no token found!!!");
    }

    const { user_id } = await jwt.verify(token, JWT_KEY);
    const SQL = `SELECT * FROM users WHERE user_id = ?`;

    const queryRes = await pool.query(SQL, [user_id]);

    if (queryRes.length == 0) {
      //user not found
      throw new Error("user does not exist!!!");
    } else {
      //user found
      (status = "user found, authorised access"), next();
    }
  } catch (error) {
    status = error.message;
    res.status(401).json({
      ...error,
      status,
      ok: false,
    });
  } finally {
    logs.add_log(ip, endpoint, info, status);
  }
};

module.exports = {
  IS_AUTHENTICATED,
};
