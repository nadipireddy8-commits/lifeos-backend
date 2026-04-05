const express = require('express');
const Action = require('../models/Action');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const actions = await Action.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(100);
    const total = actions.length;
    const productive = actions.filter(a => a.category === 'productive').length;
    const productivityScore = total === 0 ? 0 : (productive / total) * 100;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEmotions = actions.filter(a => a.timestamp >= sevenDaysAgo && a.emotion);
    const emotionCounts = {};
    recentEmotions.forEach(a => { emotionCounts[a.emotion] = (emotionCounts[a.emotion] || 0) + 1; });

    res.json({
      productivityScore: Math.round(productivityScore),
      totalActions: total,
      emotionTrend: emotionCounts,
      topCategories: actions.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;