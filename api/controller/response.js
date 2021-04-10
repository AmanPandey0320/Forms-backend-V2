const logs = require('../services/logs');
const { submit_response } = require('../services/response');

const SUBMIT = async (req,res)=>{
    const {form_id,response} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = req.user
    const info = `submitting forms with form_id : ${form_id} for user with user_id ${user_id}`;
    let status = '';

    try {

        const submit_result = await submit_response(form_id,user_id,response);

        if(submit_result.status){

            status = `response : ${submit_result.msg.message} submitted for form ${form_id} by user ${user_id}`
            logs.add_log(ip,endpoint,info,status);
            return res.send(submit_result.msg);

        }else{
            status = `form ${form_id} can not be submitted for the user ${user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).send(submit_result.msg);
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

}

const FETCH_ONE = async (req,res)=>{
    res.send('fetch-one')
}

module.exports = { SUBMIT,FETCH_ONE };