const pool = require("../../config/db");

class FormService {
  /**
   * SQL queries
   */
  CREATE_FORM_SQL = `INSERT INTO akp_forms (title,theme,description,who) VALUES (?,?,?,?)`;
  UPDATE_FORM_SQL = `UPDATE akp_forms SET title = COALESCE(?,akp_forms.title), description = COALESCE(?,akp_forms.description),theme = COALESCE(?,akp_forms.theme), active = COALESCE(?,akp_forms.active), edit = COALESCE(?,akp_forms.edit), send = COALESCE(?,akp_forms.send), akp_forms.when = ? WHERE akp_forms.id = ?`;
  GET_ALL_FORMS_SQL = `SELECT af.* FROM akp_forms as af JOIN users ON af.who = users.user_id WHERE users.isverified = true AND users.user_id = ? AND af.active = true`;

  /**
   * @description saves/updates the form
   * @param {*} formData
   * @returns Promise
   */
  saveAction(formData) {
    return new Promise(async (resolve, reject) => {
      let { id, title, theme, description, user_id, edit, send, active } =
        formData;
      if (theme) {
        theme = JSON.stringify(theme);
      }
      let sql = "";
      let bind = [];
      if (Boolean(id)) {
        sql = this.UPDATE_FORM_SQL;
        bind = [title, description, theme, active, edit, send, new Date(), id];
      } else {
        sql = this.CREATE_FORM_SQL;
        bind = [title, theme, description, user_id];
      }
      try {
        pool.query(sql, bind, (error, result) => {
          if (error) {
            console.log("form service create form error db--->", error);
            return reject(error);
          }
          let { insertId } = result;
          if (Boolean(id)) {
            insertId = id;
          }
          return resolve(insertId);
        });
      } catch (error) {
        console.log("form service create form error----->", error);
        return reject(error);
      }
    });
  };// end of save action
} // end of class

module.exports = FormService;
