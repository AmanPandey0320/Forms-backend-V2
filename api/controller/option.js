const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");

class OptionController {
  constructor(service) {
    this.service = service;
  }

  /**
   * @description save action controller
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  saveAction = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { formData } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    let info = `saving a option id: ${body.formData.id}, fid = '${formData.fid}' sid = '${formData.sid}' question id: '${formData.qid}' user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.service.saveAction(formData, user_id);
      resData.data = { result };
      resData.messages.push("saved successfully!");
      logStatus = "option saved";
    } catch (error) {
      console.log("option controller save action error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `option controller save action error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  };
}

module.exports = OptionController;
