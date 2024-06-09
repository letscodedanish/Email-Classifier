import React from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut hooks
import AuthButton from '../pages/components/AuthButton';
import EmailList from '../pages/components/EmailList';
import EmailDetail from '../pages/components/EmailDetail';
import { parseEmails } from '../pages/utils/gmail';
import {classifyEmail} from '../pages/utils/openai'; // Import classifyEmail function
import { Email } from './types'; // Import the unified Email type
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession(); // Use useSession hook to get the session
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [emailContent, setEmailContent] = useState<Email | null>(null);

  useEffect(() => {
    if (session) {
      const fetchEmails = async () => {
        try {
          console.log('Fetching emails...');
          const response = await axios.get('/api/fetchEmails');
          console.log('Fetched emails:', response.data);
          const parsedEmails = parseEmails(response.data);
    
          setEmails(parsedEmails); // Set the parsed emails without classification
        } catch (err) {
          console.error('Failed to fetch emails:', err);
          setError('Failed to fetch emails. Please try again later.');
        }
      };
      fetchEmails();
    }
  }, [session]);

  const handleEmailClick = async (email: Email) => {
    let htmlContent: any = [];
    // htmlContent = findHtmlPart(email?.payload?.parts);

    console.log(htmlContent);
    setEmailContent(email);
    setSelectedEmail(email);

    try {
      const classifiedEmail = await classifyEmail(email);
      setSelectedEmail(classifiedEmail); // Update the selected email with its classification
    } catch (err) {
      console.error('Failed to classify email:', err);
      setError('Failed to classify email. Please try again later.');
    }
  };

  const handleBack = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {session && session.user && (
          <div className="flex items-center">
            <img
              //@ts-ignore
              src={session.user.image}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-md font-semibold">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
        )}
        <div>
          <AuthButton />
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Email Classifier</h1>
      {error && <p className="text-red-500">{error}</p>}
      {session && !selectedEmail && (
        <>
          <EmailList emails={emails} onEmailClick={handleEmailClick} />
        </>
      )}
      {session && selectedEmail && (
        //@ts-ignore
        <EmailDetail email={selectedEmail} onBack={handleBack} />
      )}
    </div>
  );
}
