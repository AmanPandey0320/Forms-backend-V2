const pool = require("../../config/db");
const { v4 } = require("uuid");

const CREATE_FORM = async ({
  user_id,
  data,
  title,
  desc,
  theme,
  istest,
  duration,
  ans_key,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const form_id = v4();
      const updated_at = new Date();
      const sql = `INSERT INTO form (form_id,title,theme,description,data,user_id,updated_at,istest,duration,ans_key) VALUES (?,?,?,?,?,?,?,?,?,?)`;
      pool.query(
        sql,
        [
          form_id,
          title,
          theme,
          desc,
          JSON.stringify(data),
          user_id,
          updated_at,
          istest,
          duration,
          JSON.stringify(ans_key),
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({
              status: false,
              msg: err,
            });
          }

          if (
            result === undefined ||
            result.length === 0 ||
            result.affectedRows < 1
          ) {
            return reject({
              status: false,
              msg: {
                code: 500,
                message: "unable to fetch form creation data",
              },
            });
          }

          return resolve({
            status: true,
            msg: { form_id, user_id },
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

const GET_ALL_FORMS = async ({ user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT form.* FROM form JOIN users ON form.user_id = users.user_id WHERE users.isverified = true AND users.user_id = ?`;
      pool.query(sql, [user_id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: false,
            msg: err,
          });
        }

        if (result === undefined) {
          return reject({
            status: false,
            msg: {
              code: 500,
              message: "DB error : unable to fetch data",
            },
          });
        }

        let form,
          forms = [];

        result.forEach((element) => {
          form = element;
          form.data = JSON.parse(element.data);
          form.ans_key = JSON.parse(element.ans_key);
          forms.push(form);
        });

        return resolve({
          status: true,
          msg: { length: forms.length, result: forms },
        });
      });
    } catch (error) {
      console.log(error);
      return reject({
        status: false,
        msg: error,
      });
    }
  });
};

const GET_ONE_FORM = async ({ form_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM form WHERE form_id = ?`;
      pool.query(sql, [form_id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: false,
            msg: err,
          });
        }
        // console.log(result[0]);
        if (result === undefined || result.length === 0) {
          return reject({
            status: false,
            msg: {
              code: 500,
              message: "unable to fetch data",
            },
          });
        }

        let form,
          forms = [];

        result.forEach((element) => {
          form = element;
          form.data = JSON.parse(element.data);
          form.ans_key = JSON.parse(element.ans_key);
          forms.push(form);
        });

        return resolve({
          status: true,
          msg: { length: forms.length, result: forms },
        });
      });
    } catch (error) {
      console.log(error);
      return reject({
        status: false,
        msg: error,
      });
    }
  });
};

const DELETE_FORM = async (form_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `DELETE FROM form WHERE form_id = ?`;
      const result = await pool.query(sql, form_id);

      if (result.affectedRows < 1) {
        return reject({
          status: false,
          msg: {
            code: 500,
            message: "Unable to delete forms!",
          },
        });
      }

      return resolve({
        status: true,
        msg: {
          code: 200,
          message: "form deleted!",
        },
      });
    } catch (error) {
      console.log(err);
      return reject({
        status: false,
        msg: error,
      });
    }
  });
};

const UPDATE_FORM = async ({
  form_id,
  data,
  title,
  desc,
  theme,
  ans_key,
  istest,
  duration,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE form SET data = ?,title = ?,description = ?,theme = ?,updated_at = ?,ans_key = ?,istest = ?,duration = ? WHERE form_id = ?`;
      const updated_at = new Date();

      pool.query(
        sql,
        [
          JSON.stringify(data),
          title,
          desc,
          theme,
          updated_at,
          JSON.stringify(ans_key),
          istest,
          duration,
          form_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({
              status: false,
              msg: err,
            });
          }

          // console.log(result);

          if (result.affectedRows < 1) {
            return reject({
              status: false,
              msg: {
                code: 400,
                message: "unable to update the form",
              },
            });
          }

          return resolve({
            status: true,
            msg: {
              code: 200,
              message: "form updated",
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

/**
 * @description created a form with template_id for a user
 * @param {*} tid <- template id
 * @param {*} uid <- user id
 * @returns
 */
const CREATE_FROM_TEMPLATE_S = (tid, uid) => {
  return new Promise((resolve, reject) => {
    const sql = `CALL createFromTemplate(?,?)`;
    const bind = [tid, uid];
    pool.query(sql, bind, (error, result) => {
      if (error) {
        return reject(error);
      }
      const [procedureRes, insertRes] = result;
      if (procedureRes.length === 0 || Boolean(insertRes) === false) {
        return reject({
          code: "FRM_NO_DATA_AVAILABLE",
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
    });
  });
};

module.exports = {
  CREATE_FORM,
  GET_ALL_FORMS,
  GET_ONE_FORM,
  DELETE_FORM,
  UPDATE_FORM,
  CREATE_FROM_TEMPLATE_S,
};
