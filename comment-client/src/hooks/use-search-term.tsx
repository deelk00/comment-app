import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type SearchTermContextType = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

// Create a context with a default value (optional)
const SearchTermContext = createContext<SearchTermContextType | undefined>(undefined);

type SearchTermProviderProps = {
  children: ReactNode;
};

export const SearchTermProvider = ({ children }: SearchTermProviderProps) => {
  const [sharedSearchTerm, setSearchTerm] = useState<string>('');
  
  return (
    <SearchTermContext.Provider value={{ searchTerm: sharedSearchTerm, setSearchTerm: setSearchTerm }}>
      {children}
    </SearchTermContext.Provider>
  );
};

export const useSearchTerm = (): SearchTermContextType => {
  const context = useContext(SearchTermContext);
  
  if (context === undefined) {
    throw new Error('useSearchTerm must be used within a AuthorNameProvider');
  }

  return context;
};