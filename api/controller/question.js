const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");

/**
 * @class
 */
class QuestionController {
  constructor(service) {
    this.service = service;
  }

  /**
   * @description save action for question
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
    let info = `saving a question id: ${body.formData.id}, fid = '${formData.fid}' sid = '${formData.sid}' user id{${user_id}}`;
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
      logStatus = "question saved";
    } catch (error) {
      console.log("question controller save action error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `question controller save action error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  }; // end of save action
} // end of class

module.exports = QuestionController;
