const pool = require("../config/db");
const { v4 } = require("uuid");
const logs = require("../api/services/logs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const salt_rounds = parseInt(process.env.salt_rounds || 10);
const resolvers = require("../engines/resolvers/index");
const query = require("../database/Query/admin");

/**
 * @controller for admin logon
 * @param {*} req
 * @param {*} res
 * @returns
 */
const ADMIN_LOGIN = async (req, res) => {
  const { username, password } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  try {
    const sql = `SELECT admin_id,password,enabled,issuper FROM admin WHERE username = ?`;
    const bind = [username];
    pool.query(sql, bind, async (error, result) => {
      if (error) {
        console.log(error);
        logs.add_log(ip, endpoint, `creating admin ${username}`, error.message);
        return res.send({
          ok: false,
          message: error.message,
        });
      }

      if (result.length === 0) {
        logs.add_log(
          ip,
          endpoint,
          `loggin by ${username}`,
          "no user found with such username"
        );
        return res.send({
          ok: false,
          message: "no user found with such username",
        });
      }

      const auth = await bcrypt.compare(password, result[0].password);

      // console.log(result[0].admin_id);

      if (auth) {
        if (result[0].enabled) {
          const token = await jwt.sign(
            { admin_id: result[0].admin_id },
            jwt_key
          );
          logs.add_log(
            ip,
            endpoint,
            `logged in admin ${result[0].admin_id}`,
            "logged in"
          );
          return res.send({
            ok: true,
            auth_token: token,
          });
        } else {
          logs.add_log(
            ip,
            endpoint,
            `loggin by ${username}`,
            "logged in unsuccessfull"
          );
          return res.send({
            ok: false,
            message: "this admin in disabled! contact support",
          });
        }
      } else {
        logs.add_log(
          ip,
          endpoint,
          `loggin by ${username}`,
          "logged in unsuccessfull"
        );
        return res.send({
          ok: false,
          message: "unauthorised",
        });
      }
    });
  } catch (error) {
    console.log(error);
    logs.add_log(ip, endpoint, `creating admin ${username}`, error.message);
    return res.send({
      ok: false,
      message: error.message,
    });
  }
};

/**
 * @controller for creating admin
 * @param {*} req
 * @param {*} res
 * @returns
 */
const ADMIN_CREATE = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { username, password, email: email_id } = req.body;
  try {
    const admin_id = v4();
    const password_hash = await bcrypt.hash(password, salt_rounds);
    const issuper = false;
    const enabled = true;

    const sql = `INSERT INTO admin (admin_id,username,issuper,email_id,password,enabled) VALUES (?,?,?,?,?,?)`;
    const bind = [
      admin_id,
      username,
      issuper,
      email_id,
      password_hash,
      enabled,
    ];
    await pool.query(sql, bind);

    logs.add_log(ip, endpoint, `creating admin ${username}`, "admin created");

    return res.status(200).send({
      ok: true,
      message: "admin created!",
    });
  } catch (error) {
    // console.log(error.code, "->", error.message);
    logs.add_log(ip, endpoint, `creating admin ${username}`, error.message);
    const { status, ...data } = resolvers.resolveError(error);
    return res.status(status).send(data);
  }
};

/**
 * @controller for admin update password and email id
 * @param {*} req
 * @param {*} res
 */
const ADMIN_UPDATE = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { username, password } = req.body;
  const { admin_id } = req.adminuser;
  try {
    const password_hash = password
      ? await bcrypt.hash(password, salt_rounds)
      : undefined;
    const sql = query.UPDATE_ADMIN;
    const bind = [username, password_hash, admin_id];
    await pool.query(sql, bind);
    logs.add_log(ip, endpoint, `updating admin ${username}`, "admin updated");
    res.send({
      ok: true,
      message: "updated successfully!",
    });
  } catch (error) {
    logs.add_log(ip, endpoint, `updating admin ${username}`, error.message);
    const { status, ...data } = resolvers.resolveError(error);
    return res.status(status).send(data);
  }
};

/**
 * @controller for toggle admin enable/disable
 * @param {*} req
 * @param {*} res
 */
const ADMIN_TOGGLE = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { enabled,admin_id } = req.body;
  const info = enabled
    ? `admin with id ${admin_id} -> enabling`
    : `admin with id ${admin_id} -> disabling`;
  const logRes = enabled ? `admin enabled` : `admin disabled`;

  try {
    const sql = query.TOGGLE_ADMIN;
    const bind = [enabled, admin_id];
    await pool.query(sql, bind);
    logs.add_log(ip, endpoint, info, logRes);
    res.send({
      ok: true,
      message: enabled ? "enabled" : "disabled",
    });
  } catch (error) {
    console.log("toggle err--->",error.message);
    logs.add_log(ip, endpoint, info, error.message);
    const { status, ...data } = resolvers.resolveError(error);
    return res.status(status).send(data);
  }
};

module.exports = { ADMIN_LOGIN, ADMIN_CREATE, ADMIN_UPDATE, ADMIN_TOGGLE };
