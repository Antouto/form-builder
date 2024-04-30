import { Box, Button, FormLabel, HStack, useColorMode, Text } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'
import Counter from './Counter'
import { useScreenWidth } from '../util/width';

//@ts-expect-error
export default function ButtonBuilder({ register, index, fixMessage, getValues, errors, setValue, watch}) {
  const colorMode = useColorMode().colorMode
  const isSmallScreen = !useScreenWidth(1070);

  return (
    <>
      <Box width={isSmallScreen ? '100%' : '50%'}>
        <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Label</Text>
          <Counter count={getValues('forms')[index].button?.label?.length} max={80}></Counter>
        </FormLabel>
        <input
          {...register(`forms.${index}.button.label`, { required: true, maxLength: 80, onChange: () => fixMessage() })}
          id={`forms[${index}].button.label`}
          placeholder='Open Form'
        />
        <ErrorMessage error={errors.forms?.[index]?.button?.label} />
      </Box>
      <Box>
        <FormLabel htmlFor={`forms[${index}].button.style`}>
          <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Colour</Text>
          </FormLabel>
        <HStack>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'blurple' }} background={'blurple'} onClick={() => setValue(`forms.${index}.button.style`, 1)}>{watch(`forms.${index}.button.style`) === 1 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'grey.light' }} background={'grey.light'} onClick={() => setValue(`forms.${index}.button.style`, 2)}>{watch(`forms.${index}.button.style`) === 2 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'green' }} background={'green'} onClick={() => setValue(`forms.${index}.button.style`, 3)}>{watch(`forms.${index}.button.style`) === 3 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'red' }} background={'red'} onClick={() => setValue(`forms.${index}.button.style`, 4)}>{watch(`forms.${index}.button.style`) === 4 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
        </HStack>
      </Box>
    </>
  )
}
