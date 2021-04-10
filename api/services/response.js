const pool = require('../../config/db');
const {v4} = require('uuid');

const submit_response = async (form_id,user_id,response) => {
    return new Promise ((resolve,reject)=>{
        try {

            const response_id = v4();
            const sql = `INSERT INTO response (response_id,user_id,form_id,response) VALUES (?,?,?,?)`;
            pool.query(sql,[response_id,user_id,form_id,JSON.stringify(response)],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject ({
                        status:false,
                        msg:err 
                    });
                }

                if(result === undefined || result.affectedRows < 1 || result.affectedRows === undefined){
                    return reject({
                        status:false,
                        msg:{
                            code:500,
                            message:`can not fetch data to confirm submission`
                        }
                    });
                }

                return resolve ({
                    status:true,
                    msg:{
                        code:200,
                        message:response_id
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



module.exports = { submit_response };