import { Theme, DefaultTheme } from '@react-navigation/native';

export const defaultNavTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};
