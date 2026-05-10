import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AdvancedModeContext = createContext({ advanced: false, setAdvanced: () => {} });

export function AdvancedModeProvider({ children }) {
  const [advanced, setAdvanced] = useLocalStorage('composeit.advancedMode', false);
  return (
    <AdvancedModeContext.Provider value={{ advanced, setAdvanced }}>
      {children}
    </AdvancedModeContext.Provider>
  );
}

export const useAdvancedMode = () => useContext(AdvancedModeContext);
