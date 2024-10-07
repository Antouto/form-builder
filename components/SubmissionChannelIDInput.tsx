import { FormLabel, HStack, Select, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'

export default function SubmissionChannelIDInput({ register, index, errors, fixMessage, watch, onOpenWhereDoIFindSubmissionChannelID, currentGuild }: any) {
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
      <ErrorMessage error={errors.forms?.[index]?.submit_channel_id || (onOpenWhereDoIFindSubmissionChannelID && !watch(`forms.${index}.submit_channel_id`) && { type: 'required' })} />
      {Array.isArray(currentGuild) ? <Select
        height='24px!important'
        maxWidth='155px'
        borderWidth='2px'
        borderColor='transparent'
        borderRadius='4px'
        bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
        _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
        _hover={{ borderColor: 'transparent' }}
      // onChange={(event) => setServerSubmissionMessage(event.target.value, index)}
      // value={serverSubmissionMessage[index]}
      >
        {currentGuild.map(channel => <option value={channel.id}>{channel.name}</option>)}
      </Select> : ''}
    </>
  )
}
