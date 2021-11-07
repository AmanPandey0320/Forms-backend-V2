const pool = require("../../config/db");
class SectionService {
  constructor(pool) {
    this.queryDB = pool.query;
  }

  CREATE_SECTION_SQL = `INSERT INTO akp_section (fid,title,description,theme,akp_section.order,who) VALUES (?,?,?,?,?,?)`;
  UPDATE_SECTION_SQL = `UPDATE akp_section SET title = COALESCE(?,akp_section.title), description = COALESCE(?,akp_section.description), akp_section.order=COALESCE(?,akp_section.order), theme=COALESCE(?,akp_section.theme), last_edited = ? WHERE id = ?`;
  DELETE_SECTION_SQL = `UPDATE akp_section SET akp_section.active = false WHERE id = ?`;
  ACTIVE_SECTION_SQL = `UPDATE akp_section SET akp_section.active = true WHERE id = ?`;

  /**
   * @description handles section save
   * @param {*} section_details
   * @param {*} fid
   * @param {*} uid
   * @returns
   */
  saveAction({ id, title, description, theme, order }, fid, uid) {
    return new Promise((resolve, reject) => {
      if (Boolean(fid) === false) {
        return reject({
          code: "FRM_NO_KEY",
        });
      }

      let sql = "",
        bind = [];
      let last_edited = new Date();

      if (theme) {
        theme = JSON.stringify(theme);
      }

      if (Boolean(id)) {
        sql = this.UPDATE_SECTION_SQL;
        bind = [title, description, order, theme, last_edited, id];
      } else {
        sql = this.CREATE_SECTION_SQL;
        bind = [fid, title, description, theme, order, uid];
      }

      /**
       * running sql query
       * pushing to DB
       */
      try {
        pool.query(sql, bind, (error, result) => {
          if (error) {
            console.log("section service error----->", error);
            return reject(error);
          }
          const { insertId } = result;
          return resolve(insertId);
        });
      } catch (error) {
        console.log("section service error----->", error);
        return reject(error);
      }
    });
  } // end of save action

  /**
   * @description deletes the section
   * @description sets active = false
   * @param {*} id
   * @returns
   */
  deleteAction(id) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * check if section id is present
         */
        if (Boolean(id) === false) {
          return reject({
            code: "FRM_BAD_DATA_FORMAT",
          });
        }

        const sql = this.DELETE_SECTION_SQL;
        const bind = [id];

        pool.query(sql, bind, (error, result) => {
          if (error) {
            console.log("delete action section err1 ---->", error);
            return reject(error);
          }
          console.log("delete action section res---->", result);
          return resolve({ id, active: 0 });
        });
      } catch (error) {
        console.log("delete action section err2 ---->", error);
        return reject(error);
      }
    });
  } // end of delete action
}

module.exports = SectionService;
