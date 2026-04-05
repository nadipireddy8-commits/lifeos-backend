// Helper to parse user intent from natural language
async function parseLearningIntent(query, openai) {
  const prompt = `Analyze the user's learning request: "${query}". 
  Return a JSON object with these fields:
  - "freeOnly": true/false (if user mentions free, no cost)
  - "certificate": true/false (if wants certificate or degree)
  - "quick": true/false (if wants fast tutorial or crash course)
  Only output valid JSON, no extra text.`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" }
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { parseLearningIntent };