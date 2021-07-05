const logs = require("../services/logs");
const {
  submit_response,
  edit_response,
  getAllResponse,
} = require("../services/response");

const SUBMIT = async (req, res) => {
  const { form_id, response } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `submitting forms with form_id : ${form_id} for user with user_id ${user_id}`;
  let status = "";

  try {
    const submit_result = await submit_response(form_id, user_id, response);

    if (submit_result.status) {
      status = `response : ${submit_result.msg.message} submitted for form ${form_id} by user ${user_id}`;
      logs.add_log(ip, endpoint, info, status);
      return res.send(submit_result.msg);
    } else {
      status = `form ${form_id} can not be submitted for the user ${user_id}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).send(submit_result.msg);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const EDIT_ONE = async (req, res) => {
  const { response_id, response, form_id } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `editing responce with id : ${response_id} for user with user_id ${user_id} for form : ${form_id}`;
  let status = "";

  try {
    const upadate_res = await edit_response({ response_id, response });

    if (upadate_res.status) {
      status = `response edited successfully`;
      logs.add_log(ip, endpoint, info, status);
      return res.send(upadate_res.msg);
    } else {
      status = `operation failed with an error : ${JSON.stringify(
        upadate_res.msg
      )}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).send(upadate_res.msg);
    }
  } catch (error) {
    console.log(error);
    status = `operation failed with an error : ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    return res.status(500).send(error);
  }
};

const FETCH_ONE = async (req, res) => {
  const { form_id, response_id } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `fetching response with id : ${response_id} for user  ${user_id} form ${form_id}`;
  let status = "operation successfull";
  const response = JSON.parse(req.form_response.response);
  req.form_response.response = response;
  logs.add_log(ip, endpoint, info, status);
  res.send(req.form_response);
};

const FETCH_ALL = async (req, res) => {
  const { form_id } = req.body;
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const { is_test } = req.formData;
  const info = `fetching all response for user  ${user_id} form ${form_id}`;
  let status = "";

  try {
    const all_response = await getAllResponse(form_id, is_test);

    if (all_response.status) {
      status = `all response sent to the owner`;
      logs.add_log(ip, endpoint, info, status);
      return res.send({ response: all_response.msg });
    } else {
      status = `operation failed with error : ${all_response.msg}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).send(all_response.msg);
    }
  } catch (err) {
    console.log(err);
    status = `operation failed with error : ${JSON.stringify(err)}`;
    return res.status(500).send(err);
  }
};

module.exports = { SUBMIT, FETCH_ONE, EDIT_ONE, FETCH_ALL };
