import { Box, Button, FormLabel, HStack, useColorMode, Text } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'
import Counter from './Counter'
import { useScreenWidth } from '../util/width';

//@ts-expect-error
export default function ButtonBuilder({ register, fix, setValue, watch, forButton, error, button, buttonLabel, buttonLabelPlaceholder, buttonColour, buttonLabelRequired, buttonColourRequired, allowColourDeselect, resetField, getValues }) {
  const colorMode = useColorMode().colorMode
  const isSmallScreen = !useScreenWidth(1070);

  return (
    <>
      <Box width={isSmallScreen ? '100%' : '50%'}>
        <FormLabel htmlFor={`${forButton}.label`} display='flex' alignItems='flex-end'><Text _after={buttonLabelRequired === 'no' ? 'unset' : { content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>{buttonLabel ? buttonLabel : 'Button Label'}</Text>
          <Counter count={button?.label?.length} max={80}></Counter>
        </FormLabel>
        <input
          {...register(`${forButton}.label`, {
            required: buttonLabelRequired === 'no' ? false : true,
            maxLength: 80,
            onChange: () => fix()
          })}
          id={`${forButton}.label`}
          placeholder={buttonLabelPlaceholder ? buttonLabelPlaceholder : ''}
        />
        <ErrorMessage error={error} />
      </Box>
      <Box>
        <FormLabel htmlFor={`${forButton}.style`}>
          <Text _after={buttonColourRequired === 'no' ? 'unset' : { content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>{buttonColour ? buttonColour : 'Button Colour'}</Text>
        </FormLabel>
        <HStack>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'blurple' }} background={'blurple'} onClick={() => { fix(); allowColourDeselect ? (getValues(`${forButton}.style`) === 1 ? setValue(`${forButton}.style`, undefined) : setValue(`${forButton}.style`, 1)) : setValue(`${forButton}.style`, 1)}}>{watch(`${forButton}.style`) === 1 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'grey.light' }} background={'grey.light'} onClick={() => { fix(); allowColourDeselect ? (getValues(`${forButton}.style`) === 2 ? setValue(`${forButton}.style`, undefined) : setValue(`${forButton}.style`, 2)) : setValue(`${forButton}.style`, 2)}}>{watch(`${forButton}.style`) === 2 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'green' }} background={'green'} onClick={() => { fix(); allowColourDeselect ? (getValues(`${forButton}.style`) === 3 ? setValue(`${forButton}.style`, undefined) : setValue(`${forButton}.style`, 3)) : setValue(`${forButton}.style`, 3)}}>{watch(`${forButton}.style`) === 3 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'red' }} background={'red'} onClick={() => { fix(); allowColourDeselect ? (getValues(`${forButton}.style`) === 4 ? setValue(`${forButton}.style`, undefined) : setValue(`${forButton}.style`, 4)) : setValue(`${forButton}.style`, 4)}}>{watch(`${forButton}.style`) === 4 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
        </HStack>
      </Box>
    </>
  )
}
