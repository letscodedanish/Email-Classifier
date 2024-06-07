import React from 'react';

interface EmailDetailProps {
  email: {
    id: string;
    snippet: string;
    subject: string;
    from: string;
    classification: string;
    body: string;
    date: string;
  };
  onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
  return (
    <div className="p-4 bg-white shadow rounded h-full max-h-screen overflow-hidden">
      <button onClick={onBack} className="text-blue-500 mb-4">Back</button>
      <h2 className="text-lg font-bold mb-2 text-black">{email.subject}</h2>
      <div className="text-sm text-gray-500 mb-2">
        <span>From: <span className="text-black">{email.from}</span></span><br />
        <span>Date: <span className="text-black">{email.date}</span></span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Category: {email.classification}</p>
      <hr className="my-4" />
      <div className="mt-4 text-black whitespace-pre-wrap overflow-auto max-h-[60vh]">
        {email.body}
      </div>
    </div>
  );
};

export default EmailDetail;
