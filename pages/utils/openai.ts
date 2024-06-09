// utils/openai.ts

import axios from 'axios';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { Email, ClassifiedEmail } from '../types';
const OPENAI_API_KEY=`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`

// dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export const classifyEmail = async (email: Email): Promise<ClassifiedEmail> => {
  console.log('API Key:', process.env.OPENAI_API_KEY); // Log the API key to ensure it's loaded correctly

  const prompt = `Classify the following email into one of the following categories: Important, Promotions, Social, Marketing, Spam.\n\nEmail:\n${email.snippet}`;
  let retryCount = 0;
  let output: string = 'Cannot classify'; // Default fallback classification

  while (retryCount < MAX_RETRIES) {
    try {
      const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
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

      console.log('Before Response');
      const response = await axios(config);
      console.log(JSON.stringify(response.data));

      // Extract classification from response
      output = response.data.choices[0]?.message?.content?.trim();
      console.log('Output:', output);

      break; // Exit the retry loop if successful
    } catch (error) {
      //@ts-ignore
      if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES - 1) {
        const delay = BASE_DELAY_MS * Math.pow(2, retryCount) + Math.random() * 1000; // Exponential backoff with jitter
        console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Error generating response from OpenAI:', error);
        break; // Exit the retry loop if unsuccessful
      }
    }

    retryCount++;
  }

  return {
    ...email,
    classification: output,
  };
};
