const { v4 } = require("uuid");
const query = require("../../database/Query/sessions");
const pool = require("../../config/db");



/**
 * @todo implement the middle ware
 * @middleware
 * @description checks whether the session is valid
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const IS_VALID_SESSION = async (req,res,next) => {
    const { akp_form_session_id } = req.cookies;
    try {
        const sql = query.SELECT_SESSION;
        const bind = [akp_form_session_id];
        pool.query(sql,bind,(err,result) => {

        })
    } catch (error) {
        
    }
}