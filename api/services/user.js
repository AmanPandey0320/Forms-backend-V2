const pool = require('../../config/db');
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;

const CREATE_USER = async ({google_token,name},callback)=>{
        try{
            const user_id = await v4(16);
            const updated_at = new Date();
            const sql = `INSERT INTO users (user_id,name,google_token,isverified,updated_at) VALUES (?,?,?,?,?)`;

            pool.query(sql,[user_id,name,google_token,true,updated_at],async (err,result)=>{
                if(err){
                    console.log(err);
                    return callback({
                        status:false,
                        msg:err
                    });
                }

                const auth_token = await jwt.sign({user_id},jwt_key);

                return callback(null,{
                    status:true,
                    msg:{auth_token,user_id}
                });

            });

        }catch(err){
            console.log(err);
            return callback({
                status:false,
                msg:err
            });
        }
}
const VERIFY_USER = async (google_token,callback)=>{
    try{

        const sql = `SELECT user_id FROM users WHERE google_token = ?`;
        pool.query(sql,[google_token],async (err,result)=>{
            if(err){
                console.log(err);
                return callback({
                    status:false,
                    msg:err
                });
            }
            if(result.length === 0){
                return callback({
                    status:false,
                    msg:{
                        code:404,
                        message:'No user found!'
                    }
                })
            }
            const {user_id} = result[0];
            const auth_token = await jwt.sign({user_id},jwt_key);

            return callback(null,{
                status:true,
                msg:{auth_token,user_id}
            });
        });

    }catch(err){
        console.log(err);
        return callback({
            status:false,
            msg:err
        });
    }
}

module.exports = { CREATE_USER,VERIFY_USER };