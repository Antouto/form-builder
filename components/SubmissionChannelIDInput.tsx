import { FormLabel, HStack, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'

export default function SubmissionChannelIDInput({ register, index, errors, fixMessage, watch, onOpenWhereDoIFindSubmissionChannelID }:any) {
  const colorMode = useColorMode().colorMode

  return (
    <>
    <HStack>
      <FormLabel htmlFor={`forms[${index}].submit_channel_id`} display='flex' alignItems='center'>
        <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Submission Channel ID</Text>
        {onOpenWhereDoIFindSubmissionChannelID && <Text color='#00b0f4' fontFamily='Whitney' textDecoration='underline' onClick={onOpenWhereDoIFindSubmissionChannelID} _hover={{ cursor: 'pointer' }}>Where do I find this?</Text>}
      </FormLabel>
    </HStack>
      <input
        {...register(`forms.${index}.submit_channel_id`, { required: true, pattern: /^\d{10,20}$/, onChange: () => fixMessage() })}
        id={`forms[${index}].submit_channel_id`}
        style={{ marginBottom: '2px' }}
      />
      <ErrorMessage error={errors.forms?.[index]?.submit_channel_id || (!watch(`forms.${index}.submit_channel_id`) && { type: 'required' })} />
    </>
  )
}
