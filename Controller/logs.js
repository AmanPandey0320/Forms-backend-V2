const {get_log} = require('../api/services/logs');
const logs = require('../api/services/logs')

const GET_LOGS = async (req,res) => {
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {admin_id} = req.adminuser;
    const info = `fetching logs for admin : ${admin_id}`
    try {

        const log = await get_log();
        logs.add_log(ip,endpoint,info,`logs fetched`);
        res.send(log);
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
}

module.exports = { GET_LOGS }