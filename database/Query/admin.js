const query = {
    UPDATE_ADMIN:"UPDATE admin SET admin.username = COALESCE(?,admin.username),admin.password = COALESCE(?,admin.password) WHERE admin.admin_id = ?",
    TOGGLE_ADMIN:"UPDATE admin SET admin.enabled = ? WHERE admin.admin_id = ?"
}

module.exports = query