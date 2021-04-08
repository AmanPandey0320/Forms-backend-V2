const pool = require('../../config/db');
const { v4 } = require('uuid');

const CREATE_FORM = async ({user_id,data,title,desc,theme}) => {

    return new Promise(async (resolve,reject) => {
        try {

            const form_id = v4();
            const updated_at = new Date();
            const sql = `INSERT INTO form (form_id,title,theme,description,data,user_id,updated_at) VALUES (?,?,?,?,?,?,?)`;
            pool.query(sql,[form_id,title,theme,desc,JSON.stringify(data),user_id,updated_at],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err 
                    });
                }

                if(result === undefined || result.length === 0 || result.affectedRows < 1){
                    return reject({
                        status:false,
                        msg:{
                            code:500,
                            message:'unable to fetch form creation data'
                        }
                    });
                }

                return resolve({
                    status:true,
                    msg:{form_id,user_id}
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

const GET_ALL_FORMS = async ({user_id})=>{
    return new Promise(async (resolve,reject) => {
        try {

            const sql = `SELECT form.* FROM form JOIN users ON form.user_id = users.user_id WHERE users.isverified = true AND users.user_id = ?`;
            pool.query(sql,[user_id],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err
                    });
                }

                if(result === undefined || result.length === 0 || result.affectedRows < 1){
                    return result({
                        status:false,
                        msg:{
                            code:500,
                            message:'DB error : unable to fetch data'
                        }
                    });
                }

                return resolve({
                    status:true,
                    msg:{length:result.length,result:result}
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

const GET_ONE_FORM = async ({form_id})=>{
    return new Promise(async (resolve,reject)=>{
        try {

            const sql = `SELECT * FROM form WHERE form_id = ?`;
            pool.query(sql,[form_id],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err
                    });
                }
                // console.log(result[0]);
                if(result === undefined || result.length === 0 ){
                    return reject({
                        status:false,
                        msg:{
                            code:500,
                            message:'unable to fetch data'
                        }
                    });
                }

                return resolve({
                    status:true,
                    msg:{length:result.length,result:result}
                });
            });
            
        } catch (error) {
            console.log(error);
            return reject({
                status:false,
                msg:error
            });
        }
    })
}

const DELETE_FORM = async (form_id) => {
    return new Promise(async (resolve,reject)=>{
        try {

            const sql = `DELETE FROM form WHERE form_id = ?`;
            const result = await pool.query(sql,form_id);

            if(result.affectedRows < 1){
                return reject({
                    status:false,
                    msg:{
                        code:500,
                        message:'Unable to delete forms!'
                    }
                });
            }

            return resolve({
                status:true,
                msg:{
                    code:200,
                    message:'form deleted!'
                }
            });
            
        } catch (error) {
            console.log(err);
            return reject({
                status:false,
                msg:error
            });
        }
    })
}

module.exports = { CREATE_FORM,GET_ALL_FORMS,GET_ONE_FORM,DELETE_FORM };