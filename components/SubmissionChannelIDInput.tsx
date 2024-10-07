import { FormLabel, HStack, Select, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'

export default function SubmissionChannelIDInput({ register, index, errors, fixMessage, watch, onOpenWhereDoIFindSubmissionChannelID, currentGuild, setValue }: any) {
  const colorMode = useColorMode().colorMode

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].submit_channel_id`} display='flex' alignItems='center'>
        <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Submission Channel {Array.isArray(currentGuild) ? 'ID':''}</Text>
        {onOpenWhereDoIFindSubmissionChannelID && <Text color='#00b0f4' fontFamily='Whitney' textDecoration='underline' onClick={onOpenWhereDoIFindSubmissionChannelID} _hover={{ cursor: 'pointer' }}>Where do I find this?</Text>}
      </FormLabel>
      {Array.isArray(currentGuild) ? <Select
        height='36px!important'
        // maxWidth='155px'
        borderWidth='2px'
        borderColor='transparent'
        borderRadius='4px'
        bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
        _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
        _hover={{ borderColor: 'transparent' }}
        onChange={(event) => setValue(`forms.${index}.submit_channel_id`, event.target.value)}
      // value={serverSubmissionMessage[index]}
      >
        <option disabled selected value="">Select an option</option>
        {currentGuild.map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
      </Select> : <>
        <input
          {...register(`forms.${index}.submit_channel_id`, { required: true, pattern: /^\d{10,20}$/, onChange: () => fixMessage() })}
          id={`forms[${index}].submit_channel_id`}
          style={{ marginBottom: '2px' }}
        />
      </>}
      <ErrorMessage error={errors.forms?.[index]?.submit_channel_id || (onOpenWhereDoIFindSubmissionChannelID && !watch(`forms.${index}.submit_channel_id`) && { type: 'required' })} />
    </>
  )
}
