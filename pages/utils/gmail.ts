import { Email } from '../types'; // Ensure the correct path

export const parseEmails = (emailData: any[]): Email[] => {
  return emailData.map(email => {
    const headers = email.payload.headers;
    const subject = headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
    const from = headers.find((header: any) => header.name === 'From')?.value || 'Unknown Sender';
    const date = new Date(parseInt(email.internalDate)).toLocaleString();

    let body = '';
    if (email.payload.parts) {
      const part = email.payload.parts.find((p: any) => p.mimeType === 'text/plain');
      body = part ? atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/')) : 'No Content';
    } else {
      body = email.payload.body.data ? atob(email.payload.body.data.replace(/-/g, '+').replace(/_/g, '/')) : 'No Content';
    }

    // Truncate the body to the first 500 characters
    const truncatedBody = body.length > 500 ? `${body.substring(0, 500)}...` : body;

    return {
      id: email.id,
      snippet: email.snippet,
      subject,
      from,
      classification: 'General', // Default classification, will be updated later
      body: truncatedBody,
      date
    };
  });
};
