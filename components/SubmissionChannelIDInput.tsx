import { Button, FormLabel, HStack, Select, Text, textDecoration, useColorMode } from '@chakra-ui/react'
import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'

export default function SubmissionChannelIDInput({ register, index, errors, fixMessage, watch, onOpenWhereDoIFindSubmissionChannelID, currentGuild, setValue, cookieValue, getGuilds, setStage }: any) {
  const colorMode = useColorMode().colorMode

  const [inputMethod, _setInputMethod] = useState() // login or manual

  function setInputMethod(method: string) {
    
    //@ts-expect-error
    _setInputMethod(method)
    if(method === 'login') {
      const popup = window.open(`https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fform-builder.pages.dev%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds&prompt=none`, 'popup', 'popup=true,width=485,height=700')

      window.addEventListener('message', (event) => {
        if (event.data === 'authorized') {
          // Close the popup if it hasn't been closed already
          if (popup && !popup.closed) {
            popup.close();
          }

          // GET DATA
          console.log('GET DATA')
          getGuilds()
          setStage('server_selection')
        }
      });
    }
  }

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].submit_channel_id`} display='flex' alignItems='center'>
        <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Submission Channel {Array.isArray(currentGuild) ? '' : 'ID'}</Text>
        {onOpenWhereDoIFindSubmissionChannelID && !Array.isArray(currentGuild) && <Text color='#00b0f4' fontFamily='Whitney' textDecoration='underline' onClick={onOpenWhereDoIFindSubmissionChannelID} _hover={{ cursor: 'pointer' }}>Where do I find this?</Text>}
      </FormLabel>

      {/* Not Logged in and input method not chosen */}
      {!cookieValue && !inputMethod &&
        <HStack gap={3}>
          <Button variant='primary' onClick={() => setInputMethod('login')}>Login to choose channel</Button>
          <button onClick={() => setInputMethod('manual')} style={{ color: 'oklab(0.700834 -0.0780351 -0.1469)', fontSize: '15px' }}>Enter Channel ID Manually</button>
        </HStack>
      }

      {/* Logged In or Input method chosen */}
      {(cookieValue || (inputMethod === 'manual')) && (Array.isArray(currentGuild) ? <Select
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
      <option disabled selected value="">Select a channel</option>
      {currentGuild.filter(channel => ![2, 4, 13, 14].includes(channel.type)).map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
    </Select> : <>
      <input
        {...register(`forms.${index}.submit_channel_id`, { required: true, pattern: /^\d{10,20}$/, onChange: () => fixMessage() })}
        id={`forms[${index}].submit_channel_id`}
        style={{ marginBottom: '2px' }}
      />
      <button onClick={() => setInputMethod('login')} style={{ color: 'oklab(0.700834 -0.0780351 -0.1469)', fontSize: '15px' }}>Login to choose channel</button>
    </>)}



    </>
  )
}
