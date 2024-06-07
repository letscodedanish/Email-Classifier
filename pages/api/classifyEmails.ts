import { OpenAI } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize OpenAI client correctly
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIResponse {
  choices: { message: { content: string }[] }[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Into Classifying emails...');
  const { emails } = req.body;
  console.log('we got the Emails');

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OpenAI API key');
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    console.log('Classifying emails in try block');
    const classifiedEmails = await Promise.all(
      emails.map(async (email: any) => {
        console.log('snippet email:', email.snippet);
        const prompt = `Classify the following email:\n\n${email.snippet}`;
        console.log('Prompt:', prompt);
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 60,
          });
          console.log('Classified Response:', response);
          const content = response.choices[0]?.message?.content?.trim() || ''; // Add null check and default value
          return {
            ...email,
            classification: content,
          };
        } catch (openaiError) {
          console.error('Error from OpenAI API for email:', email.id, openaiError);
          throw new Error(`Failed to classify email with ID: ${email.id}`);
        }
      })
    );

    res.status(200).json(classifiedEmails);
  } catch (error) {
    console.error('Error classifying emails:', error);
    //@ts-ignore
    res.status(500).json({ error: 'Failed to classify emails', details: error.message });
  }
};
