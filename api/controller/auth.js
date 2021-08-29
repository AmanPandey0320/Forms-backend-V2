const { CREATE_USER, VERIFY_USER, GOOGLE_ENTRY } = require("../services/user");
const logs = require("../services/logs");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const { v4 } = require("uuid");

/**
 * @description controller for sign up
 * @param {*} req
 * @param {*} res
 */
const sign_up = async (req, res) => {
  const { google_token, name } = req.body;
  const ip = req.connection.remoteAddress;
  const info = `signing up user with google token`;
  const endpoint = req.originalUrl;
  let status = "";
  CREATE_USER({ google_token, name }, (err, result) => {
    if (err) {
      status = `signing up failed with error${JSON.stringify(err)}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).json(err);
    }

    status = `user with user_id: "${result.msg.user_id} was created`;
    logs.add_log(ip, endpoint, info, status);
    res.cookie("akp_form_session_id", result.msg.auth_token, { path: "/" });
    return res.json({ auth_token: result.msg.auth_token });
  });
};

/**
 * @description controller for sign in
 * @param {*} req
 * @param {*} res
 */
const sign_in = async (req, res) => {
  const { google_token } = req.body;
  const ip = req.connection.remoteAddress;
  const info = `signing in user with google token`;
  const endpoint = req.originalUrl;
  let status = "";
  VERIFY_USER(google_token, async (err, result) => {
    if (err) {
      status = `signing in failed with error${JSON.stringify(err)}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).json(err);
    }
    status = `user with user_id " ${result.msg.user_id} " signed in.`;
    logs.add_log(ip, endpoint, info, status);
    res.cookie("akp_form_session_id", result.msg.auth_token, { path: "/" });
    return res.json({ auth_token: result.msg.auth_token }).send();
  });
};

/**
 * @description controller for sign in
 * @param {*} req
 * @param {*} res
 * @returns
 */
const google = async (req, res) => {
  const { google_token, name } = req.body;
  const ip = req.connection.remoteAddress;
  const info = `signing in user with google token`;
  const endpoint = req.originalUrl;
  let status = "";
  try {
    const result = await GOOGLE_ENTRY({ google_token, name });
    if (result.status) {
      status = `user with user_id: "${result.msg.user_id} was created`;
      logs.add_log(ip, endpoint, info, status);
      const resData = {
        err: [],
        data: [{ auth_token: result.msg.auth_token, name: result.msg.name }],
        messages: [{ type: "success", data: "Welcome!" }],
      };
      res.cookie("akp_form_session_id", result.msg.auth_token, { path: "/" });
      return res.json(resData).send();
    } else {
      status = `signing in failed with error${JSON.stringify(result.msg)}`;
      logs.add_log(ip, endpoint, info, status);
      const resData = {
        err: [
          {
            code: "ERR00001",
            message: "Sign in failed",
          },
        ],
        data: [],
        messages: [{ type: "error", data: "Some error occured" }],
      };
      return res.status(200).json(resData);
    }
  } catch (error) {
    status = `operation failed with an error : ${JSON.stringify(error)}`;
    logs.add_log(ip, endpoint, info, status);
    const resData = {
      err: [
        {
          code: "ERR00001",
          message: error.message,
        },
      ],
      data: [],
      messages: [{ type: "error", data: "Some error occured" }],
    };
    return res.status(200).json(resData);
  }
};

/**
 * @description controller for user verification
 * @param {*} req
 * @param {*} res
 * @returns
 */
const verify = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const { user_id, name } = req.user;
  const info = `verifing user ${user_id}`;
  const endpoint = req.originalUrl;
  let status = "verified";

  const auth_token = await jwt.sign({ user_id }, jwt_key);
  logs.add_log(ip, endpoint, info, status);
  const resData = {
    err: [],
    data: [{ auth_token, name }],
    messages: [
      {
        type: "success",
        data: "Welcome!",
      },
    ],
  };
  res.cookie("akp_form_session_id", auth_token, { path: "/" });
  return res.send(resData).send();
};

module.exports = { sign_up, sign_in, google, verify };
