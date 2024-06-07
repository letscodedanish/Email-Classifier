// utils/openai.ts
import axios from 'axios';

export const classifyEmails = async (emails: any[]) => {
  console.log('Classifying emails...');
  console.log('Emails:', emails);
  const response = await axios.post('/api/classifyEmails', { emails });
  console.log('Classified emails:', response.data);
  return response.data;
};
