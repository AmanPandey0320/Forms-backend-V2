const { CREATE_USER, VERIFY_USER } = require("../services/user");

const sign_up = async (req,res) => {
    const {google_token,name} = req.body;
    CREATE_USER({google_token,name},(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }

        return res.json(result.msg);

    });
}

const sign_in = async (req,res) => {
    
    const {google_token} = req.body;
    VERIFY_USER(google_token,(err,result)=>{
        if(err){
            return res.status(err.status).json(err);
        }

        return res.json(result.msg);

    });
}

module.exports = { sign_up,sign_in }