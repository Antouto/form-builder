import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const colours = {
  'blurple': '#5865F2',
  'blurple.500': '#5865F2',
  'green': '#2d7d46',
  'red': '#ED4245',
  'grey.extralight': '#ebedef',
  'grey.light': '#4f545c',
  'grey.dark': '#36393f',
  'grey.extradark': '#292b2f'
};

const { blurple } = colours;

const theme = extendTheme({
  colors: colours,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('grey.dark', 'white')(props),
        color: mode('white', 'black')(props),
      },
      input: {
        bg: mode('grey.extradark', 'grey.extralight')(props),
        height: '36px',
        width: '100%',
        padding: '0px 9px',
        border: `2px solid transparent`,
        transition: '0.2s',
        outline: 'none',
        borderRadius: 4,
        _focus: { border: `2px solid ${blurple}` }
      },
      textarea: {
        bg: mode('grey.extradark', 'grey.extralight')(props),
        height: '36px',
        width: '100%',
        padding: '6px 9px',
        border: `2px solid transparent`,
        //height: '95px',
        minHeight: '43px',
        transition: '0.2s',
        outline: 'none',
        borderRadius: 4,
        resize: 'vertical',
        _focus: { border: `2px solid ${blurple}` }
      },
      hr: { borderColor: '#ffffff0f' }
    })
  },
  components: {
    Button: {
      baseStyle: {
        color: 'white',
        fontFamily: 'Whitney Bold',
        fontWeight: '500',
        padding: '16px 2px',
        borderRadius: '3px',
        _focus: { boxShadow: 'none' }
      },
      variants: {
        primary: {
          bg: 'blurple',
          _hover: { bg: '#4752c4' }
        },
        secondary: {
          bg: 'grey.light',
          _hover: { bg: '#686d73' }
        },
        success: {
          bg: 'green',
          _hover: { bg: '#215b32' }
        },
        danger: {
          bg: 'red',
          _hover: { bg: '#a12d2f' }
        },
        link: {
          bg: 'transparent',
          color: 'white',
          _hover: {
            textDecoration: 'underline'
          }
        }
      },
      defaultProps: {
        variant: 'secondary',
      }
    },
    Input: { defaultProps: { variant: 'normal' } },
    FormLabel: { baseStyle: { marginBottom: '0px' } },
  }
});

export default theme