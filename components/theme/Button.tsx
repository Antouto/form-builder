import { ButtonProps } from "@chakra-ui/react";
import { ComponentTheme } from "./types";

export const Button: ComponentTheme<ButtonProps> = {
    baseStyle: {
        color: 'white',
        fontFamily: 'Whitney Bold',
        fontWeight: '500',
        padding: '16px 2px',
        borderRadius: '3px',
        _focus: { boxShadow: 'none' },
    },
    variants: {
        primary: {
            bg: 'blurple',
            _disabled: {
                _hover: { bg: 'unset' }
            },
            _hover: { bg: '#4752c4' }
        },
        secondary: {
            bg: 'grey.light',
            _disabled: {
                _hover: { bg: 'unset' }
            },
            _hover: { bg: '#686d73' }
        },
        success: {
            bg: 'green',
            _disabled: {
                _hover: { bg: 'unset' }
            },
            _hover: { bg: '#215b32' }
        },
        danger: {
            bg: 'red',
            _disabled: {
                _hover: { bg: 'unset' }
            },
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
};