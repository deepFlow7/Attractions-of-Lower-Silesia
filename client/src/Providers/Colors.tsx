import { createContext, ReactNode, useContext, useState } from 'react';

interface ColorContextInterface {
  toggleTheme: () => void;
  colors: { [key: string]: string | boolean };
}

const ColorContext = createContext<ColorContextInterface | undefined>(undefined);

const initialColor = {
  isContast: false,
  primary: '#e9cbb0',
  secondary: '#4d6e6d',
  tertiary: '#B45834',
  white: '#fff',
  dark: '#2a2b2a',
  gray: '#949494',
  light_gray: '#d7c8cb',
};

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [colors, setColors] = useState(initialColor);

  const setContrastTheme = () => {
    setColors({
      ...initialColor,
      primary: '#fff',
      secondary: '#000',
      tertiary: '#888',
      isContast: true,
    });
  };

  const toggleTheme = () => {
    if (colors.isContast) {
      setColors(initialColor);
    } else {
      setContrastTheme();
    }
  };

  return (
    <ColorContext.Provider value={{ toggleTheme, colors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};
export interface ContrastProps {
  colors: { [key: string]: string | boolean };
}
