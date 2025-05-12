
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Playground } from '@/components/Playground';
import { AuthProvider } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for stored user data on load
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // In a real app, this would validate the session with the server
        setIsLoaded(true);
      } else {
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Playground />
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          AI Language Model Playground
        </h1>
        <p className="text-gray-600">
          Compare responses from different AI models and track your interactions
        </p>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-gray-500">
        Note: This is a demo app. Any email/password combination will work.
      </p>
    </div>
  );
};

export default Index;
