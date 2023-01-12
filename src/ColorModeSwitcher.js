import React from 'react';
import { useColorMode, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const colorMode = useColorModeValue('Light', 'Dark');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Tooltip shouldWrapChildren label={`${colorMode}`} textColor="white" placement='top' bg="#18191c" borderRadius={6} hasArrow>
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${text} mode`}
        color="#bcbcbc"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        {...props}
      />
    </Tooltip>
  );
};
