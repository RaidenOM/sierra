import { createContext } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(0, 70, 250)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(221, 225, 255)',
    onPrimaryContainer: 'rgb(0, 18, 87)',
    secondary: 'rgb(90, 93, 114)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(223, 225, 249)',
    onSecondaryContainer: 'rgb(23, 27, 44)',
    tertiary: 'rgb(118, 84, 110)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 215, 243)',
    onTertiaryContainer: 'rgb(45, 18, 40)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(254, 251, 255)',
    onBackground: 'rgb(27, 27, 31)',
    surface: 'rgb(254, 251, 255)',
    onSurface: 'rgb(27, 27, 31)',
    surfaceVariant: 'rgb(227, 225, 236)',
    onSurfaceVariant: 'rgb(69, 70, 79)',
    outline: 'rgb(118, 118, 128)',
    outlineVariant: 'rgb(198, 197, 208)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(48, 48, 52)',
    inverseOnSurface: 'rgb(243, 240, 244)',
    inversePrimary: 'rgb(185, 195, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(241, 242, 255)',
      level2: 'rgb(234, 237, 255)',
      level3: 'rgb(226, 231, 255)',
      level4: 'rgb(224, 229, 254)',
      level5: 'rgb(218, 226, 254)',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(47, 48, 56, 0.4)',
  },
};

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: 'rgb(185, 195, 255)',
    onPrimary: 'rgb(0, 34, 138)',
    primaryContainer: 'rgb(0, 51, 192)',
    onPrimaryContainer: 'rgb(221, 225, 255)',
    secondary: 'rgb(195, 197, 221)',
    onSecondary: 'rgb(44, 47, 66)',
    secondaryContainer: 'rgb(67, 70, 89)',
    onSecondaryContainer: 'rgb(223, 225, 249)',
    tertiary: 'rgb(229, 186, 216)',
    onTertiary: 'rgb(68, 38, 62)',
    tertiaryContainer: 'rgb(92, 60, 85)',
    onTertiaryContainer: 'rgb(255, 215, 243)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(27, 27, 31)',
    onBackground: 'rgb(228, 225, 230)',
    surface: 'rgba(27, 27, 31, 1)',
    onSurface: 'rgb(228, 225, 230)',
    surfaceVariant: 'rgb(69, 70, 79)',
    onSurfaceVariant: 'rgb(198, 197, 208)',
    outline: 'rgb(144, 144, 154)',
    outlineVariant: 'rgb(69, 70, 79)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(228, 225, 230)',
    inverseOnSurface: 'rgb(48, 48, 52)',
    inversePrimary: 'rgb(0, 70, 250)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(35, 35, 42)',
      level2: 'rgb(40, 40, 49)',
      level3: 'rgb(44, 46, 56)',
      level4: 'rgb(46, 47, 58)',
      level5: 'rgb(49, 51, 62)',
    },
    surfaceDisabled: 'rgba(228, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(228, 225, 230, 0.38)',
    backdrop: 'rgba(47, 48, 56, 0.4)',
  },
};

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{}}>
      <PaperProvider theme={LightTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
