import { Email } from '../types'; // Ensure the correct path

export const parseEmails = (emailData: any[]): Email[] => {
  return emailData.slice(0, 15).map(email => {
    const headers = email.payload.headers;
    const subject = headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
    const from = headers.find((header: any) => header.name === 'From')?.value || 'Unknown Sender';
    const date = new Date(parseInt(email.internalDate)).toLocaleString();

    let body = '';
    if (email.payload.parts) {
      const part = email.payload.parts.find((p: any) => p.mimeType === 'text/plain');
      body = part ? Buffer.from(part.body.data, 'base64').toString() : 'No Content';
    } else {
      body = email.payload.body.data ? Buffer.from(email.payload.body.data, 'base64').toString() : 'No Content';
    }

    // Truncate the body to the first 500 characters
    const truncatedBody = body.length > 500 ? `${body.substring(0, 500)}...` : body;
    const output = {
      id: email.id,
      snippet: email.snippet,
      subject,
      from,
      classification: 'General', // Default classification, will be updated later
      body: truncatedBody,
      date
    };
    localStorage.setItem(email.id, JSON.stringify(output));
    return {
      ...output,
    };
  });
};
