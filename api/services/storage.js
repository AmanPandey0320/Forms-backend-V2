const {Storage} = require('@google-cloud/storage');
const {v4} = require('uuid');
const {format} = require('util');
const projectID = process.env.project_id;
const bucket_name = process.env.bucket_name;

const storage = new Storage({
    projectId: projectID,
    keyFilename: "serviceAccountKey.json"
});

const bucket = storage.bucket(bucket_name);

const uploadToCloud = async (file) => {

    return new Promise((resolve,reject)=>{
        if(!file){
            return reject({
                    status:false,
                    msg:{
                        code:400,
                        message:'No file exists'
                    }
                }
            );
        }

        const name = file.originalname.split('.');
        let newFileName = `${v4()}.${name[name.length - 1]}`;
        let uploadTask = bucket.file(newFileName);

        const blobStream = uploadTask.createWriteStream({
            metadata:{
                contentType: file.mimetype
            }
        });

        blobStream.on('error',(error)=>{
            console.log(error);
            return reject({
                status:false,
                msg:error
            });
        });

        blobStream.on('finish',() => {

            return resolve({
                status:true,
                msg:{
                    code:200,
                    message:newFileName
                }
            });

        });

        blobStream.end(file.buffer);
    });

}

const downloadFromCloud = async (name) =>{
    return new Promise (async (resolve,reject) => {
        if(!name){
            return reject({
                status:false,
                msg:{
                    code:400,
                    message:'no file name provided'
                }
            });
        }

        const downloadTask = bucket.file(name);
        try {

            const extension = name.split('.')[1];
            const file = await downloadTask.download();
            return resolve({
                status:true,
                msg:file
            });
            
        } catch (error) {
            console.log(error);
            return reject({
                status:false,
                msg:error
            });
        }

    });
}

module.exports = { uploadToCloud,downloadFromCloud };
