const db = require("../../DB/db_api");

exports.approve = async (req, res) => {
  try {
    const result = await db.approveComment(req.params.commentId, req.session.user.id);
    res.json({ success: true, result: result });
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.disapprove = async (req, res) => {
  try {
    const result = await db.disapproveComment(req.params.commentId, req.session.user.id);
    res.json({ success: true, result: result });
  } catch (error) {
    console.error('Error disapproving comment:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeApproval = async (req, res) => {
  try {
    const result = await db.removeApproval(req.params.commentId, req.session.user.id);
    res.json({ success: true, result: result });
  } catch (error) {
    console.error('Error removing approval:', error);
    res.status(500).json({ error: error.message });
  }
};