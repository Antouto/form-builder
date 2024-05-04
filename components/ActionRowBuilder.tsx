import { Button, CloseButton } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import SubmitComponentsBuilder from './SubmitComponentsBuilder';

export default function ActionRowBuilder({ control, i, getValues, setValue, resetField, register, errors, watch }: any) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: `forms.${i}.submit_components`
  });

  function remove(ii: number) {
    _remove(ii)
    if (!getValues(`forms.${i}.submit_components`)?.length) {
      setValue(`forms.${i}.submit_components`, undefined)
      resetField(`forms.${i}.submit_components`)
    }
  }

  return (
    <>
      {fields.map((item, ii) =>
        <Collapsible name={`Action Row ${ii + 1}`} deleteButton={<CloseButton onClick={() => { remove(ii); }} />}>
          <SubmitComponentsBuilder i={i} ii={ii}  control={control} getValues={getValues} resetField={resetField} setValue={setValue} register={register} errors={errors} watch={watch} />
        </Collapsible>
      )}
      <Button isDisabled={fields.length >= 5} variant='primary' onClick={() => append({
        type: 1,
        components: []
      })}>Add Action Row</Button>
    </>
  )
}
