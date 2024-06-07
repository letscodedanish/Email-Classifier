import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth'; // Adjust the import path if needed
import type { NextApiRequest, NextApiResponse } from 'next';

const gmail = google.gmail('v1');
const oauth2 = google.oauth2('v2');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Entering fetchEmails API route");

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = session.accessToken;
    console.log('Token:', token);

    if (!token) {
      throw new Error('No access token available');
    }

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: token });

    // Fetch user profile information
    const userInfo = await oauth2.userinfo.get({ auth: oAuth2Client });
    const userId = userInfo.data.id;

    if (!userId) {
      console.error('Failed to get user ID');
      return res.status(500).json({ error: 'Failed to fetch user ID' });
    }

    console.log('User Info:', userInfo);

    const gmailResponse = await gmail.users.messages.list({
      auth: oAuth2Client,
      userId: 'me',
      maxResults: 10,
    });

    if (!gmailResponse.data.messages) {
      return res.status(200).json([]);
    }

    const messages = gmailResponse.data.messages;
    const emails = await Promise.all(
      messages.map(async ({ id }) => {
        if (!id) return null;

        const msg = await gmail.users.messages.get({
          auth: oAuth2Client,
          userId: 'me',
          id,
        });

        return msg.data;
      })
    );
    console.log('Fetched emails:', emails);

    // Filter out any null values in case any messages were skipped
    const filteredEmails = emails.filter(email => email !== null);

    res.status(200).json(filteredEmails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};
