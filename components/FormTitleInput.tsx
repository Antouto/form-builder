import { FormLabel, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Counter from './Counter'
import ErrorMessage from './ErrorMessage'

  //@ts-expect-error
export default function FormTitleInput({ index, pageIndex, register, getValues, fixMessage, errors }) {
  const colorMode = useColorMode().colorMode

  return (
    <>
      <FormLabel htmlFor={`forms[${index}].pages.${pageIndex}.modal.title`} display='flex' alignItems='center'>
        <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text>
        <Counter count={getValues('forms')[index]?.pages?.[pageIndex]?.modal.title?.length} max={45} />
      </FormLabel>
      <input
        {...register(`forms.${index}.pages.${pageIndex}.modal.title`, { required: true, maxLength: 45, onChange: () => fixMessage() })}
        id={`forms[${index}].pages.${pageIndex}.modal.title`}
        style={{ marginBottom: '8px' }}
      />
      <ErrorMessage error={errors.forms?.[index]?.modal?.title} />
    </>
  )
}
