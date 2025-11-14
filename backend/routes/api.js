const express = require('express');
const { ObjectId } = require('mongodb');

function createApiRouter(db) {
  const router = express.Router();

  const lessonsCollection = db.collection('lessons');
  const ordersCollection = db.collection('orders');

  // ---- GET /api/lessons ----
  router.get('/lessons', async (req, res) => {
    try {
      const lessons = await lessonsCollection.find({}).toArray();
      res.json(lessons);
    } catch (err) {
      console.error('Error getting lessons:', err);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  });

  // (we will add ORDER + PUT routes here later, slowly)

  return router;
}

module.exports = createApiRouter;
