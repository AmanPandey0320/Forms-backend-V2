const query = {
    CREATE_SESSION : "INSERT INTO sessions (id,uid,last_login,first_ip,last_ip) VALUES (?,?,?,?,?)",
    DESTROY_SESSION : "UPDATE sessions SET active = ?, logout_time = ? WHERE id = ?",
    SELECT_SESSION : "SELECT * FROM sessions WHERE id = ?",
    REFRESH_SESSION:"UPDATE sessions SET last_login = ?, last_ip = ? WHERE id = ?",
}

module.exports = query;