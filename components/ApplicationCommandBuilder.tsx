import { FormLabel, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Counter from './Counter'
import ErrorMessage from './ErrorMessage'
//@ts-expect-error
export default function ApplicationCommandBuilder({ register, getValues, errors }) {
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
      <input
        {...register("application_command.name", {
          required: true,
          pattern: /^[-_\p{Ll}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u,
          maxLength: 32,
        })}
        id="application_command.name"
      />
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
