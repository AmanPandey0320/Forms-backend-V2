const pool = require("../../config/db");

class FormService {
  /**
   * SQL queries
   */
  CREATE_FORM_SQL = `INSERT INTO akp_forms (title,theme,description,who) VALUES (?,?,?,?)`;
  UPDATE_FORM_SQL = `UPDATE akp_forms SET title = COALESCE(?,akp_forms.title), description = COALESCE(?,akp_forms.description),theme = COALESCE(?,akp_forms.theme), active = COALESCE(?,akp_forms.active), edit = COALESCE(?,akp_forms.edit), send = COALESCE(?,akp_forms.send), akp_forms.last_edited = ? WHERE akp_forms.id = ?`;
  GET_ALL_FORMS_SQL = `SELECT af.id,af.title,af.theme,af.last_edited FROM akp_forms as af JOIN users ON af.who = users.user_id WHERE users.isverified = true AND users.user_id = ?`;
  GET_ONE_FORM_SQL = `SELECT af.id,af.title,af.description,af.last_edited,af.active,af.send,af.edit,af.when,af.theme,users.name FROM akp_forms as af JOIN users ON users.user_id = af.who WHERE af.id = ?`;
  GET_ALL_SEC_SQL = `SELECT asec.id,asec.title,asec.description,asec.order,asec.theme,asec.last_edited,asec.when FROM akp_section as asec WHERE asec.fid = ? AND asec.active = true`;
  GET_ALL_QUE_SQL = `SELECT aq.id,aq.title,aq.description,aq.order,aq.type,aq.when,aq.active,aq.last_edited,aq.required,aq.marks,aq.sid FROM akp_question as aq WHERE aq.fid = ? AND aq.active = true`;
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
            console.log("form service save action error db--->", error);
            return reject(error);
          }
          let { insertId } = result;
          if (Boolean(id)) {
            insertId = id;
          }
          return resolve(insertId);
        });
      } catch (error) {
        console.log("form service save action error----->", error);
        return reject(error);
      }
    });
  } // end of save action

  /**
   * @description return list of forms by a user
   * @param {*} uid
   * @returns
   */
  listAction(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = this.GET_ALL_FORMS_SQL;
        const bind = [uid];
        const result = await pool.query(sql, bind);
        console.log(result);
        const res = result.map((sec) => {
          return {
            ...sec,
            theme: JSON.parse(sec.theme),
          };
        });
        return resolve(res);
      } catch (error) {
        console.log("form service list action error----->", error);
        return reject(error);
      }
    });
  } // end of list action

  /**
   *
   * @param {*} fid
   * @returns
   */
  populateAction(fid) {
    return new Promise(async (resolve, reject) => {
      if (Boolean(fid) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "invalid form",
        });
      }
      try {
        const bind = [fid];
        const [form] = await pool.query(this.GET_ONE_FORM_SQL, bind);
        const secs = await pool.query(this.GET_ALL_SEC_SQL, bind);
        const ques = await pool.query(this.GET_ALL_QUE_SQL, bind);
        const sections = secs.map((sec) => {
          const questions = ques.filter((que) => que.sid === sec.id);
          return {
            ...sec,
            questions,
            theme: JSON.parse(form.theme),
          };
        });
        const res = {
          ...form,
          sections,
          theme: JSON.parse(form.theme),
        };
        return resolve(res);
        // pool.query(sql, bind, (error, result) => {
        //   if (error) {
        //     console.log("form service populate action error----->", error);
        //     return reject(error);
        //   }
        //   // console.log("form populate action res----->", result);
        //   if (result.length === 0) {
        //     return reject({
        //       code: "FRM_NO_DATA_AVAILABLE",
        //       message: "no data was found, array was empty!",
        //     });
        //   }
        //   const [form] = result;
        //   const res = {
        //     ...form,
        //     theme: JSON.parse(form.theme),
        //   };

        //   return resolve(res);
        // });
      } catch (error) {
        console.log("form service population action error----->", error);
        return reject(error);
      }
    });
  }
} // end of class

module.exports = FormService;
