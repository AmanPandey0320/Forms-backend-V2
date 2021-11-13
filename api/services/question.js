const pool = require("../../config/db");

class QuestionService {
  /**
   * SQL queries
   */
  SAVE_QUE_SQL = `INSERT INTO akp_question (fid,sid,who) VALUES (?,?,?)`;
  UPDATE_QUE_SQL = `UPDATE akp_question SET title = COALESCE(?,akp_question.title), description = COALESCE(?,akp_question.description), akp_question.order = COALESCE(?,akp_question.order), akp_question.type = COALESCE(?,akp_question.type), akp_question.active = COALESCE(?,akp_question.active),required = COALESCE(?,akp_question.required),marks = COALESCE(?,akp_question.marks), last_edited = ? WHERE akp_question.id = ?`;

  /**
   * @description save action for question controller
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
          pool.query(sql, bind, (error, result) => {
            if (error) {
              console.log(
                "question service save action update db error---->",
                error
              );
              return reject(error);
            }
            return resolve({ id, saved: true });
          });
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
          const bind = [fid, sid, uid];
          pool.query(sql, bind, (error, result) => {
            if (error) {
              console.log("question service save action db err---->", error);
              return reject(error);
            }
            const { insertId: id } = result;
            return resolve({ id, saved: true });
          });
        }
      } catch (error) {
        console.log("question service save action error ----->", error);
        return reject(error);
      }
    });
  } // end of save action
} // end of class

module.exports = QuestionService;
