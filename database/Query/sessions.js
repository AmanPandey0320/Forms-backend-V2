const query = {
    CREATE_SESSION : "INSERT INTO sessions (id,uid,last_login) VALUES (?,?,?)",
    DESTROY_SESSION : "UPDATE sessions SET active = ?, logout_time = ? WHERE id = ?",
    SELECT_SESSION : "SELECT * FROM sessions WHERE id = ?"
}

module.exports = query;