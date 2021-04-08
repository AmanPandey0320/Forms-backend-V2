const  pool = require('../../config/db');

const add_log = async(ip,endpoint,info,status)=>{
    return new Promise(async(resolve,reject)=>{
        try {

            const sql = `INSERT INTO logs (info,ip,endpoint,status) VALUES (?,?,?,?)`;
            pool.query(sql,[info,ip,endpoint,status],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err
                    });
                }
                // console.log(result);
                if(result === undefined || result.length === 0 || result.affectedRows != 1){
                    return reject({
                        status:false,
                        msg:{
                            code:500,
                            message:'DB error, unable to log data'
                        }
                    });
                }

                return resolve({
                    status:true,
                    msg:{
                        code:200,
                        message:'Log added successfully'
                    }
                });
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

module.exports = { add_log };