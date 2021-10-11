const { v4 } = require("uuid");
const query = require("../../database/Query/sessions");
const pool = require("../../config/db");

/**
 * @description creates new session
 * @param {*} id 
 * @param {*} isAdmin 
 * @returns 
 */
const createSession = async (id, isAdmin) => {
  return new Promise((resolve, reject) => {
    const sid = `${isAdmin ? "ADM_" : "USR_"}${v4()}`;
    const last_login = new Date();
    const sql = query.CREATE_SESSION;
    const bind = [sid, id, last_login];
    try {
      pool.query(sql, bind, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(sid);
      });
    } catch (error) {
      console.log("create sessiom err ---->",error)
      return reject(error);
    }
  });
};

/**
 * @description destroy current session by sid
 * @param {*} sid 
 * @returns 
 */
const destroySession = async (sid) => {
    return new Promise((resolve,reject) => {
        const logout_time = Date.now();
        const sql = query.DESTROY_SESSION;
        const bind = [false,logout_time,sid];

        pool.query(sql,bind,(err,result) => {
            if(err){
                return reject({
                    ok:false,
                    message:err.message
                });
            }
            return resolve({
                ok:true,
                message:["session deactivated"],
            });
        });
    });
};

module.exports = { createSession,destroySession };
