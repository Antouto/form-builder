import { FormLabel, Tooltip, Text, Box, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { IconContext } from 'react-icons'
import { IoInformationCircle } from 'react-icons/io5'
import ErrorMessage from './ErrorMessage'

//@ts-expect-error
export default function WebhookURLInput({ index, register, webhookUrlFocused, webhookUrlSetFocused, errors, fixMessage }) {
  const colorMode = useColorMode().colorMode

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].webhook_url`} display='flex' alignItems='center'>
        <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Webhook URL</Text>
        <Tooltip hasArrow label={
          'The webhook url to post submissions to. Keep this secret! You can create the webhook in channel settings, integrations tab for the channel you want to post the submission to.'
        } placement='right' shouldWrapChildren bg="#181414">
          <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
        </Tooltip>
      </FormLabel>
      <input
        {...register(`forms.${index}.webhook_url`, { required: true, pattern: /^https:\/\/((canary|ptb).)?discord(app)?.com\/api(\/v\d+)?\/webhooks\/\d{5,30}\/.+$/, onChange: () => fixMessage() })}
        id={`forms[${index}].webhook_url`}
        onFocus={() => webhookUrlSetFocused(true)}
        onBlur={() => webhookUrlSetFocused(false)}
        type={webhookUrlFocused ? 'text' : 'password'}
        inputmode="url"
        placeholder='https://discord.com/api/webhooks/ ...'
        style={{ marginBottom: '8px' }}
      />
      <ErrorMessage error={errors.forms?.[index]?.webhook_url} />
    </>
  )
}
