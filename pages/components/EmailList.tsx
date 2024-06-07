import React from 'react';
import EmailItem from './EmailItem'; // Adjust the path if necessary
import { Email } from '../types'; // Adjust the path if necessary

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onEmailClick }) => {
  // Divide emails into two columns
  const middleIndex = Math.ceil(emails.length / 2);
  const leftEmails = emails.slice(0, middleIndex);
  const rightEmails = emails.slice(middleIndex);

  return (
    <div className="flex space-x-4">
      <div className="w-1/2 space-y-4">
        {leftEmails.map((email) => (
          //@ts-ignore
          <EmailItem key={email.id} email={email} onClick={onEmailClick} />
        ))}
      </div>
      <div className="w-1/2 space-y-4">
        {rightEmails.map((email) => (
          //@ts-ignore
          <EmailItem key={email.id} email={email} onClick={onEmailClick} />
        ))}
      </div>
    </div>
  );
};

export default EmailList;
