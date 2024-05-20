import React from 'react'
import { VStack, FormLabel, Box } from '@chakra-ui/react'
import EmbedBuilder from './EmbedBuilder'
import OpenFormComponentBuilder from './OpenFormComponentBuilder'
import { useFieldArray } from 'react-hook-form';

  //@ts-expect-error
export default function MessageBuilder({ control, register, errors, setValue, getValues, resetField, fixMessage, openFormType, watch, formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove, formMessageComponentsMove, premium }) {

  
  return (
    <VStack align="flex-start" width="100%" marginBottom="8px">
      <FormLabel htmlFor="message.content">Message</FormLabel>
      <textarea
        style={{ height: "99px" }}
        {...register("message.content", { onChange: () => fixMessage() })}
        id="message.content"
      />
      <EmbedBuilder
        {...{
          control,
          register,
          errors,
          setValue,
          getValues,
          resetField,
          fixMessage,
        }}
      />
      {openFormType === "select_menu" && (
        <Box width="100%">
          <FormLabel htmlFor="select_menu_placeholder">
            Select Menu Placeholder
          </FormLabel>
          <input
            {...register("select_menu_placeholder", { required: false })}
            maxLength={100}
            placeholder="Select a form"
            id="select_menu_placeholder"
          />
        </Box>
      )}
      {openFormType === "button" && <OpenFormComponentBuilder {...{ control, errors, getValues, register, fixMessage, setValue, watch, formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove, formMessageComponentsMove, premium  }}/>}
    </VStack>
  )
}
