const { v4 } = require("uuid");
const query = require("../../database/Query/sessions");
const pool = require("../../config/db");
const { queryDB } = require("../../config");

/**
 * @description creates new session
 * @param {*} id
 * @param {*} isAdmin
 * @returns
 */
const createSession = async (id, isAdmin, ip) => {
  return new Promise((resolve, reject) => {
    const sid = `${isAdmin ? "ADM_" : "USR_"}${v4()}`;
    const last_login = new Date();
    const sql = query.CREATE_SESSION;
    const bind = [sid, id, last_login, ip, ip];
    try {
      pool.query(sql, bind, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(sid);
      });
    } catch (error) {
      console.log("create sessiom err ---->", error);
      return reject(error);
    }
  });
};

/**
 * @description destroy current session by sid
 * @param {*} sid
 * @returns promise
 */
const destroySession = async (sid) => {
  return new Promise((resolve, reject) => {
    const logout_time = new Date();
    const sql = query.DESTROY_SESSION;
    const bind = [false, logout_time, sid];

    pool.query(sql, bind, (err, result) => {
      if (err) {
        console.log("destroy sesion----->", err);
        return reject(err);
      }
      return resolve({
        ok: true,
        message: ["session deactivated"],
      });
    });
  });
};

/**
 * @description function to refresh token
 * @param {*} sid
 * @param {*} ip
 * @returns promise
 */
const refreshSession = async (sid, ip) => {
  return new Promise(async (resolve, reject) => {
    const last_login = new Date();
    const sql = query.REFRESH_SESSION;
    const bind = [last_login, ip, sid];
    pool.query(sql, bind, (err, result) => {
      if (err) {
        console.log("refresh sesion----->", err);
        return reject(err);
      }
      return resolve({
        ok: true,
        message: ["session refreshed"],
      });
    });
  });
};

module.exports = { createSession, destroySession, refreshSession };
