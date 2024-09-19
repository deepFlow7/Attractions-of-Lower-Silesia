const db = require('../../DB/db_api');

exports.login = async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await db.checkLogin(login, password);
        const { user, check } = result;

        if (!check) {
            throw 'Invalid password';
        }
        req.session.login = login;
        req.session.role = user.role;
        req.session.user = await db.getUser(user.user_id);
        req.session.blocked = await db.isUserBlocked(user.user_id);
        res.json({ authenticated: true });
    } catch (error) {
        res.status(401).json({ error: error });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
};

exports.signup = async (req, res) => {
    const { newUser } = req.body;
    try {
        await db.signUp(newUser);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error });
    }
};

exports.profile = async (req, res) => {
    if (req.session.user) {
        res.json({
            authenticated: true,
            blocked: req.session.blocked,
            user: req.session.user,
            username: req.session.login,
            role: req.session.role
        });
    } else {
        res.json({ authenticated: false });
    }
};