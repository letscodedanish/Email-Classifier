import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Email {
  id: string;
  snippet: string;
}

interface ClassifiedEmail extends Email {
  classification: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emails }: { emails: Email[] } = req.body;

  if (!emails) {
    return res.status(400).json({ error: 'Emails are required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const MAX_RETRIES = 1;
  let retryCount = 0;

  try {
    const classifiedEmails: ClassifiedEmail[] = await Promise.all(
      emails.map(async (email) => {
        const prompt = `Classify the following email into one of the following categories: Important, Promotions, Social, Marketing, Spam.\n\nEmail:\n${email.snippet}`;

        let output: string = '';

        while (retryCount < MAX_RETRIES) {
          try {
            const data = JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Who won the world series in 2020?' },
                { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
                { role: 'user', content: prompt },
              ],
            });

            const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://api.openai.com/v1/chat/completions',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              data: data,
            };

            const response = await axios(config);

            console.log('Inside Response');
            console.log(JSON.stringify(response.data));

            // Extract classification from response
            output = response.data.choices[0]?.message?.content;

            break; // Exit the retry loop if successful
          } catch (error) {
            //@ts-ignore
            if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
              const delay = Math.pow(2, retryCount) * 1000;
              console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);

              await new Promise((resolve) => setTimeout(resolve, delay));

              retryCount++;
            } else {
              console.error('Error generating response from OpenAI:', error);
              output = 'Cannot classify'; // Fallback classification
              break; // Exit the retry loop if unsuccessful
            }
          }
        }

        return {
          ...email,
          classification: output,
        };
      })
    );

    res.status(200).json(classifiedEmails);
    console.log('Classified emails');
  } catch (error) {
    console.error('Error classifying emails:', error);
    res.status(500).json({ error: 'Failed to classify emails', details: (error as Error).message });
  }
}
