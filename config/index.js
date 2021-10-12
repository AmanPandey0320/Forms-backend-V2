const util = require("util");
const pool = require("./db");

const queryDB = util.promisify(pool.query);

module.exports = { queryDB };
