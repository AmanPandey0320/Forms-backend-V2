const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");

class FormController {
  constructor(service) {
    this.service = service;
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
      const result = await this.service.saveAction({ ...formData, user_id });
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
      const result = await this.service.listAction(user_id);
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
    res.status(resStatus).json(resData).send();

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
      const result = await this.service.populateAction(id);
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
    res.status(resStatus).json(resData).send();

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
      const result = await this.service.createFromTemplate(tid, user_id);
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
