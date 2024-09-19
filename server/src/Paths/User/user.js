const db = require('../../DB/db_api');

exports.block = async (req, res) => {
    try {
        await db.blockUser(req.params.userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unblock = async (req, res) => {
    try {
        await db.unblockUser(req.params.userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.isBlocked = async (req, res) => {
    try {
        const blocked = await db.isUserBlocked(req.params.userId);
        res.json({ blocked: blocked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};