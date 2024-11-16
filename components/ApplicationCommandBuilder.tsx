import { FormLabel, HStack, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Counter from './Counter'
import ErrorMessage from './ErrorMessage'
//@ts-expect-error
export default function ApplicationCommandBuilder({ register, getValues, setValue, errors }) {
  const { colorMode } = useColorMode();

  return (
    <>
      <FormLabel
        htmlFor={"application_command.name"}
        display="flex"
        alignItems="center"
      >
        <Text
          _after={{
            content: '" *"',
            color: colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
          }}
        >
          Name
        </Text>
        <Counter
          count={getValues("application_command")?.name?.length}
          max={32}
        />
      </FormLabel>
      <HStack gap={1}>
        <svg xmlns="http://www.w3.org/2000/svg" color='oklab(0.787067 -0.00258079 -0.0110391)' width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm12.79 3.37a.25.25 0 0 0-.22-.37h-3.13a.75.75 0 0 0-.66.38L6.21 18.63c-.1.16.03.37.22.37h3.13c.27 0 .52-.14.66-.38l7.57-13.25Z" clip-rule="evenodd"></path></svg>
        <input
          {...register("application_command.name", {
            required: true,
            pattern: /^[-_\p{Ll}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u,
            maxLength: 32,
            //@ts-expect-error
            onChange: event => setValue('application_command.name', event.target.value.toLowerCase().replace('/',''))
          })}
          id="application_command.name"
          autoCapitalize='off'
          autoCorrect='off'
          autoComplete='off'
        />
      </HStack>
      <ErrorMessage error={errors?.application_command?.name} />
      <FormLabel
        htmlFor={"application_command.description"}
        display="flex"
        alignItems="center"
      >
        <Text
          _after={{
            content: '" *"',
            color: colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
          }}
        >
          Description
        </Text>
        <Counter
          count={getValues("application_command")?.description?.length}
          max={100}
        />
      </FormLabel>
      <input
        {...register("application_command.description", {
          maxLength: 100,
          required: true
        })}
        id="application_command.description"
      />
      <ErrorMessage error={errors?.application_command?.description} />
    </>
  )
}
