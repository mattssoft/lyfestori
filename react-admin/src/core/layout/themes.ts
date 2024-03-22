import { 
    defaultTheme, 
} from 'react-admin';

export const theme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: "#EB9B00"
        },
    },
};

export const darkTheme = { ...theme, palette: { mode: 'dark' } };