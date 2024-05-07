import { FormLabel, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'

export default function SubmissionChannelIDInput({ register, index, errors, fixMessage }:any) {
  const colorMode = useColorMode().colorMode

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].submit_channel_id`} display='flex' alignItems='center'>
        <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Submission Channel ID</Text>
      </FormLabel>
      <input
        {...register(`forms.${index}.submit_channel_id`, { required: true, pattern: /\d{10,20}/, onChange: () => fixMessage() })}
        id={`forms[${index}].submit_channel_id`}
        style={{ marginBottom: '8px' }}
      />
      <ErrorMessage error={errors.forms?.[index]?.submit_channel_id} />
    </>
  )
}
