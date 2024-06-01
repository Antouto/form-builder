import { Button, CloseButton } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import SubmitComponentsBuilder from './SubmitComponentsBuilder';

export default function ActionRowBuilder({ control, i, getValues, setValue, resetField, register, errors, watch, premium, setPremiumFeatureTarget, onOpenPremium }: any) {
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
        <Collapsible key={item.id} name={`Button Row ${ii + 1}`} deleteButton={<CloseButton onClick={() => { remove(ii); }} />}>
          <SubmitComponentsBuilder i={i} ii={ii}  control={control} getValues={getValues} resetField={resetField} setValue={setValue} register={register} errors={errors} watch={watch} premium={premium} {...{setPremiumFeatureTarget, onOpenPremium}} />
        </Collapsible>
      )}
      <Button isDisabled={fields.length >= 5} variant='primary' onClick={() => append({
        type: 1,
        components: [{
          type: 2,
          label: 'Button',
          style: 1
        }]
      })}>Add Button Row</Button>
    </>
  )
}
