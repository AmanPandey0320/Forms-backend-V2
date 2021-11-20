const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");

class FormController {
  constructor(formService, secService, queService, optionService) {
    this.formService = formService;
    this.secService = secService;
    this.queService = queService;
    this.optionService = optionService;
  }

  /**
   * @description saves the form
   * @param {*} req
   * @param {*} res
   */
  saveAction = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { formData } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `saving a form id: ${body.formData.id} user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.formService.saveAction({
        ...formData,
        user_id,
      });
      resData.data["result"] = { id: result, saved: true };
      resData.messages.push("form saved!");
      logStatus = "Form saved";
    } catch (error) {
      console.log("create form controller error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `create form controller error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  }; // end of create

  /**
   * @description list of all forms by the user
   * @param {*} req
   * @param {*} res
   * @returns
   */
  listAction = async (req, res) => {
    const { user } = req;
    const { user_id } = user;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `fetching all forms for user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.formService.listAction(user_id);
      logStatus = "forms fetched";
      resData.data = { result };
    } catch (error) {
      console.log("list action controller error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `list actioncontroller error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData);

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  }; // end of list action

  /**
   * @description populates the form
   * @param {*} req
   * @param {*} res
   * @returns
   */
  populateAction = async (req, res) => {
    const { user, query } = req;
    const { user_id } = user;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const { id } = query;
    const info = `fetching all forms for user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.formService.populateAction(id);
      logStatus = "forms fetched";
      resData.data = { result };
    } catch (error) {
      console.log("populate form action controller error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `populate form actioncontroller error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData);

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  }; // end of populateAction

  /**
   * @description creates form from template controller
   * @param {*} req
   * @param {*} res
   * @returns
   */
  createFromTemplate = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { tid } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `creating a form from template id: ${tid} user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const { id: fid, data: ques } = await this.formService.createFromTemplate(
        tid,
        user_id
      );
      const sid = await this.secService.saveAction({}, fid, user_id);
      let questions = [];
      let options = [];
      ques.forEach((que, idx) => {
        const { question: title, type, required } = que;
        questions.push({
          fid,
          sid,
          type,
          title,
          required,
          order: idx + 1,
        });
      });
      const qid = await this.queService.multiSaveAction(questions, user_id);
      ques.forEach((que, idx) => {
        if (que.options?.length > 0) {
          que.options.forEach((op) => {
            options.push({
              fid,
              sid,
              title: op,
              qid: qid + idx,
            });
          });
        }
      });
      // console.log("options------->", options);
      await this.optionService.multiSaveAction(options, user_id);
      // ques.forEach(async (que) => {
      //   const { question, type, required } = que;
      //   const { id: qid } = await this.queService.saveAction(
      //     { sid, fid },
      //     user_id
      //   );
      //   await this.queService.saveAction({
      //     type,
      //     required,
      //     id: qid,
      //     title: question,
      //   });
      //   if (que.options?.length > 0) {
      //     que.options.forEach(async (op) => {
      //       const { id: oid } = await this.optionService.saveAction(
      //         { fid, sid, qid },
      //         user_id
      //       );
      //       await this.optionService.saveAction({ id: oid, title: op });
      //     });
      //   }
      // });
      const result = { id: fid };
      resData.data = { result };

      resData.messages.push("form created!");
      logStatus = "Form created";
    } catch (error) {
      console.log("form create from template controller error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `form create from template controller error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  };
} // end of class

module.exports = FormController;
