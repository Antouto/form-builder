import { Box, Button, CloseButton, FormLabel } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import TextInputBuilder from './TextInputBuilder';
import FormTitleInput from './FormTitleInput';

export default function PageBuilder({ index, control, premium, getValues, setValue, register, formState, watch, resetField, fixMessage, setDisplayPage, isOpenPremium, onOpenPremium, onClosePremium, setPremiumFeatureTarget }: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms.${index}.pages`
  });

  return (<>
    {fields.map((page, i) => <Collapsible key={page.id} name={`Page ${i+1}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => {
      setDisplayPage(i ? i-1 : 0)
      remove(i)
    }} /> : null}>

      <FormTitleInput index={index} pageIndex={i} register={register} getValues={getValues} fixMessage={fixMessage} errors={formState.errors} />
      <FormLabel>Text Inputs</FormLabel>
      <TextInputBuilder id={`forms.${index}.pages.${i}.modal.components`} nestIndex={index} pageIndex={i} {...{ control, register, formState, watch, setValue, resetField, fixMessage }} />

    </Collapsible>)}
    <Button variant='primary' mt={4} style={{ backgroundImage: 'linear-gradient(to right, rgb(52, 66, 217), rgb(1, 118, 164))' }} isDisabled={getValues('forms')?.[index]?.pages?.length >= 5} onClick={() => {
      if(!premium) {
        setPremiumFeatureTarget('multiple_pages')
        onOpenPremium()
        return;
      }
      append({
        modal: {
          title: '',
          components: [
            {
              type: 1,
              components: [
                {
                  type: 4,
                  label: '',
                  style: 1
                }
              ]
            }
          ]
        }
      })
      setDisplayPage(watch(`forms.${index}.pages`).length-1)
    }}>Add Page</Button>
  </>)
}
