const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");
class SectionController {
  constructor(service) {
    this.service = service;
  }
  saveAction = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { fid, ...sec } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `saving a section form id: ${fid} user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200,
      resData = {
        err: [],
        messages: [],
        data: [],
      };
    try {
      const result = await this.service.saveActionService(sec, fid, user_id);
      resData.data.push({ id: result, saved: true });
      resData.messages.push("section saved!");
      logStatus = "Section saved";
    } catch (error) {
      console.log(error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = data.message;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  };
}

module.exports = SectionController;
