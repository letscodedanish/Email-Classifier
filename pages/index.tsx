import React from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut hooks
import AuthButton from '../pages/components/AuthButton';
import EmailList from '../pages/components/EmailList';
import EmailDetail from '../pages/components/EmailDetail';
import { parseEmails } from '../pages/utils/gmail';
import { classifyEmails } from '../pages/utils/openai'; // Import classifyEmails function
import { Email } from './types'; // Import the unified Email type
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession(); // Use useSession hook to get the session
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

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

  const handleClassify = async () => {
    try {
      const classifiedEmails = await classifyEmails(emails);
      setEmails(classifiedEmails);
    } catch (err) {
      console.error('Failed to classify emails:', err);
      setError('Failed to classify emails. Please try again later.');
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
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
          {session && (
            <button
            onClick={handleClassify}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Classify Emails
          </button>
          )}
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
