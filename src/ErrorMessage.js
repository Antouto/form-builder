/* eslint eqeqeq: 0 */
import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

function ErrorMessage({ children, field, fieldName = "field", fieldType = "This" }) {
  if (field != null) children = (<>
    {field?.type == "required" && `${fieldType} ${fieldName} is required`}
    {field?.type == "maxLength" && `${fieldType} ${fieldName} is too long`}
    {field?.type == "minLength" && `${fieldType} ${fieldName} is not long enough`}
  </>);
  return (
    <HStack>
      {children ? <AiFillExclamationCircle color='#ff7a6b' /> : null}
      <Text color='#ff7a6b'>
        {children}
      </Text>
    </HStack>
  )
}

export default ErrorMessage