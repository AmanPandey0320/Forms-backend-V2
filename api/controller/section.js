const resolver = require("../../engines/resolvers");
const logs = require("../../engines/logs");
class SectionController {
  constructor(service) {
    this.service = service;
  }
  /**
   * @description controller for save action
   * @param {*} req
   * @param {*} res
   * @returns
   */
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
        data: {},
      };
    try {
      const result = await this.service.saveAction(sec, fid, user_id);
      resData.data["result"] = { id: result, saved: true };
      resData.messages.push("section saved!");
      logStatus = "Section saved";
    } catch (error) {
      console.log(error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = error.message;
      resData.err.push(data);
    }
    // sending response
    res.status(resStatus).json(resData).send();

    //adding logs
    logs.add_log(ip, endpoint, info, logStatus);

    return;
  }; // end of save action

  /**
   * @description delete action controller
   * @param {*} req
   * @param {*} res
   * @returns
   */
  deleteAction = async (req, res) => {
    const { user, body } = req;
    const { user_id } = user;
    const { id } = body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `deleting a section id: ${id} user id{${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.service.deleteAction(id);
      resData.data["result"] = result;
      resData.messages.push("Section deleted!");
    } catch (error) {
      console.log("delete section controller err----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = error.message;
      resData.err.push(data);
    }
    res.status(resStatus).json(resData).send();
    logs.add_log(ip, endpoint, info, logStatus);
    return;
  }; // end of delete action

  /**
   * @description contoller to fetch all section
   * @param {*} req
   * @param {*} res
   */
  fetchSecByFormID = async (req, res) => {
    const { user, query } = req;
    const { user_id } = user;
    const { fid } = query;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `fetching all section of form id: ${fid} user id: {${user_id}}`;
    let logStatus = "No status updated";
    let resStatus = 200;
    let resData = {
      err: [],
      messages: [],
      data: {},
    };
    try {
      const result = await this.service.listAction(fid);
      resData.data["section"] = result;
      logStatus = "section fetched";
    } catch (error) {
      console.log(" section list action controller err----->", error);
      const { status, ...data } = resolver.resolveError(error);
      resStatus = status;
      logStatus = error.message;
      resData.err.push(data);
    }
    res.status(resStatus).json(resData).send();
    logs.add_log(ip, endpoint, info, logStatus);
    return;
  }; // end of fetchSecByFormID
}

module.exports = SectionController;
