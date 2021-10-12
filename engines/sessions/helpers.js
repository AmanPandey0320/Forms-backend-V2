const { v4 } = require("uuid");
const query = require("../../database/Query/sessions");
const pool = require("../../config/db");
const resolvers = require("../resolvers");
const { SESSION_DURATION, SESSION_INCREMENT } = require("./constants");
const { destroySession, refreshSession } = require(".");

/**
 * @middleware
 * @description checks whether the session is valid
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const IS_VALID_SESSION = async (req, res, next) => {
  const currTime = new Date();
  const ip = req.connection.remoteAddress;
  const { akp_form_session_id } = req.cookies;
  try {
    const sql = query.SELECT_SESSION;
    const bind = [akp_form_session_id];
    /**
     * quering the database
     */
    pool.query(sql, bind, (err, result) => {
      if (err) {
        const { status, ...data } = resolvers.resolveError(err);
        const ress = {
          err: [data],
          messages: [],
          data: [],
        };
        res.status(status).json(ress).send();
        return;
      }
      const [currSession] = result;

      /**
       * if no sessin is found
       */
      if (!currSession) {
        const { status, ...data } = resolvers.resolveError({
          code: "FRM_NO_RECORD",
        });
        const resp = {
          err: [{ ...data, message: "No session found" }],
          messages: [],
          data: [],
        };
        res.status(status).json(resp).send();
        return;
      }

      /**
       * session found
       * check for validation
       */
      const { created_at, active, last_login } = currSession;
      const lastLoginTime = new Date(last_login);
      const sessionTime = new Date(created_at);

      /**
       * check if session is 2 days ago or last logon in 1 day ago
       */
      let validSession = false;
      if (currTime.getTime() - sessionTime.getTime() <= SESSION_DURATION) {
        validSession = true;
      } else if (
        currTime.getTime() - lastLoginTime.getTime() <=
        SESSION_INCREMENT
      ) {
        validSession = true;
      }

      if (validSession && Boolean(active)) {
          /**
           * refreshing session for next 1 day
           */
        refreshSession(akp_form_session_id, ip).finally(() => {
          req.currSession = currSession;
          next();
        });
      } else if (Boolean(active)) {
        /**
         * @description destroying current session
         */
        destroySession(akp_form_session_id)
          .then((success) => {
            const { status, ...data } = resolvers.resolveError({
              code: "FRM_INVALID_SESSION",
            });
            const resp = {
              err: [data],
              messages: ["last session logged out"],
              data: [],
            };
            res.status(status).json(resp).send();
          })
          .catch((failed) => {
            const { status, ...data } = resolvers.resolveError(failed);
            const resp = {
              err: [data],
              messages: ["please signin again!"],
              data: [],
            };
            res.status(status).json(resp).send();
          })
          .finally(() => {
            return;
          });
      } else {
          /**
           * inactive session
           * login again
           */
        const { status, ...data } = resolvers.resolveError({
          code: "FRM_INVALID_SESSION",
        });
        const resp = {
          err: [data],
          messages: ["last session logged out"],
          data: [],
        };
        res.status(status).json(resp).send();
      }
    });
  } catch (error) {
    console.log("session middleware------>", error);
    const { status, ...data } = resolvers.resolveError(error);
    const ress = {
      err: [data],
      messages: [],
      data: [],
    };
    res.status(status).json(ress).send();
  }
};

module.exports = { IS_VALID_SESSION };
