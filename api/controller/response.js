const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");

class ResponseController {
  constructor(service) {
    this.service = service;
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  saveAction = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { response, fid } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    let info = `saving a response for user id: ${user_id} for form id: ${fid}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.service.saveAction(response, fid, user);
      resData.data = { result };
      logStatus = "response saved";
    } catch (error) {
      console.log("response controller save action error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `response controller save action error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData);

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  };

  populateByFid = async (req, res) => {
    const { user, query } = req;
    const { user_id } = user;
    const { fid } = query;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    let info = `fetching all response for user id: ${user_id} for form id: ${fid}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.service.populateByFid(fid);
      resData.data = { result };
      logStatus = "response sent";
    } catch (error) {
      console.log("response controller save action error ----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = `response controller save action error -----> ${error.message}`;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData);

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  };
}

module.exports = ResponseController;
