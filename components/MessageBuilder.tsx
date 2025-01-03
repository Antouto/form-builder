import React from 'react'
import { VStack, FormLabel, Box, Text } from '@chakra-ui/react'
import EmbedBuilder from './EmbedBuilder'
import OpenFormComponentBuilder from './OpenFormComponentBuilder'
import { useFieldArray } from 'react-hook-form';
import Counter from './Counter';

  //@ts-expect-error
export default function MessageBuilder({ forMessage, control, register, errors, setValue, getValues, resetField, fixMessage, openFormType, watch, formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove, formMessageComponentsMove, premium }) {

  
  return (
    <VStack align="flex-start" width="100%" marginBottom="8px">
      <FormLabel
        htmlFor={`${forMessage}.content`}
        display="flex"
        alignItems="center"
      >
        <Text>Content</Text>
        <Counter
          count={getValues(`${forMessage}.content`)?.length}
          max={2000}
        />
      </FormLabel>
      <textarea
        style={{ height: "99px" }}
        {...register(`${forMessage}.content`, { maxLength: 2000, onChange: () => fixMessage(forMessage) })}
        id={`${forMessage}.content`}
      />
      <EmbedBuilder
        {...{
          control,
          register,
          errors,
          setValue,
          getValues,
          watch,
          resetField,
          fixMessage,
          forMessage
        }}
      />
      {forMessage === 'message' && openFormType === "select_menu" && (
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
      {forMessage === 'message' && openFormType === "button" && <OpenFormComponentBuilder {...{ control, errors, getValues, register, fixMessage, setValue, watch, formMessageComponents, formMessageComponentsAppend, formMessageComponentsRemove, formMessageComponentsMove, premium  }}/>}
    </VStack>
  )
}
