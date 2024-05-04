import { Box, Button, CloseButton, FormLabel, HStack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import Counter from './Counter';
import ErrorMessage from './ErrorMessage';
import ButtonBuilder from './ButtonBuilder';

export default function SubmitComponentsBuilder({ i, ii, control, getValues, resetField, setValue, register, errors, watch }: any) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: `forms.${i}.submit_components.${ii}.components`
  });

  function remove(index: number) {
    _remove(index)
    if (!getValues(`forms.${i}.submit_components.${ii}.components`)?.length) {
      setValue(`forms.${i}.submit_components.${ii}.components`, undefined)
      resetField(`forms.${i}.submit_components.${ii}.components`)
    }
  }

  return (
    <>
      {fields.map((item, iii) => {
        const button = getValues(`forms[${i}].submit_components.${ii}.components.${iii}`)
        return <Collapsible key={item.id} name={`Button ${iii + 1}${button?.label && button?.label.match(/\S/) ? ` – ${button?.label}` : ''}`} deleteButton={<CloseButton onClick={() => { remove(iii); }} />}>
          <HStack><ButtonBuilder forButton={`forms[${i}].submit_components.${ii}.components.${iii}`} error={errors.forms?.[i]?.submit_components?.[ii]?.components[iii]?.label} button={button} register={register} setValue={setValue} watch={watch} fix={() => { }} /></HStack>
        </Collapsible>
      })}
      <Button isDisabled={fields.length >= 5} variant='primary' onClick={() => append({
        type: 4,
        label: 'Button',
        style: 1
      })}>Add Button</Button>
    </>
  )
}
