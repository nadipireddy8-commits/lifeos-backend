const express = require('express');
const Action = require('../models/Action');
const auth = require('../middleware/auth');
const { detectEmotion } = require('../services/sentiment');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { actionText, category, emotion, source, metadata } = req.body;
    const action = new Action({ userId: req.userId, actionText, category, emotion, source, metadata });
    await action.save();
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/analyze-message', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const emotion = await detectEmotion(text);
    const action = new Action({
      userId: req.userId,
      actionText: `Message: "${text.substring(0, 100)}"`,
      category: 'emotional',
      emotion: emotion,
      source: 'auto_message'
    });
    await action.save();
    res.json({ emotion, actionId: action._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const actions = await Action.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(parseInt(limit));
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;