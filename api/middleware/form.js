const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const logs = require("../services/logs");

const IS_FORM_TO_USER = async (req, res, next) => {
  const { form_id, auth_token } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = await jwt.verify(auth_token, process.env.JWT_KEY);
  const info = `deleting forms with form_id : ${form_id} for user with user_id ${user_id}`;
  let status = "";

  try {
    const sql = `SELECT * FROM form WHERE form_id = ?`;
    const { user_id } = await jwt.verify(auth_token, jwt_key);

    pool.query(sql, [form_id], (error, result) => {
      if (error) {
        console.log(error);
        status = `operation failed with an error : ${JSON.stringify(error)}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(500);
      }

      const form = result[0];
      if (form === undefined || form.form_id === undefined) {
        status = `form with id ${form_id} does not exists`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(404);
      }

      if (form.user_id != user_id) {
        status = `unauthorized access to form : ${form_id} belonging to user : ${form.user_id} by user ${user_id}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(401);
      }

      req.formData = form;
      next();
    });
  } catch (error) {
    console.log(error);
    status = `operation failed with an error : ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    return res.sendStatus(500);
  }
};

const IS_FORM_VALID = async (req, res, next) => {
  const { form_id } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `submiting forms with form_id : ${form_id} for user with user_id ${user_id}`;
  let status = "";

  try {
    const sql = `SELECT * FROM form WHERE form_id = ?`;
    pool.query(sql, [form_id], (err, result) => {
      if (err) {
        console.log(err);
        status = `operation failed with an error : ${JSON.stringify(
          err
        )} for user ${user_id}`;
        logs.add_log(ip, endpoint.info.status);
        return res.sendStatus(500);
      }

      if (result === undefined || result.length === 0) {
        status = `no form with id ${form_id} found , by user ${user_id}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(404);
      }

      next();
    });
  } catch (error) {
    console.log(error);
    status = `operation failed with an error : ${JSON.stringify(
      error
    )} for the user ${user_id}`;
    logs.add_log(ip, endpoint, info, status);
    res.sendStatus(500);
  }
};

const IS_VALID_RESPONSE = async (req, res, next) => {
  const { form_id, response_id } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `fetching response with id : ${response_id} for user  ${user_id} form ${form_id}`;
  let status = "";

  try {
    const sql = `SELECT response.* FROM response WHERE response.form_id = ? AND response.user_id = ?`;
    pool.query(sql, [form_id, user_id], (err, result) => {
      if (err) {
        console.log(err);
        status = `operation failed with error : ${JSON.stringify(err)}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(500);
      }
      if (result === undefined || result.length === 0) {
        status = `no response found with id : ${response_id}`;
        logs.add_log(ip, endpoint, info, status);
        return res.sendStatus(404);
      }

      req.form_response = result[0];

      next();
    });
  } catch (error) {
    console.log(error);
    status = `operation failed with error ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    res.sendStatus(500);
  }
};

module.exports = { IS_FORM_TO_USER, IS_FORM_VALID, IS_VALID_RESPONSE };
