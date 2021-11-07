const pool = require("../../config/db");
class SectionService {
  constructor(pool) {
    this.queryDB = pool.query;
  }

  CREATE_SECTION_SQL = `INSERT INTO akp_section (fid,title,description,theme,akp_section.order,who) VALUES (?,?,?,?,?,?)`;
  UPDATE_SECTION_SQL = `UPDATE akp_section SET title = COALESCE(?,akp_section.title), description = COALESCE(?,akp_section.description), akp_section.order=COALESCE(?,akp_section.order), theme=COALESCE(?,akp_section.theme), last_edited = ? WHERE id = ?`;

  saveActionService({ id, title, description, theme, order }, fid, uid) {
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
  }
}

module.exports = SectionService;
