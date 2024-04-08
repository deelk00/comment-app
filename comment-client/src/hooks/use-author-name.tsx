import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type AuthorNameContextType = {
  authorName: string;
  setAuthorName: Dispatch<SetStateAction<string>>;
};

// Create a context with a default value (optional)
const AuthorNameContext = createContext<AuthorNameContextType | undefined>(undefined);

type AuthorNameProviderProps = {
  children: ReactNode;
};

export const AuthorNameProvider = ({ children }: AuthorNameProviderProps) => {
  const [sharedString, setSharedString] = useState<string>('');

  return (
    <AuthorNameContext.Provider value={{ authorName: sharedString, setAuthorName: setSharedString }}>
      {children}
    </AuthorNameContext.Provider>
  );
};

export const useAuthorName = (): AuthorNameContextType => {
  const context = useContext(AuthorNameContext);
  
  if (context === undefined) {
    throw new Error('useAuthorName must be used within a AuthorNameProvider');
  }

  return context;
};