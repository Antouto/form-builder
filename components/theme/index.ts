import { cssVar, extendTheme, ThemeConfig, defineStyleConfig } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";

const $SwitchBackground = cssVar("switch-bg");
const colours = {
  'blurple': '#5865F2',
  'blurple.500': '#5865F2',
  'green': '#2d7d46',
  'red': '#ED4245',
  'grey.extralight': '#ebedef',
  'grey.lighter': '#6d6f78',
  'grey.light': '#4f545c',
  'grey.dark': '#36393f',
  'grey.extradark': '#292b2f',
  'disabled': '#72767d'
};

const { blurple } = colours;

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  colors: colours,
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('white', 'grey.dark')(props),
        color: mode('black', 'white')(props),
      },
      input: {
        bg: mode('grey.extralight', 'grey.extradark')(props),
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
        bg: mode('grey.extralight', 'grey.extradark')(props),
        height: '36px',
        width: '100%',
        padding: '3px 9px',
        border: `2px solid transparent`,
        //height: '95px',
        minHeight: '36px',
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
    Button,
    Tooltip,
    Alert: {
      variants: {
        primary: {
          bg: 'blurple'
        }
      }
    },
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            [$SwitchBackground.variable]: colours.blurple,
            _dark: {
              [$SwitchBackground.variable]: colours.blurple,
            },
          },
          [$SwitchBackground.variable]: colours.disabled,
        }
      },
      variants: {
        green: {
          track: {
            _checked: {
              [$SwitchBackground.variable]: colours.green,
              _dark: {
                [$SwitchBackground.variable]: colours.green,
              },
            },
            [$SwitchBackground.variable]: colours.disabled,
          }
        }
      }
    },
    Input: { defaultProps: { variant: 'normal' } },
    FormLabel: { baseStyle: { marginBottom: '0px' } }
  }
});

export default theme;
