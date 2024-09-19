import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ColorContextInterface {
  toggleTheme: () => void;
  colors: { [key: string]: string | boolean };
}

const ColorContext = createContext<ColorContextInterface | undefined>(undefined);

const initial_colors = {
  is_contrast: false,
  primary: '#e9cbb0',
  secondary: '#4d6e6d',
  tertiary: '#B45834',
  white: '#fff',
  dark: '#2a2b2a',
  gray: '#949494',
  light_gray: '#d7c8cb',
};

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [colors, setColors] = useState(initial_colors);

  const setContrastTheme = () => {
    setColors({
      ...initial_colors,
      primary: '#fff',
      secondary: '#000',
      tertiary: '#888',
      is_contrast: true,
    });
  };

  const toggleTheme = () => {
    if (colors.is_contrast) {
      setColors(initial_colors);
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
  