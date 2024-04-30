import React from 'react'
import { VStack, FormLabel, Box } from '@chakra-ui/react'
import EmbedBuilder from './EmbedBuilder'

  //@ts-expect-error

export default function MessageBuilder({ control, register, errors, setValue, getValues, resetField, fixMessage, openFormType }) {
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
    </VStack>
  )
}
