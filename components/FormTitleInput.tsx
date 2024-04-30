import { FormLabel, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Counter from './Counter'
import ErrorMessage from './ErrorMessage'

export default function FormTitleInput({ index, register, getValues, fixMessage, errors }) {
  const colorMode = useColorMode().colorMode

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].modal.title`} display='flex' alignItems='flex-end'>
        <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text>
        <Counter count={getValues('forms')[index]?.modal.title?.length} max={45} />
      </FormLabel>
      <input
        {...register(`forms.${index}.modal.title`, { required: true, maxLength: 45, onChange: () => fixMessage() })}
        id={`forms[${index}].modal.title`}
        style={{ marginBottom: '8px' }}
      />
      <ErrorMessage error={errors.forms?.[index]?.modal?.title} />
    </>
  )
}
