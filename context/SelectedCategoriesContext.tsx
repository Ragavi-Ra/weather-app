import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
type SelectedCategoriesContextType = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

// Create the context
const SelectedCategoriesContext = createContext<SelectedCategoriesContextType | undefined>(undefined);

// Provider component
export const SelectedCategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <SelectedCategoriesContext.Provider value={{ selectedCategories, setSelectedCategories }}>
      {children}
    </SelectedCategoriesContext.Provider>
  );
};

// Custom hook for easier access
export const useSelectedCategories = () => {
  const context = useContext(SelectedCategoriesContext);
  if (!context) {
    throw new Error('useSelectedCategories must be used within a SelectedCategoriesProvider');
  }
  return context;
};
