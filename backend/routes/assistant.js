const express = require('express');
const OpenAI = require('openai');
const { searchAllPlatforms } = require('../services/multiSourceSearch');
const { parseLearningIntent } = require('../services/platformRanker');
const auth = require('../middleware/auth');
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    // First detect intent category
    const intentResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Classify intent as "learn", "emotional_support", "productivity_advice", "general_chat". Reply only with the category.' },
        { role: 'user', content: message }
      ],
      max_tokens: 20,
      temperature: 0
    });
    const intent = intentResponse.choices[0].message.content.trim().toLowerCase();
    
    if (intent === 'learn') {
      // Parse deeper learning preferences
      const learningPrefs = await parseLearningIntent(message, openai);
      const courses = await searchAllPlatforms(message, learningPrefs);
      return res.json({ type: 'courses', data: courses, prefs: learningPrefs });
    } 
    else if (intent === 'emotional_support') {
      const supportRes = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a compassionate life coach. Provide emotional support and encouragement.' },
          { role: 'user', content: message }
        ]
      });
      return res.json({ type: 'advice', data: supportRes.choices[0].message.content });
    }
    else {
      const generalRes = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      });
      return res.json({ type: 'general', data: generalRes.choices[0].message.content });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;