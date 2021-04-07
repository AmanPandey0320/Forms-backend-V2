const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;

const IS_AUTHENTICATED = (req,res,next)=>{

    const {auth_token} = req.body;
    jwt.verify(auth_token,jwt_key,(err,decode)=>{
        if(err){
            console.log(err);
            return res.status(401).json({
                status:401,
                msg:err
            });
        }
        const {user_id} = decode;

        const sql = `SELECT * FROM users WHERE user_id=?`;
        pool.query(sql,[user_id],(err,result)=>{
            if(err){
                console.log(err);
                return res.status(404).json({
                    status:404,
                    msg:err
                });

            }

        })

    });

    next();


}

module.exports = { IS_AUTHENTICATED };