import { ButtonProps } from "@chakra-ui/react";
import { ComponentTheme } from "./types";

export const Button: ComponentTheme<ButtonProps> = {
    baseStyle: {
        color: 'white',
        fontFamily: 'Whitney Bold',
        fontWeight: '500',
        borderRadius: '.25rem',
        _focus: { boxShadow: 'none' }
    },
    variants: {
        primary: {
            bg: 'blurple',
            _disabled: { _hover: { bg: 'blurple!important' } },
            _hover: { bg: '#4752c4' },
            height: '36px',
            padding: '0 14px'
        },
        'discord-primary': {
            bg: 'blurple',
            _disabled: { _hover: { bg: 'blurple!important' } },
            _hover: { bg: '#4752c4' },
            borderRadius: '3px',
        },
        'primary-outline': {
            bg: 'transparent',
            border: '2px solid #5865F2',
            _disabled: { _hover: { border: '2px solid #5865F2!important' } },
            _hover: { bg: 'blurple' },
            height: '36px',
            padding: '0 14px'
        },
        secondary: {
            bg: 'grey.light',
            _disabled: { _hover: { bg: 'grey.light!important' } },
            _hover: { bg: '#686d73' },
            height: '36px',
            padding: '0 14px'
        },
        'secondary-outline': {
            bg: 'transparent',
            border: '2px solid #4f545c',
            _disabled: { _hover: { border: '2px solid grey.light!important' } },
            _hover: { bg: 'grey.light' },
            height: '36px',
            padding: '0 14px'
        },
        'discord-secondary': {
            bg: 'grey.light',
            _disabled: { _hover: { bg: 'grey.light!important' } },
            _hover: { bg: '#686d73' },
            height: '36px',
            borderRadius: '3px'
        },
        success: {
            bg: 'green',
            _disabled: { _hover: { bg: 'green!important' } },
            _hover: { bg: '#215b32' },
            height: '36px',
            padding: '0 14px'
        },
        'discord-success': {
            bg: 'green',
            _disabled: { _hover: { bg: 'green!important' } },
            _hover: { bg: '#215b32' },
            height: '36px',
            borderRadius: '3px'
        },
        'success-outline': {
            bg: 'transparent',
            border: '2px solid #2d7d46',
            _disabled: { _hover: { border: '2px solid #2d7d46!important' } },
            _hover: { bg: '#2d7d46' },
            height: '36px',
            padding: '0 14px'
        },
        danger: {
            bg: '#ED4245',
            _disabled: { _hover: { bg: '#ED4245!important' } },
            _hover: { bg: '#a12d2f' },
            height: '36px',
            padding: '0 14px'
        },
        'discord-danger': {
            bg: '#ED4245',
            _disabled: { _hover: { bg: '#ED4245!important' } },
            _hover: { bg: '#a12d2f' },
            height: '36px',
            borderRadius: '3px'
        },
        'danger-outline': {
            bg: 'transparent',
            border: '2px solid #ED4245',
            _disabled: { _hover: { border: '2px solid #ED4245!important' } },
            _hover: { bg: '#ED4245' },
            height: '36px',
            padding: '0 14px'
        },
        link: {
            bg: 'transparent',
            color: 'white',
            _hover: { textDecoration: 'underline' }
        },
        'link-outline': {
            bg: 'transparent',
            border: '1px solid white',
            fontSize: '14px',
            marginBottom: '1.5px',
            height: '22px',
            paddingX: '8px!important',
            color: 'white',
            _hover: { textDecoration: 'underline' }
        },
        navigationDisplayMode: { height: '24px', marginY: '2px', fontSize: '15px', paddingInline: '7px', paddingBlock: 0, borderRadius: 15 }
    },
    defaultProps: {
        variant: 'secondary',
    }
};