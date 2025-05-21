import React, { createContext, useContext, useState, ReactNode } from 'react';

type TemperatureContextType = {
  isCelsius: boolean;
  setIsCelsius: React.Dispatch<React.SetStateAction<boolean>>;
};

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};

export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  return (
    <TemperatureContext.Provider value={{ isCelsius, setIsCelsius }}>
      {children}
    </TemperatureContext.Provider>
  );
};
