const db = require("../../DB/db_api");

exports.add = async (req, res) => {
  const { author, content, attraction } = req.body;
  try {
    const id = await db.newComment(author, content, attraction);
    res.json({ success: true, id: id });
  } catch (error) {
    console.error('Error adding new comment:', error);
    res.status(500).json({ error: error.message });
  }
};
