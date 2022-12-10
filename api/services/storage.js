const { Storage } = require("@google-cloud/storage");
const { v4 } = require("uuid");
const { format } = require("util");
const projectID = process.env.project_id;
const bucket_name = process.env.bucket_name;

const storage = new Storage({
  projectId: projectID,
  keyFilename: "serviceAccountKey.json",
});
const options = {
  version: 'v4',
  action: 'read',
  expires: Date.now() + 15 * 60 * 1000, // 15 minutes
}

const bucket = storage.bucket(bucket_name);

const uploadToCloud = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject({
        status: false,
        msg: {
          code: 400,
          message: "No file exists",
        },
      });
    }

    const name = file.originalname.split(".");
    let newFileName = `${v4()}.${name[name.length - 1]}`;
    let uploadTask = bucket.file(newFileName);

    const blobStream = uploadTask.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.log(error);
      return reject({
        status: false,
        msg: error,
      });
    });

    blobStream.on("finish", async () => {
      try {
        const [url] = await uploadTask.getSignedUrl(options);
        return resolve({
          status: true,
          msg: {
            code: 200,
            message: url,
          },
        });
      } catch (error) {
        return reject({
          status: false,
          msg: error,
        });
      }
    });

    blobStream.end(file.buffer);
  });
};

const downloadFromCloud = async (name) => {
  return new Promise(async (resolve, reject) => {
    if (!name) {
      return reject({
        status: false,
        msg: {
          code: 400,
          message: "no file name provided",
        },
      });
    }

    const downloadTask = bucket.file(name);
    try {
      const extension = name.split(".")[1];
      const destination = `./temp_downloads/${v4()}.${extension}`;
      const options = { destination };
      await downloadTask.download(options);
      return resolve({
        destination,
        extension,
        status: true,
      });
    } catch (error) {
      console.log(error);
      return reject({
        status: false,
        msg: error,
      });
    }
  });
};

module.exports = { uploadToCloud, downloadFromCloud };
