import { Button, CloseButton, FormLabel } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';

export default function EmbedFieldBuilder({ control, register, forFields, getValues, resetField, setValue }: any) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: forFields
  });

  function remove(index: number) {
    _remove(index)
    if (!getValues(forFields)?.length) {
      resetField(forFields)
      setValue(forFields, undefined)
    }
  }

  return (
    <>
      {Array.isArray(getValues(forFields)) ? fields.map((field, index) =>
        <Collapsible key={field.id} name={`Field ${index + 1}${getValues(forFields)[index]?.name && getValues(forFields)[index]?.name?.match(/\S/) ? ` – ${getValues(forFields)[index]?.name}` : ''}`} deleteButton={<CloseButton onClick={() => { remove(index); }} />} style={{ padding: 0 }}>
          <FormLabel htmlFor={`${forFields}.${index}.name`}>Name</FormLabel>
          <textarea {...register(`${forFields}.${index}.name`, { minLength: 1, maxLength: 256 })} id={`${forFields}.${index}.name`} />

          <FormLabel htmlFor={`${forFields}.${index}.value`}>Value</FormLabel>
          <textarea style={{ height: '99px' }} {...register(`${forFields}.${index}.value`, { minLength: 1, maxLength: 1024 })} id={`${forFields}.${index}.value`} />
        </Collapsible>
      ) : ''}
      <Button
        variant='primary-outline'
        isDisabled={getValues(forFields)?.length >= 25}
        onClick={() => {
          append({
            name: "",
            value: ""
          })
        }}
      >
        Add Field
      </Button>
    </>
  )
}
