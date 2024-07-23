import React, { CSSProperties } from 'react'
import { Button, Collapse, Box, useDisclosure, useColorMode, Tooltip, HStack } from '@chakra-ui/react'

export interface CollapsibleProperties {
  name: string;
  deleteButton?: React.ReactNode;
  moveUpButton?: React.ReactNode;
  moveDownButton?: React.ReactNode;
  children: React.ReactNode;
  variant?: string;
  style?: CSSProperties;
}

function Collapsible({ name, deleteButton, moveUpButton, moveDownButton, children, variant, style }: CollapsibleProperties) {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <Box
      style={style}
      width='100%'
      border={variant === 'large' ? `1px solid ${colorMode === 'dark' ? '#292b2f' : '#e3e5e8'}` : 'none'}
      borderRadius='4px'
      boxShadow={variant === 'large' ? 'rgb(0 0 0 / 16%) 0px 4px 4px' : 'none'}
      marginBottom={variant === 'large' ? '16px' : '0px'}
      pt={1}
      pb={1}>
      <Button
        onClick={onToggle}
        as='div'
        margin={0}
        padding={variant === 'large' ? '0px 6px 0px 14px' : '0px'}
        // paddingInlineStart={variant === 'large' ? '16px' : '0px'}
        // paddingInlineEnd={variant === 'large' ? '16px' : '0px'}
        height={variant === 'large' ? '40px' : '32px'}
        justifyContent='space-between'
        width='100%'
        _hover={{ bg: 'transparent' }}
        bg='transparent'
        color={variant === 'large' ? (colorMode === 'dark' ? 'white' : 'black') : (colorMode === 'dark' ? '#bcbcbc' : '#4f5660')}
      >
        <Box display='flex' alignItems='center'>
          <svg style={{ marginRight: '8px', cursor: 'pointer', transition: 'transform 0.2s', transform: `rotate(${90 + (isOpen ? 90 : 0)}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke="#bcbcbc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> {name}
        </Box>
        <HStack>{moveDownButton}{moveUpButton}{deleteButton}</HStack>
        </Button>
      <Collapse in={isOpen} animateOpacity style={{ margin: 0 }}>
        <Box
          p='0px 14px 14px'
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