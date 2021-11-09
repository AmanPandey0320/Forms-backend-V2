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
}

module.exports = FormController;
