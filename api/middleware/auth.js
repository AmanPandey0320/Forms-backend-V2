const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;
const logs = require('../services/logs')

const IS_AUTHENTICATED = (req,res,next)=>{

    const {auth_token} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `accessing api `;
    let status = '';

    if(auth_token === null  || auth_token === undefined){
        status = `no auth token found`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(401).json({
            status:401,
            msg:{
                code:401,
                message:'Not a valid user'
            }
        });
    }

    jwt.verify(auth_token,jwt_key,(err,decode)=>{
        if(err){
            console.log(err);
            status = `operation failed with an error : ${JSON.stringify(err)}`
            logs.add_log(ip,endpoint,info,status);
            return res.status(401).json({
                status:401,
                msg:err
            });
        }
        const {user_id} = decode;

        if(user_id === null || user_id === undefined){
            status = `invalid auth token`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(400).json({
                status:400,
                msg:{
                    code:400,
                    message:'either the token in invalid or it has expired'
                }
            })
        }

        const sql = `SELECT * FROM users WHERE user_id=?`;
        pool.query(sql,[user_id],(err,result)=>{
            if(err){
                console.log(err);
                status = `operation failed with an error : ${JSON.stringify(err)}`
                logs.add_log(ip,endpoint,info,status);
                return res.status(404).json({
                    status:404,
                    msg:err
                });

            }
            if(result.length === 0){
                status = `no user found with id : ${user_id}`
                logs.add_log(ip,endpoint,info,status);
                return res.status(401).json({
                    status:401,
                    msg:{
                        code:401,
                        message:'No user found!'
                    }
                });
            }
            if(result[0].isverified === false){

                status = `user in not authorized to sign-in with id : ${user_id}`
                logs.add_log(ip,endpoint,info,status);

                return res.status(401).json({
                    status:401,
                    msg:{
                        code:401,
                        message:'user in not authorized to sign-in!'
                    }
                });

            }

        });

    });

    next();


}

module.exports = { IS_AUTHENTICATED };