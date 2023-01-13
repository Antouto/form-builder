import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';


function ErrorMessage({ children }) {

  return (
    <HStack>
      {children ? <AiFillExclamationCircle color='#ff7a6b' /> : null}
      <Text color='#ff7a6b'>{children}</Text>
    </HStack>
  )
}

export default ErrorMessage