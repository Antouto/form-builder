/* eslint eqeqeq: 0 */
import React, { PropsWithChildren } from 'react'
import { HStack, Text, TextProps } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export interface ErrorMessageProperties extends TextProps {
  field?: {
    type: string;
  };
  fieldName?: string;
  fieldType?: string;
  children?: React.ReactNode;
}

export default function ErrorMessage(options: ErrorMessageProperties) {
  let { children, field, fieldName = "field", fieldType = "This" } = options;
  if (field != null) children = (<>
    {field?.type == "required" && `${fieldType} ${fieldName} is required`}
    {field?.type == "maxLength" && `${fieldType} ${fieldName} is too long`}
    {field?.type == "minLength" && `${fieldType} ${fieldName} is not long enough`}
  </>);
  return (
    <HStack>
      {children ? <AiFillExclamationCircle color='#ff7a6b' /> : null}
      <Text color='#ff7a6b' {...options}>
        {children}
      </Text>
    </HStack>
  )
};
