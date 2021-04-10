const logs = require('../services/logs');
const jwt  = require('jsonwebtoken');
const { uploadToCloud } = require('../services/storage');

const upload = async (req,res)=>{
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    // const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `uploading file`;
    let status = '';

    const file = req.file;
    if(file == null || file.buffer === undefined ){
        return res.status(400).json({
            code:400,
            message:'no file found'
        });
    }
    
    try {

        const upload_result = await uploadToCloud(file);

        if(upload_result.status){
            status = `file : ${upload_result.msg.message} uploaded by user `;
            logs.add_log(ip,endpoint,info,status);
            return res.json(upload_result.msg);
        }else{
            status = `operation by user failed with a message : ${upload_result.msg.message}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).send(upload_result.msg);
        }
        
    } catch (error) {

        console.log(error);
        status = `operation failed with an error : ${JSON.stringify(error)} during upload bu user `;
        logs.add_log(ip,endpoint,info,status);
        res.status(500).send(error);
        
    }

}
const download = async (req,res)=>{

}

module.exports = {upload,download}