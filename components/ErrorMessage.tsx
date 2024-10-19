/* eslint eqeqeq: 0 */
import React from 'react'
import { Box, HStack, Text, TextProps, useColorMode } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export enum ErrorSeverity {
  Warning, Error
}

export interface ErrorMessageProperties extends TextProps {
  error?: {
    type?: string;
  };
  severity?: ErrorSeverity
  children?: React.ReactNode;
}

export default function ErrorMessage({ children, error, severity }: ErrorMessageProperties) {
  if (error) {
    const message = (() => {
      switch(error?.type) {
        case 'required': return 'Required'
        case 'maxLength': return 'Too long'
        case 'minLength': return 'Too short'
        default: return 'Invalid'
      }
    })()
    children = (<>{error?.type && message}</>);
  }
  const colorMode = useColorMode().colorMode;
  return (
    <HStack>
      {children ? <Box><AiFillExclamationCircle color={severity === ErrorSeverity.Warning ? 'rgb(252, 164, 28)' : (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f')} /></Box> : null}
      <Text color={severity === ErrorSeverity.Warning ? 'rgb(252, 164, 28)' : (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f')}>
        {children}
      </Text>
    </HStack>
  )
};
