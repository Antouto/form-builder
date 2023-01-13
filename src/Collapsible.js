import React from 'react'
import { Button, Collapse, Box, useDisclosure, useColorMode } from '@chakra-ui/react'
import { HiChevronRight } from 'react-icons/hi'
import { IconContext } from 'react-icons';

function Collapsible({ name, deleteButton, children, variant }) {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <Box
      width='100%'
      border={variant === 'large' ? `1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}` : 'none'}
      borderRadius='4px'
      boxShadow={variant === 'large' ? 'rgb(0 0 0 / 16%) 0px 4px 4px' : 'none'}
      marginBottom={variant === 'large' ? '16px' : '0px'}
      pt={1}
      pb={1}>
      <Button
        onClick={onToggle}
        as='div'
        margin={0}
        padding={variant === 'large' ? '0px 6px 0px 10px' : '0px'}
        justifyContent='space-between'
        width='100%' _focus='unset'
        _hover={{ bg: 'transparent' }}
        bg='transparent'
        color={variant === 'large' ? (colorMode === 'dark' ? 'black' : 'white') : '#bcbcbc'}
      >
        <Box display='flex'>
          <svg className='pointer' style={{ marginRight: '8px', transition: 'transform 0.2s', transform: `rotate(${90 + (isOpen ? 90 : 0)}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke="#bcbcbc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> {name}
        </Box>{deleteButton} </Button>
      <Collapse in={isOpen} animateOpacity margin={0}>
        <Box
          p='0px 10px 10px'
          rounded='md'
          shadow='md'
          margin='0'
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Collapsible