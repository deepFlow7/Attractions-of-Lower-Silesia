const db = require('../../DB/db_api');

exports.challenges = async (req, res) => {
    try {
        var challenges = await db.getChallenges();
        res.json(challenges);
    } catch (error) {
        console.log('Error fetching challenges: ' + error);
        res.status(500).json({ error: 'Error fetching challenges:' + error });
    }
};

exports.completed = async (req, res) => {
    try {
        var challenges = await db.getCompletedChallenges(req.session.user.id);
        res.json(challenges);
    }
    catch (error) {
        console.log('Error fetching completed challenges: ' + error);
        res.status(500).json({ error: 'Error fetching completed challenges:' + error });
    }
};

exports.inProgress = async (req, res) => {
    try {
        var challenges = await db.getInProgressChallenges(req.session.user.id);
        res.json(challenges);
    } catch (error) {
        console.log('Error fetching in-progress challenges: ' + error);
        res.status(500).json({ error: 'Error fetching in-progress challenges: ' + error });
    }
};

exports.new = async (req, res) => {
    const { newChallenge } = req.body;
    try {
        db.addChallenge(newChallenge);
        res.json({ success: true });
    } catch (error) {
        console.error('Error while saving challenge:', error);
        res.status(500).json({ success: false, error: error });
    }
};
