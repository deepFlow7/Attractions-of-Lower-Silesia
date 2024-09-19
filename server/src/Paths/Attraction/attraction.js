const db = require("../../DB/db_api");

exports.attraction = async (req, res) => {
  try {
    var attraction = await db.getAttraction(req.params.attractionId);
    var photos = await db.getPhotosByAttraction(req.params.attractionId);
    var comments = await db.getCommentsByAttraction(req.params.attractionId, req.session.user ? req.session.user.id : null);
    res.json({ attraction: { ...attraction, photos }, comments: comments });
  } catch (error) {
    console.log('Error fetching attraction: ' + error);
    res.status(500).json({ error: 'Error fetching attraction: ' + error });
  }
};

exports.isFavourite = async (req, res) => {
  try {
    const favourite = await db.isFavourite(req.params.attractionId, req.session.user.id);
    res.json({ favourite: favourite });
  } catch (error) {
    console.error('Error fetching attraction data: ' + error);
    res.status(500).json({ error: 'Error fetching attraction data: ' + error });
  }
};

exports.toVisit = async (req, res) => {
  try {
    const toVisit = await db.isToVisit(req.params.attractionId, req.session.user.id);
    res.json({ toVisit: toVisit });
  } catch (error) {
    console.error('Error fetching attraction data: ' + error);
    res.status(500).json({ error: 'Error fetching attraction data: ' + error });
  }
};

exports.rating = async (req, res) => {
  try {
    const rating = await db.getRating(req.params.attractionId);
    res.json({ rating: rating });
  } catch (error) {
    console.error('Error fetching attraction rating: ' + error);
    res.status(500).json({ error: 'Error fetching attraction rating: ' + error });
  }
};

exports.userRating = async (req, res) => {
  try {
    const rating = await db.getUserRating(req.session.user.id, req.params.attractionId);
    res.json({ rating: rating });
  } catch (error) {
    console.error('Error fetching user rating for attraction: ' + error);
    res.status(500).json({ error: 'Error fetching user rating for attraction: ' + error });
  }
};

exports.changeRating = async (req, res) => {
  const { newRating } = req.body;
  try {
    await db.addOrUpdateRating(req.session.user.id, req.params.attractionId, newRating);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeFavourite = async (req, res) => {
  try {
    await db.changeFavourites(req.session.user.id, req.params.attractionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeToVisit = async (req, res) => {
  try {
    await db.changeWantsToVisit(req.session.user.id, req.params.attractionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.deleteAttraction(req.params.attractionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { newName } = req.body;
  try {
    await db.changeAttractionName(req.params.attractionId, newName);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};