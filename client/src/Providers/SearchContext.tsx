import React, { createContext, useState, useContext } from 'react';

interface Context{
    search: string,
    setSearch: (new_str:string)=>void
}

const SearchContext = createContext({} as Context);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch } as Context}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
