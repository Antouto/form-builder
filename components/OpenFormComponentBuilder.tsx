import React from 'react'
import { Box, Button, CloseButton, FormLabel, HStack, Text } from '@chakra-ui/react'
import { useFieldArray } from 'react-hook-form';
import ButtonBuilder from './ButtonBuilder';
import Collapsible from './Collapsible';
import Counter from './Counter';

//formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove
export default function OpenFormComponentBuilder({ control, premium, errors, getValues, register, fixMessage, setValue, watch, formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove, formMessageComponentsMove }: any) {
  
  return (
    <Box width='100%'>
      <FormLabel
        htmlFor="message.components.0.components"
        display="flex"
        alignItems="center"
      >
        <Text>Buttons</Text>
        <Counter
          count={getValues(`message.components.0.components`)?.length}
          max={5}
        />
      </FormLabel>
      {/* @ts-expect-error */}
      {formMessageComponents.map((component, i) => <Collapsible name={component.style === 5 ? 'Link Button' : `Button to open Form ${component.custom_id?.match(/\d+/)?.[0]}`} key={component.id} moveUpButton={component.style === 5 && (i !== 0) && <svg onClick={() => formMessageComponentsMove(i, i-1)} style={{ marginRight: '8px', cursor: 'pointer', transition: 'transform 0.2s', transform: `rotate(0deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke="#bcbcbc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>} moveDownButton={component.style === 5 && (i !== formMessageComponents.length-1) && <svg onClick={() => formMessageComponentsMove(i, i+1)} style={{ marginRight: '8px', cursor: 'pointer', transition: 'transform 0.2s', transform: `rotate(180deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke="#bcbcbc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>} deleteButton={component.style === 5 ? <CloseButton onClick={() => formMessageComponentsRemove(i)} /> : undefined}>
        {/* @ts-expect-error */}
        <HStack><ButtonBuilder forButton={`message.components.0.components.${i}`} error={errors?.message?.components?.[0]?.components?.[i]?.label} errorURL={errors?.message?.components?.[0]?.components?.[i]?.url} button={getValues(`message.components.0.components.${i}`)} register={register} fix={fixMessage} setValue={setValue} watch={watch} buttonLabelPlaceholder={component.style === 5 ? undefined : 'Open Form'} /></HStack>
      </Collapsible>)}
      <Button variant='primary-outline' isDisabled={getValues(`message.components.0.components`)?.length >= 5} onClick={() => {
        formMessageComponentsAppend({
          type: 2,
          style: 5,
          label: '',
          url: ''
        })
      }}>Add Link Button</Button>
    </Box>
  )
}
