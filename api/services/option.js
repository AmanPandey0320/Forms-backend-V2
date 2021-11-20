const pool = require("../../config/db");

class OptionService {
  /**
   * SQL queries
   */
  CREATE_OPTION_SQL = `INSERT INTO akp_option (fid,sid,qid,who) VALUES (?,?,?,?)`;
  UPDATE_OPTION_SQL = `UPDATE akp_option SET title = COALESCE(?,akp_option.title), is_right = COALESCE(?,akp_option.is_right), marks = COALESCE(?,akp_option.marks), akp_option.active = COALESCE(?,akp_option.active), last_edited = ? WHERE akp_option.id = ? `;
  GET_ONE_OPTION_SQL = `SELECT ao.id,ao.title,ao.is_right,ao.marks,ao.when,ao.last_edited,ao.fid,ao.sid,ao.qid FROM akp_option AS ao WHERE ao.id = ?`;

  /**
   * @description saves the option
   * @param {*} formData
   * @param {*} uid
   * @returns
   */
  saveAction(formData, uid) {
    return new Promise(async (resolve, reject) => {
      const { id, qid, sid, fid, title, is_right, marks, active } = formData;
      if (Boolean(id)) {
        /**
         * update option
         */
        try {
          await pool.query(this.UPDATE_OPTION_SQL, [
            title,
            is_right,
            marks,
            active,
            new Date(),
            id,
          ]);
          const option = await this.#populateAction(id);
          if (Boolean(option) === false) {
            reject({ code: "FRM_NO_RECORD" });
            return;
          }
          return resolve({ ...option, saved: true });
        } catch (error) {
          console.log("option service save action error 2 ---->", error);
          return reject(error);
        }
      } else {
        /**
         * create new option
         */
        if (Boolean(fid) === false) {
          return reject({
            code: "FRM_BAD_DATA_FORMAT",
            message: "no form id",
          });
        }
        if (Boolean(sid) === false) {
          return reject({
            code: "FRM_BAD_DATA_FORMAT",
            message: "no section id",
          });
        }
        if (Boolean(qid) === false) {
          return reject({
            code: "FRM_BAD_DATA_FORMAT",
            message: "no question id",
          });
        }
        /**
         * quering DB
         */
        try {
          const { insertId, ...result } = await pool.query(
            this.CREATE_OPTION_SQL,
            [fid, sid, qid, uid]
          );
          const option = await this.#populateAction(insertId);
          if (Boolean(option) === false) {
            reject({ code: "FRM_NO_RECORD" });
            return;
          }
          return resolve({ ...option, saved: true });
        } catch (error) {
          console.log("option service save action error 1 ---->", error);
          return reject(error);
        }
      }
    });
  } //end of saveAction
  #populateAction(id) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Boolean(id) === false) {
          reject({
            code: "FRM_BAD_DATA_FORMAT",
            message: "missing form id from data",
          });
          return;
        }
        const [result] = await pool.query(this.GET_ONE_OPTION_SQL, [id]);
        resolve(result);
      } catch (error) {
        console.log("option service populate action error ---->", error);
        return reject(error);
      }
    });
  } // end of the populate action
}

module.exports = OptionService;
