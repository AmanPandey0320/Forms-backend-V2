const  pool = require('../config/db');
const { v4 } = require('uuid');
const logs = require('../api/services/logs');

const CREATE_TEMPLATE = async (req,res) => {
    const { body,adminuser } = req;

    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {admin_id} = adminuser;

    const { title,description,theme,enabled,data} = body;
    const template_id = v4();
    const bind = [template_id,title,JSON.stringify(theme),description,JSON.stringify(data),enabled,adminuser.username,new Date()];
    const sql = `INSERT INTO template (template_id, title, theme, description, data, enabled,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)`;

    pool.query(sql,bind,(err,result)=>{
        if(err){
            console.log(err);
            logs.add_log(ip,endpoint,`create template ${template_id} by admin ${admin_id}`,err.message);
            return res.send({
                status:false,
                message:err.message
            });
        }
        logs.add_log(ip,endpoint,`create template ${template_id} by admin ${admin_id}`,'template created');
        return res.send({
            status:1,
            message:`template created id:'${template_id}'`
        });
    });
}

const READ_TEMPLATE = async (req,res) => {
    const { adminuser } = req;

    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {admin_id} = adminuser;
    const info = `fetching template by admin : ${admin_id}`;

    const sql = `SELECT * FROM template ORDER BY created_at DESC`;

    pool.query(sql,(err,result) => {
        if(err){
            console.log(err);
            logs.add_log(ip,endpoint,info,err.message);
            return res.send({
                status:0,
                message:err.message
            });
        }

        let templates = [];

        result.forEach(element => {
            const { theme, data} = element;
            templates.push({
                ...element,
                theme:JSON.parse(theme),
                data:JSON.parse(data)
            })
        });

        logs.add_log(ip,endpoint,info,'results fetched');
        return res.send({
            status:1,
            message:templates
        });
    })
}

const UPDATE_TEMPLATE = async (req,res) => {
    const { adminuser,body } = req;

    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {admin_id} = adminuser;
    let info = `updating template id : ${body.template_id} at`;
    
    const { template_id, title, theme, description, data, enabled } = body;
    var sql = `UPDATE template SET`;
    var mid_sql = [];
    var bind = [];
    
    if(title){
        mid_sql.push('title = ?')
        bind.push(title);
        info = `${info} title`;
    }
    if(theme){
        mid_sql.push('theme = ?')
        bind.push(JSON.stringify(theme));
        info = `${info} theme`;

    }
    if(description){
        mid_sql.push('description = ?')
        bind.push(description);
        info = `${info} description`;
    }
    if(data){
        mid_sql.push('data = ?')
        bind.push(JSON.stringify(data));
        info = `${info} data`;
    }
    if(enabled){
        mid_sql.push('enabled = ?')
        bind.push(enabled);
        info = `${info} enabled`;
    }
    info  = `${info} by admin : ${admin_id}`
    sql = `${sql} ${mid_sql.join()} WHERE template_id = ?`;
    bind.push(template_id);

    pool.query(sql,bind,(error) => {
        if(error){
            console.log(error);
            logs.add_log(ip,endpoint,info,error.message);
            return res.send({
                status:0,
                message:error.message
            });
        }

        logs.add_log(ip,endpoint,info,'updated');
        return res.send({
            status:1,
            message:'updated'
        });
    });

}

const DELETE_TEMPLATE = async (req,res) => {
    const { adminuser,body } = req;

    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `deleting template : ${body.template_id} by admin : ${adminuser.username}`;
    
    const sql = `DELETE * FROM template WHERE template_id = ?`;
    const bind = [body.template_id];

    pool.query(sql,bind,(error) => {
        if(error){
            console.log(error);
            logs.add_log(ip,endpoint,info,error.message);
            return res.send({
                status:0,
                message:error.message
            });
        }

        logs.add_log(ip,endpoint,info,'deleted');
        return res.send({
            status:1,
            message:`template id : ${body.template_id} -> deleted`
        });
    })
}

const READ_ONE = async(req,res) => {
    const { adminuser,body } = req;
    const { id }=body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const info = `sending template : ${id} to admin : ${adminuser.username}`;
    
    const sql = `SELECT * FROM template WHERE template_id = ?`;
    const bind = [id];

    pool.query(sql,bind,(error,result)=>{
        if(error){
            // console.log(error);
            logs.add_log(ip,endpoint,info,error.message);
            return res.status(200).json({
                status:false,
                message:error.message
            });
        }
        // console.log(result[0]);
        let data={
            ...result[0],
            theme:JSON.parse(result[0].theme),
            data:JSON.parse(result[0].data)
        }
        logs.add_log(ip,endpoint,info,'sent');
        return res.status(200).json({
            status:true,
            message:'data fetched',
            time:Date.now(),
            data
        });
    })
}

module.exports ={CREATE_TEMPLATE,READ_TEMPLATE,UPDATE_TEMPLATE,DELETE_TEMPLATE,READ_ONE};
