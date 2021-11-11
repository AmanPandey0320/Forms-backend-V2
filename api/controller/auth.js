const { CREATE_USER, VERIFY_USER, GOOGLE_ENTRY } = require("../services/user");
const logs = require("../services/logs");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.JWT_KEY;
const { createSession, destroySession } = require("../../engines/sessions");
// const sendMail = require("../../engines/mail");
const TML0000001 = require("../../engines/mail/templates/TML0000001");

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
    res.cookie("akp_auth_token", result.msg.auth_token, { path: "/",sameSite: 'none' });
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
  try {
    VERIFY_USER(google_token, async (err, result) => {
      if (err) {
        status = `signing in failed with error${JSON.stringify(err)}`;
        logs.add_log(ip, endpoint, info, status);
        return res.status(500).json(err);
      }
      const { auth_token, user_id, email_id, name } = result.msg;
      //creating session
      const sid = await createSession(user_id, false, ip);
      //adding logs
      status = `user with user_id " ${result.msg.user_id} " signed in.`;
      logs.add_log(ip, endpoint, info, status);
      //sending cookies
      res.cookie("akp_auth_token", auth_token, { path: "/",sameSite: 'none' });
      res.cookie("akp_form_session_id", sid, { path: "/",sameSite: 'none' });
      /**
       * sending reponse
       */
      return res.json({ auth_token, email_id }).send();
    });
  } catch (error) {
    status = `signing in failed with error${JSON.stringify(err)}`;
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
 * @description controller for sign in
 * @param {*} req
 * @param {*} res
 * @returns
 */
const google = async (req, res) => {
  const { google_token, name, email_id } = req.body;
  const ip = req.connection.remoteAddress;
  const info = `signing in user with google token`;
  const endpoint = req.originalUrl;
  let status = "";
  try {
    const result = await GOOGLE_ENTRY({ google_token, name, email_id });
    const { auth_token, user_id } = result.msg;
    if (result.status) {
      status = `user with user_id: "${result.msg.user_id} was created`;
      logs.add_log(ip, endpoint, info, status);
      const resData = {
        err: [],
        data: [
          {
            auth_token: result.msg.auth_token,
            name: result.msg.name,
            email_id,
          },
        ],
        messages: [{ type: "success", data: "Welcome!" }],
      };
      const sid = await createSession(user_id, false, ip);
      res.cookie("akp_auth_token", auth_token, { path: "/",sameSite: 'none' });
      res.cookie("akp_form_session_id", sid, { path: "/",sameSite: 'none' });
      /**
       * sending mail
       */
      if (email_id) {
        // sendMail(email_id, TML0000001.subject, TML0000001.body([name, ip]));
      }
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
    console.log("google---->", error);
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
  res.cookie("akp_auth_token", auth_token, { path: "/",sameSite: 'none' });
  return res.send(resData).send();
};

/**
 * @description signing out the user
 * @param {*} req
 * @param {*} res
 */
const signOut = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const { user_id, name } = req.user;
  const info = `signing out user ${user_id}`;
  const endpoint = req.originalUrl;
  const { akp_form_session_id } = req.cookies;
  try {
    const result = await destroySession(akp_form_session_id);
    const resp = {
      err: [],
      message: [],
      data: [result],
    };
    logs.add_log(ip, endpoint, info, "logged out!!");
    res.status(200).json(resp).send();
  } catch (error) {
    const { status, ...data } = resolvers.resolveError(error);
    const resp = {
      err: [data],
      messages: ["some error...."],
      data: [],
    };
    logs.add_log(ip, endpoint, info, "error logging out");
    res.status(status).json(resp).send();
  }
};

module.exports = { sign_up, sign_in, google, verify, signOut };
