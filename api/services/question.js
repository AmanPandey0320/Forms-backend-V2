const pool = require("../../config/db");

class QuestionService {
  /**
   * SQL queries
   */
  SAVE_QUE_SQL = `INSERT INTO akp_question (fid,sid,who,akp_question.order) VALUES (?,?,?,?)`;
  UPDATE_QUE_SQL = `UPDATE akp_question SET title = COALESCE(?,akp_question.title), description = COALESCE(?,akp_question.description), akp_question.order = COALESCE(?,akp_question.order), akp_question.type = COALESCE(?,akp_question.type), akp_question.active = COALESCE(?,akp_question.active),required = COALESCE(?,akp_question.required),marks = COALESCE(?,akp_question.marks), last_edited = ? WHERE akp_question.id = ?`;
  GET_ONE_QUE_SQL = `SELECT aq.id,aq.title,aq.description,aq.order,aq.type,aq.when,aq.active,aq.last_edited,aq.required,aq.marks,aq.fid,aq.sid FROM akp_question as aq WHERE aq.id = ?`;
  GET_ALL_OPT_SQL = `SELECT ao.id,ao.title,ao.is_right,ao.marks,ao.when,ao.last_edited,ao.fid,ao.sid,ao.qid FROM akp_option AS ao WHERE ao.qid = ? AND ao.active = true`;
  SAVE_MULTIPLE_QUE = `INSERT INTO akp_question (fid,sid,type,title,who,akp_question.order) VALUES`;

  /**
   * @description save action for question controller
   * @public
   * @param {*} formData
   * @param {*} uid
   * @returns Promise
   */
  saveAction(formData, uid) {
    return new Promise(async (resolve, reject) => {
      const {
        fid,
        sid,
        id,
        title,
        description,
        order,
        type,
        active,
        required,
        marks,
      } = formData;

      // console.log("formData--->", formData);

      try {
        if (Boolean(id)) {
          /**
           * updaing question with id
           */
          const sql = this.UPDATE_QUE_SQL;
          const bind = [
            title,
            description,
            order,
            type,
            active,
            required,
            marks,
            new Date(),
            id,
          ];
          await pool.query(sql, bind);
          const question = await this.#populateAction(id);
          return resolve({ question, saved: true });
        } else {
          /**
           * creating new question
           */
          if (Boolean(fid) === false) {
            return reject({
              code: "FRM_BAD_DATA_FORMAT",
              message: "missing form id from data",
            });
          }
          if (Boolean(sid) === false) {
            return reject({
              code: "FRM_BAD_DATA_FORMAT",
              message: "missing section id from data",
            });
          }
          const sql = this.SAVE_QUE_SQL;
          const bind = [fid, sid, uid, order];
          const { insertId: id } = await pool.query(sql, bind);
          const question = await this.#populateAction(id);
          return resolve({ question, saved: true });
        }
      } catch (error) {
        console.log("question service save action error ----->", error);
        return reject(error);
      }
    });
  } // end of save action

  /**
   * @description
   * @private
   * @param {*} id
   */
  #populateAction(id) {
    return new Promise(async (resolve, reject) => {
      if (Boolean(id) === false) {
        reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "missing form id from data",
        });
        return;
      }
      try {
        const [question] = await pool.query(this.GET_ONE_QUE_SQL, [id]);
        const options = await pool.query(this.GET_ALL_OPT_SQL, [id]);
        resolve({ ...question, options });
        return;
      } catch (error) {
        console.log("populate error---->", error);
        reject(error);
        return;
      }
    });
  } //end of populate

  /**
   *
   * @param {*} questions
   * @param {*} uid
   * @returns
   */
  multiSaveAction(questions, uid) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = this.SAVE_MULTIPLE_QUE;
        let bind = [];
        questions.forEach((que) => {
          sql += `(?,?,?,?,?,?),`;
          bind = [
            ...bind,
            que.fid,
            que.sid,
            que.type,
            que.title,
            uid,
            que.order,
          ];
        });
        sql = sql.slice(0, -1);
        const { insertId: qid,...result } = await pool.query(sql, bind);
        // console.log("multi save res---->", result);
        resolve(qid);
        return;
      } catch (error) {
        console.log("multi save error---->", error);
        reject(error);
        return;
      }
    });
  }
} // end of class

module.exports = QuestionService;
