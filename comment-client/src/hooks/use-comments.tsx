import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { CommentData } from '../model/data/comment';

type CommentsContextType = {
  comments: CommentData[];
  setComments: Dispatch<SetStateAction<CommentData[]>>;
};

// Create a context with a default value (optional)
const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

type CommentsProviderProps = {
  children: ReactNode;
};

export const CommentsProvider = ({ children }: CommentsProviderProps) => {
  const [shared, setShared] = useState<CommentData[]>([]);

  return (
    <CommentsContext.Provider value={{ comments: shared, setComments: setShared }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentsProvider');
  }

  return context;
};