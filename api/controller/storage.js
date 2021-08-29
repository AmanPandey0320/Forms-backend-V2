const logs = require("../services/logs");
const { uploadToCloud, downloadFromCloud } = require("../services/storage");
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const upload = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `file upload by user : ${user_id}`;
  let status = "";

  const file = req.file;
  if (file == null || file.buffer === undefined) {
    return res.status(400).json({
      code: 400,
      message: "no file found",
    });
  }

  try {
    const upload_result = await uploadToCloud(file);

    if (upload_result.status) {
      status = `file : ${upload_result.msg.message} uploaded by user : ${user_id} `;
      logs.add_log(ip, endpoint, info, status);
      return res.json(upload_result.msg);
    } else {
      status = `operation by user : ${user_id} failed with a message : ${upload_result.msg.message}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).send(upload_result.msg);
    }
  } catch (error) {
    console.log(error);
    status = `operation failed with an error : ${JSON.stringify(
      error
    )} during upload bu user : ${user_id} `;
    logs.add_log(ip, endpoint, info, status);
    res.status(500).send(error);
  }
};
const download = async (req, res) => {
  const ip = req.connection.remoteAddress;
  const endpoint = req.originalUrl;
  const { user_id } = req.user;
  const info = `file download by user : ${user_id}`;
  let status = "";

  const { name } = req.params;
  // console.log(name)

  try {
    const down_res = await downloadFromCloud(name);

    if (down_res.status) {
      status = `file : ${name} downloaded by user ${user_id}`;
      logs.add_log(ip, endpoint, info, status);
      console.log(down_res)
      res.download(
        down_res.destination,
        `${v4()}.${down_res.extension}`,
        (err) => {
          if (err) {
            console.log(err);
            // return res.status(500).send(err.message);
          }

          fs.unlink(
            path.join(__dirname, `../../${down_res.destination}`),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );

          return;
        }
      );
    } else {
      status = `operation by user : ${user_id} failed with a message : ${down_res.msg.message}`;
      logs.add_log(ip, endpoint, info, status);
      return res.status(500).send(down_res.msg);
    }
  } catch (error) {
    console.log(error);
    status = `operation failed with an error : ${JSON.stringify(
      error
    )} during upload bu user : ${user_id} `;
    logs.add_log(ip, endpoint, info, status);
    res.status(500).send(error);
  }
};


module.exports = { upload, download};
