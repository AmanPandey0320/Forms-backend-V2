const query = {
    UPDATE_TEMPLATE_COUNT:"UPDATE template SET uses = uses+1 WHERE template_id = ?",
    CREATE_FORM:"INSERT INTO akp_forms (who) VALUES (?)",
}

module.exports = query;