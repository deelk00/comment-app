import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { CommentData } from '../model/comment';

type CommentsContextType = {
  comments: CommentData[];
  setComments: Dispatch<SetStateAction<CommentData[]>>;
  setOptimistic: (item: CommentData) => number;
  overrideOptimistic: (optimisticId: number, realItem?: CommentData) => void;
};

// Create a context with a default value (optional)
const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

type CommentsProviderProps = {
  children: ReactNode;
};

export const CommentsProvider = ({ children }: CommentsProviderProps) => {
  const [shared, setShared] = useState<CommentData[]>([]);
  
  const optimisticUpdate = (item: CommentData) => {
    item.id = Date.now();
    item.likes = 0;
    setShared([item, ...shared]);
    return item.id;
  };

  const overrideOptimistic = (optimisticItemId: number, realItem?: CommentData) => {

    const arr = shared.filter(item => item.id !== optimisticItemId);
    if (realItem) {
      arr.unshift(realItem);
    }
    setShared(arr);
  }

  return (
    <CommentsContext.Provider value={{ comments: shared, setComments: setShared, setOptimistic: optimisticUpdate, overrideOptimistic: overrideOptimistic }}>
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