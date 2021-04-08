const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;
const logs = require('../services/logs');

const IS_FORM_TO_USER = async (req,res,next)=>{
    const {form_id,auth_token} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `deleting forms with form_id : ${form_id} for user with user_id ${user_id}`;
    let status = '';

    try {

        const sql = `SELECT * FROM form WHERE form_id = ?`;
        const { user_id } = await jwt.verify(auth_token,jwt_key);
        
        pool.query(sql,[form_id],(error,result)=>{

            if(error){
                console.log(error);
                status=`operation failed with an error : ${JSON.stringify(error)}`;
                logs.add_log(ip,endpoint,info,status);
                return res.sendStatus(500);
            }
            
            const form = result[0];
            if(form === undefined || form.form_id === undefined){
                status = `form with id ${form_id} does not exists`;
                logs.add_log(ip,endpoint,info,status);
                return res.sendStatus(404);
            }
    
            if(form.user_id != user_id){
                status=`unauthorized access to form : ${form_id} belonging to user : ${form.user_id} by user ${user_id}`;
                logs.add_log(ip,endpoint,info,status);
                return res.sendStatus(401);
            }

            next();

        });

        
        
    } catch (error) {
        console.log(error);
        status=`operation failed with an error : ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.sendStatus(500);
    }
}

module.exports = { IS_FORM_TO_USER };