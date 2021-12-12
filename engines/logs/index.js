const pool = require("../../config/db");

const add_log = async (ip, endpoint, info, status="unknown") => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO logs (info,ip,endpoint,status,timestamp) VALUES (?,?,?,?,?)`;
      pool.query(
        sql,
        [info, ip, endpoint, status, new Date()],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({
              status: false,
              msg: err,
            });
          }
          // console.log(result);
          if (
            result === undefined ||
            result.length === 0 ||
            result.affectedRows != 1
          ) {
            return reject({
              status: false,
              msg: {
                code: 500,
                message: "DB error, unable to log data",
              },
            });
          }

          return resolve({
            status: true,
            msg: {
              code: 200,
              message: "Log added successfully",
            },
          });
        }
      );
    } catch (error) {
      console.log(error);
      return reject({
        status: false,
        msg: error,
      });
    }
  });
};

const get_log = async () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM logs ORDER BY timestamp DESC`;
      pool.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: false,
            msg: err.message,
          });
        }
        return resolve({
          status: true,
          msg: result,
        });
      });
    } catch (error) {
      console.log(error);
      return reject({
        status: false,
        msg: error.message,
      });
    }
  });
};

module.exports = { add_log, get_log };
