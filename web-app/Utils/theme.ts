import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 960,
  //     lg: 1280,
  //     xl: 1920,
  //   },
  // },
  palette: {
    // Emerald
    primary: {
      main: '#3CC47C',
    },
    // Venetian Red
    secondary: {
      main: '#C90E0E',
    },
    // // Green Blue Crayola
    // tertiary: {
    //   main: '#228CDB',
    // },
    // // Raisin Black
    // dark: {
    //   main: '#272635',
    // },
    // // Ghost White
    // light: {
    //   main: '#f8f8ff',
    // },
  },
  //tonalOffset: 0.1,
});

// theme.typography.h3 = {
//   fontFamily: 'Roboto',
//   fontWeight: 350,
//   fontSize: '1.4rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '1.8rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '2.4rem',
//   },
// };

// theme.typography.h4 = {
//   fontFamily: 'Roboto',
//   fontWeight: 350,
//   fontSize: '1.2rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '1.6rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '2.1rem',
//   },
// };

// theme.typography.h5 = {
//   fontFamily: 'Roboto',
//   fontWeight: 350,
//   fontSize: '1rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '1.4rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '1.8rem',
//   },
// };

// theme.typography.h6 = {
//   fontFamily: 'Roboto',
//   fontWeight: 450,
//   fontSize: '1.2rem',
//   [theme.breakpoints.up('md')]: {
//     fontSize: '1.4rem',
//   },
// };

// theme.typography.body1 = {
//   fontFamily: 'Roboto',
//   fontWeight: 350,
//   fontSize: '1.4rem',
//   /*[theme.breakpoints.up('sm')]: {
//     fontSize: '1.2rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '1.4rem',
//   },*/
// };

// theme.typography.fontWeightBold = {
//   fontFamily: 'Roboto',
//   fontWeight: 600,
//   fontSize: '0.8rem',
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '1.2rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '1.4rem',
//   },
// };

export default theme;
