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

const edit_response = async ({response_id,response}) => {
    return new Promise (async(resolve,reject)=>{
        try {

            const sql = `UPDATE response SET response = ?, edited_at = ? WHERE response_id = ?`;
            const edited_at = new Date();

            pool.query(sql,[JSON.stringify(response),edited_at,response_id],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err
                    });
                }

                if(result === undefined || result.affectedRows < 1){
                    return reject({
                        status:false,
                        msg:{
                            code:500,
                            message:'unable to confirm edit'
                        }
                    });
                }

                return resolve({
                    status:true,
                    msg:{
                        code:200,
                        message:`response edited successfully`
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

const get_response = async (response_id) => {
    return new Promise (async (resolve,reject) => {
        try {

            const sql = `SELECT response,submitted_at,edited_at FROM response WHERE response_id = ?`;
            pool.query(sql,[response_id],(err,result) => {
                if(err){
                    console.log(err);
                    return reject({
                        status:false,
                        msg:err
                    });
                }

                if(result === undefined || result.length == 0){
                    return reject ({
                        status:false,
                        msg:{
                            code:500,
                            message:'unable to fetch date'
                        }
                    });
                }

                const response = JSON.parse(result[0].response);
                const submitted_at = result[0].submitted_at;
                const edited_at = result[0].edited_at;

                return resolve({
                    status:true,
                    msg:{response,submitted_at,edited_at}
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

// const getAllResponse = async (form_id,is_test) => {
//     return new Promise (async(resolve,reject)=>{
//         try {

//             const sql = `SELECT * FROM response WHERE `
            
//         } catch (error) {
//             console.log(error);
//             return reject({
//                 status:false,
//                 msg:error
//             });
//         }
//     });
// }

module.exports = { submit_response,edit_response,get_response };