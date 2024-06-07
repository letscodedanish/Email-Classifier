import React from 'react';

interface EmailItemProps {
  email: {
    id: string;
    snippet: string;
    subject: string;
    from: string;
    classification: string;
    date: string; // Add the 'date' property
  };
  onClick: (email: EmailItemProps['email']) => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, onClick }) => {
  return (
    <div 
      className="p-4 bg-white shadow rounded cursor-pointer flex flex-col justify-between" 
      onClick={() => onClick(email)}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold  text-black">{email.from}</h2>
        <p className="text-sm text-white bg-blue-500 px-2 py-1 rounded">{email.classification}</p>
      </div>
      <div>
        <p className="text-sm text-gray-900 mb-2">Subject: {email.subject}</p>
      </div>
      <div className="text-sm text-gray-500">
        <span>From: <span className="text-black">{email.from}</span></span><br />
        <span>Date: <span className="text-black">{email.date}</span></span>
      </div>
    </div>
  );
};

export default EmailItem;
