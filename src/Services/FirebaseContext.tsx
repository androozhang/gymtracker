import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Define the context type
interface FirebaseContextProps {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
}

// Define the props for the FirebaseProvider component
interface FirebaseProviderProps {
  children: ReactNode;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

// Create the provider component
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(userState => {
      setUser(userState);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loading]);

  const value = { user, loading };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Create a custom hook for using the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
