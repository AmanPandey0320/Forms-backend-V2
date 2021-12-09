const pool = require("../../config/db");
const { firestore } = require("../../engines/cloud/firebase");

class FormService {
  /**
   * SQL queries
   */
  CREATE_FORM_SQL = `INSERT INTO akp_forms (theme,who) VALUES (?,?)`;
  UPDATE_FORM_SQL = `UPDATE akp_forms SET title = COALESCE(?,akp_forms.title), description = COALESCE(?,akp_forms.description),theme = COALESCE(?,akp_forms.theme), active = COALESCE(?,akp_forms.active), edit = COALESCE(?,akp_forms.edit), send = COALESCE(?,akp_forms.send), akp_forms.last_edited = ? WHERE akp_forms.id = ?`;
  GET_ALL_FORMS_SQL = `SELECT af.id,af.title,af.theme,af.last_edited FROM akp_forms as af JOIN users ON af.who = users.user_id WHERE users.isverified = true AND users.user_id = ?`;
  GET_ONE_FORM_SQL = `SELECT af.id,af.title,af.description,af.last_edited,af.active,af.send,af.edit,af.when,af.theme,users.name FROM akp_forms as af JOIN users ON users.user_id = af.who WHERE af.id = ?`;
  GET_ALL_SEC_SQL = `SELECT asec.id,asec.title,asec.description,asec.order,asec.theme,asec.last_edited,asec.when,asec.fid FROM akp_section as asec WHERE asec.fid = ? AND asec.active = true`;
  GET_ALL_QUE_SQL = `SELECT aq.id,aq.title,aq.description,aq.order,aq.type,aq.when,aq.active,aq.last_edited,aq.required,aq.marks,aq.fid,aq.sid FROM akp_question as aq WHERE aq.fid = ? AND aq.active = true ORDER BY aq.order`;
  GET_ALL_OPT_SQL = `SELECT ao.id,ao.title,ao.is_right,ao.marks,ao.when,ao.last_edited,ao.fid,ao.sid,ao.qid FROM akp_option AS ao WHERE ao.fid = ? AND ao.active = true`;
  CREATE_FROM_TEMPLATE_SQL = `CALL createFromTemplate(?,?)`;
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
      } else {
        theme = `{"bgColor":"#99d3ff","color":"#1f9eff","header":null}`;
      }
      let sql = "";
      let bind = [];
      if (Boolean(id)) {
        sql = this.UPDATE_FORM_SQL;
        bind = [title, description, theme, active, edit, send, new Date(), id];
      } else {
        sql = this.CREATE_FORM_SQL;
        bind = [theme, user_id];
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
        // console.log(result);
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
        const opts = await pool.query(this.GET_ALL_OPT_SQL, bind);
        const sections = secs.map((sec) => {
          const questions = ques
            .filter((que) => que.sid === sec.id)
            .map((que) => {
              const options = opts.filter((opt) => opt.qid === que.id);
              return {
                ...que,
                options,
              };
            });
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
      } catch (error) {
        console.log("form service population action error----->", error);
        return reject(error);
      }
    });
  } // end of populateAction

  /**
   * @description created form from template
   * @param {*} tid
   * @param {*} uid
   * @returns
   */
  createFromTemplate(tid, uid) {
    return new Promise(async (resolve, reject) => {
      if ((Boolean(tid) && Boolean(uid)) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "invalid form",
        });
      }
      try {
        const bind = [tid, uid];
        const result = await pool.query(this.CREATE_FROM_TEMPLATE_SQL, bind);
        const [procedureRes, insertRes] = result;
        if (procedureRes.length === 0 || Boolean(insertRes) === false) {
          return reject({
            code: "FRM_NO_DATA_AVAILABLE",
            message: "no data availanle for precedure",
          });
        }
        const [res] = procedureRes;
        const data = JSON.parse(res["@data"]);
        const description = res["@description"];
        const theme = JSON.parse(res["@theme"]);
        const id = res["@id"];
        const title = res["@title"];
        return resolve({
          id,
          title,
          description,
          theme,
          data,
        });
      } catch (error) {
        console.log("form service create from template error----->", error);
        return reject(error);
      }
    });
  } // end of create from template

  /**
   *
   * @param {*} fid
   * @param {*} uid
   * @returns
   */
  inViewPopulateAction(fid, uid) {
    return new Promise(async (resolve, reject) => {
      if (Boolean(fid) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "missing form fid from data",
        });
      }
      if (Boolean(uid) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "missing form uid from data",
        });
      }
      try {
        let form = await this.populateAction(fid);
        const formRef = firestore.collection("form").doc(`${fid}`);
        const sentFormRef = formRef.collection("sent_forms").doc(`${uid}`);
        const docRef = formRef.collection("responces").doc(`${uid}`);
        const snapshot = await docRef.get();
        const allowed = !snapshot.exists;
        if (allowed) {
          let updateData = {};
          updateData[uid] = true;
          // console.log(form, JSON.parse(JSON.stringify(form)));
          sentFormRef.set({ form: JSON.parse(JSON.stringify(form)) });
        } else {
          let updateData = { accepting: true };
          updateData[uid] = true;
          const formSnapshot = await sentFormRef.get();
          form = formSnapshot.data();
          form = form.form;
        }
        const response = snapshot.data();
        resolve({ form, response, allowed });
      } catch (error) {
        console.log("form service nViewPopulateAction error----->", error);
        return reject(error);
      }
    });
  }
} // end of class

module.exports = FormService;
