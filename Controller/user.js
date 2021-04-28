const  pool = require('../config/db');
const { v4 } = require('uuid');
const logs = require('../api/services/logs');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;
const salt_rounds = parseInt(process.env.salt_rounds  || 10);

const ADMIN_LOGIN = async (req,res) => {

    try {

        const { username,password } = req.body;
        const ip = req.connection.remoteAddress;
        const endpoint = req.originalUrl;

        const sql = `SELECT admin_id,password,enabled,issuper FROM admin WHERE username = ?`;
        const bind = [username];
        pool.query(sql,bind, async (error,result)=>{

            if(error){
                console.log(error);
                logs.add_log(ip,endpoint,`creating admin ${username}`,error.message);
                return res.send({
                    ok:false,
                    message:error.message
                });
            }

            if(result.length === 0){
                logs.add_log(ip,endpoint,`loggin by ${username}`,'no user found with such username');
                return res.send({
                    ok:false,
                    message:'no user found with such username'
                })
            }

            const auth = await bcrypt.compare(password,result[0].password);

            // console.log(result[0].admin_id);

            if(auth){
                if(result[0].enabled){
                    const token = await jwt.sign({admin_id:result[0].admin_id},jwt_key);
                    logs.add_log(ip,endpoint,`logged in admin ${result[0].admin_id}`,'logged in');
                    return res.send({
                        ok:true,
                        auth_token:token
                    });

                }else{
                    logs.add_log(ip,endpoint,`loggin by ${username}`,'logged in unsuccessfull');
                    return res.send({
                        ok:false,
                        message:'this admin in disabled! contact support'
                    });

                }
            }else{
                logs.add_log(ip,endpoint,`loggin by ${username}`,'logged in unsuccessfull');
                return res.send({
                    ok:false,
                    message:"unauthorised"
                });
            }
            
        })
        
        
    } catch (error) {
        console.log(error);
        logs.add_log(ip,endpoint,`creating admin ${username}`,error.message);
        return res.send({
            ok:false,
            message:error.message
        });
    }

}
const ADMIN_CREATE = async (req,res) => {
    try {

        const { username,password,email } = req.body;
        const admin_id = v4();
        const ip = req.connection.remoteAddress;
        const endpoint = req.originalUrl;
        const password_hash = await bcrypt.hash(password,salt_rounds);
        const issuper = false;
        const email_id = await bcrypt.hash(email,salt_rounds);
        const enabled = true;

        const sql = `INSERT INTO admin (admin_id,username,issuper,email_id,password,enabled) VALUES (?,?,?,?,?,?)`;
        const bind = [admin_id,username,issuper,email_id,password_hash,enabled];
        await pool.query(sql,bind);

        logs.add_log(ip,endpoint,`creating admin ${username}`,'admin created');

        return res.status(200).send({
            ok:true,
            message:"admin created!"
        });

    } catch (error) {

        console.log(error);
        logs.add_log(ip,endpoint,`creating admin ${username}`,error.message);
        return res.send({
            ok:false,
            message:error.message
        });
        
    }
}
const ADMIN_UPDATE = async (req,res) => {

}

module.exports = {  ADMIN_LOGIN,ADMIN_CREATE };

// create table `admin` (
//     `admin_id` varchar(255) not null primary key,
//     `issuper` boolean default false,
//     `username` varchar(255) not null,
//     `email_id` varchar(255) not null,
//     `password` text not null,
//     `created` timestamp default current_timestamp(),
//     `enabled` boolean default false
//     ) engine=InnoDB default charset=utf8mb4;