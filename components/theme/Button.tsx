import { ButtonProps } from "@chakra-ui/react";
import { ComponentTheme } from "./types";

export const Button: ComponentTheme<ButtonProps> = {
    baseStyle: {
        color: 'white',
        fontFamily: 'Whitney Bold',
        fontWeight: '500',
        borderRadius: '3px',
        _focus: { boxShadow: 'none' },
    },
    variants: {
        primary: {
            bg: 'blurple',
            _disabled: { _hover: { bg: 'blurple!important' } },
            _hover: { bg: '#4752c4' }
        },
        secondary: {
            bg: 'grey.light',
            _disabled: { _hover: { bg: 'grey.light!important' } },
            _hover: { bg: '#686d73' }
        },
        success: {
            bg: 'green',
            _disabled: { _hover: { bg: 'green!important' }},
            _hover: { bg: '#215b32' }
        },
        danger: {
            bg: 'red',
            _disabled: { _hover: { bg: 'red!important' }},
            _hover: { bg: '#a12d2f' }
        },
        link: {
            bg: 'transparent',
            color: 'white',
            _hover: { textDecoration: 'underline' }
        },
        navigationDisplayMode: { height: '24px', marginY: '2px', fontSize: '15px', paddingInline: '7px',  paddingBlock: 0, borderRadius: 15 }
    },
    defaultProps: {
        variant: 'secondary',
    }
};