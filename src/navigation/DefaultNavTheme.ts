import { Theme, DefaultTheme } from '@react-navigation/native';

export const defaultNavTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};
