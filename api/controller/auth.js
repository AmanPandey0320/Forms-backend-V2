const { CREATE_USER, VERIFY_USER } = require("../services/user");
const logs = require('../services/logs');

const sign_up = async (req,res) => {
    const {google_token,name} = req.body;
    const ip = req.connection.remoteAddress;
    const info = `signing up user with google token`;
    const endpoint = req.originalUrl;
    let status = '';
    CREATE_USER({google_token,name},(err,result)=>{
        if(err){
            status = `signing up failed with error${JSON.stringify(err)}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(err);
        }

        status = `user with user_id: "${result.msg.user_id} was created`;
        logs.add_log(ip,endpoint,info,status);
        return res.json({auth_token:result.msg.auth_token});

    });
}

const sign_in = async (req,res) => {
    
    const {google_token} = req.body;
    const ip = req.connection.remoteAddress;
    const info = `signing in user with google token`;
    const endpoint = req.originalUrl;
    let status = '';
    VERIFY_USER(google_token,async (err,result)=>{
        if(err){
            status = `signing in failed with error${JSON.stringify(err)}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(err);
        }
        status = `user with user_id " ${result.msg.user_id} " signed in.`;
        logs.add_log(ip,endpoint,info,status);
        return res.json({auth_token:result.msg.auth_token});

    });
}

module.exports = { sign_up,sign_in }