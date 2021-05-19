const  pool = require('../config/db');
const { v4 } = require('uuid');
const logs = require('../api/services/logs');

const CREATE_TEMPLATE = async (req,res) => {
    const { body,adminuser } = req;
    const template_id = v4();
    const { title,description,theme,enabled,data} = body;
    const bind = [template_id,title,JSON.stringify(theme),description,JSON.stringify(data),enabled];
    const sql = `INSERT INTO template (template_id, title, theme, description, data, enabled) VALUES (?,?,?,?,?,?)`;
    pool.query(sql,bind,(err,result)=>{
        if(err){
            console.log(err);
            return res.send(err);
        }
        res.send(result);
    });
}

const READ_TEMPLATE = async (req,res) => {
    return res.send('reading template');
}

const UPDATE_TEMPLATE = async (req,res) => {
    return res.send('updating template');
}

const DELETE_TEMPLATE = async (req,res) => {
    return res.send('deleting templates');
}

module.exports ={CREATE_TEMPLATE,READ_TEMPLATE,UPDATE_TEMPLATE,DELETE_TEMPLATE};
