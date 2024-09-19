const db = require('../../DB/db_api');

exports.info = async (req, res) => {
    try {
        var challenge = await db.getChallenge(req.params.challengeId);
        var attractions = await db.getChallengeAttractions(req.params.challengeId);
        res.json({ ...challenge, attractions: attractions });
    } catch (error) {
        console.log('Error fetching challenge info: ' + error);
        res.status(500).json({ error: 'Error fetching challenge info: ' + error });
    }
};

exports.ranking = async (req, res) => {
    try {
        var rankings = await db.getChallengeRanking(req.params.challengeId);
        res.json(rankings);
    } catch (error) {
        console.log('Error fetching rankings: ' + error);
        res.status(500).json({ error: 'Error fetching rankings: ' + error });
    }
};

exports.start = async (req, res) => {
    try {
        await db.startChallenge(req.params.challengeId, req.session.user.id);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error });
    }
};

exports.userParticipates = async (req, res) => {
    try {
        const rows = await db.takesPartInChallenge(req.session.user.id, req.params.challengeId);
        res.json(rows.length > 0);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.visit = async (req, res) => {
    try {
        await db.visitChallengeAttraction(req.session.user.id, req.params.challengeId,
            req.params.attractionId);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error });
    }
};

exports.visited = async (req, res) => {
    try {
        const rows = await db.getVisitedChallengeAttractions(req.session.user.id, req.params.challengeId);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.delete = async (req, res) => {
    try {
        await db.deleteChallenge(req.params.challengeId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    const { newName } = req.body;
    try {
        await db.changeChallengeName(req.params.challengeId, newName);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};