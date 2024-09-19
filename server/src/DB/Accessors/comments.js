const pool = require('../pool');

exports.newComment = async (author, content, attraction) => {
  try {
    const { rows } = await pool.query('INSERT INTO comments (author, content, attraction) \
              VALUES ($1, $2, $3) RETURNING id',
      [author, content, attraction]);
    return rows[0].id;
  } catch (error) {
    console.error('Error creating new comment:', error);
    throw error;
  }
}

exports.getCommentsByAttraction = async (attractionId, userId) => {
  try {
    const { rows } = await pool.query('SELECT id, logins.login AS author, content, attraction, vote_sum, comment_approvals.approval_status \
       FROM comments JOIN logins ON comments.author = logins.user_id \
       LEFT JOIN comment_approvals ON comment_approvals.comment_id = comments.id AND comment_approvals.voter = $2 \
       WHERE attraction = $1', [attractionId, userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

exports.getCommentsByUser = async (author) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments WHERE author = $1', [author]);
    return rows;
  } catch (error) {
    console.error('Error fetching comments by user:', error);
    throw error;
  }
}

exports.editComment = async (id, content) => {
  try {
    await pool.query('UPDATE comments SET content = $1 WHERE id = $2', [content, id]);
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

exports.deleteComment = async (id) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

exports.approveComment = async (commentId, voterId) => {
  try {
    await pool.query(`
      INSERT INTO comment_approvals (comment_id, voter, approval_status)
      VALUES ($1, $2, 'approve')
      ON CONFLICT (comment_id, voter)
      DO UPDATE SET approval_status = 'approve'`,
      [commentId, voterId]
    );
  } catch (error) {
    console.error('Error approving comment:', error);
    throw error;
  }
}

exports.disapproveComment = async (commentId, voterId) => {
  try {
    await pool.query(`
      INSERT INTO comment_approvals (comment_id, voter, approval_status)
      VALUES ($1, $2, 'disapprove')
      ON CONFLICT (comment_id, voter)
      DO UPDATE SET approval_status = 'disapprove'`,
      [commentId, voterId]
    );
  } catch (error) {
    console.error('Error disapproving comment:', error);
    throw error;
  }
}

exports.removeApproval = async (commentId, voterId) => {
  try {
    await pool.query(`
      DELETE FROM comment_approvals
      WHERE comment_id = $1 AND voter = $2`,
      [commentId, voterId]
    );
  } catch (error) {
    console.error('Error removing approval:', error);
    throw error;
  }
}