import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function generateChatResponse(prompt: string) {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}
