const db = require("../../DB/db_api");


exports.attractions = async (req, res) => {
    try {
        var attractions = await db.getAttractions();
        res.json(attractions);
    } catch (error) {
        console.log('Error fetching attractions: ' + error);
        res.status(500).json({ error: 'Error fetching attractions: ' + error });
    }
};

exports.new = async (req, res) => {
    const { newAttraction } = req.body;
    const { name, coords, type, subtype, interactivity, timeItTakes, description, photos } = newAttraction;
    try {
        const attrId = await db.newAttraction(name, coords, type, subtype, interactivity,
            timeItTakes, 0.0, description);

        for (const photo of photos) {
            try {
                await db.newPhoto(attrId, photo.photo, photo.caption);
            } catch (error) {
                let message = 'Error while saving photo:' + error;
                console.error(message);
                throw message;
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error while saving attraction:', error);
        res.json({ success: false, error: error });
    }
};

exports.favourites = async (req, res) => {
    try {
        const favourites = await db.getFavouriteAttractions(req.session.user.id);
        res.json(favourites);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching favourite attractions' });
    }
};

exports.toVisit = async (req, res) => {
    try {
        const toVisit = await db.getWantsToVisitAttractions(req.session.user.id);
        res.json(toVisit);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching list of to visit attractions' });
    }
};
