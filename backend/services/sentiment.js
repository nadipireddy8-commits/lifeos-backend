const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function detectEmotion(text) {
  try {
    const prompt = `Analyze the emotion of this message: "${text}". Reply with exactly one word from: happy, sad, angry, neutral, stressed, excited.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0
    });
    let emotion = response.choices[0].message.content.trim().toLowerCase();
    const valid = ['happy', 'sad', 'angry', 'neutral', 'stressed', 'excited'];
    if (!valid.includes(emotion)) emotion = 'neutral';
    return emotion;
  } catch (err) {
    console.error('Emotion detection failed:', err);
    return 'neutral';
  }
}

module.exports = { detectEmotion };