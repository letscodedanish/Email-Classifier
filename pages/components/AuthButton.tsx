// components/AuthButton.tsx
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4 mr-4"
      >
        Sign Out
      </button>
    );
  }
  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      Sign In with Google
    </button>
  );
};

export default AuthButton;
