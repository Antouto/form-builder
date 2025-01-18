import { Box, Button, CloseButton, FormLabel, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import TextInputBuilder from './TextInputBuilder';
import FormTitleInput from './FormTitleInput';
import Counter from './Counter';

export default function PageBuilder({ index, control, premium, getValues, setValue, register, formState, watch, resetField, fixMessage, setDisplayPage, isOpenPremium, onOpenPremium, onClosePremium, setPremiumFeatureTarget, textInputMaxLength, setTextInputMaxLength }: any) {
  const { fields, remove, append, move, insert } = useFieldArray({
    control,
    name: `forms.${index}.pages`
  });

  function updateTextInputMaxLength() {
    let numberOfTextInputs = 0;

    for (let i = 0; i < watch(`forms.${index}.pages`).length; i++) {
      for (let ii = 0; ii < watch(`forms.${index}.pages.${i}.modal.components`).length; ii++) {
        numberOfTextInputs++
      }
    }

    const maxCharactersUsername = 32
    const maxCharactersEmbed = 6000
    const maxCharactersEmbedField = 1024
    const maxCharactersWithoutEmbedFieldLimit = Math.floor((maxCharactersEmbed - maxCharactersUsername) / numberOfTextInputs)

    const maxLength = maxCharactersWithoutEmbedFieldLimit < maxCharactersEmbedField ? maxCharactersWithoutEmbedFieldLimit : maxCharactersEmbedField

    const wasProbablySetProgramtically = (i: number, ii: number) => [1024, 994, 852, 746, 663, 596, 542, 497, 459, 426, 397, 373, 351, 331, 314, 298, 284, 271, 259, 248, 238].includes(getValues(`forms.${index}.pages.${i}.modal.components.${ii}.components.0.max_length`))

    for (let i = 0; i < watch(`forms.${index}.pages`).length; i++) {
      for (let ii = 0; ii < watch(`forms.${index}.pages.${i}.modal.components`).length; ii++) {
        if (getValues(`forms.${index}.pages.${i}.modal.components.${ii}.components.0.max_length`) > maxLength || wasProbablySetProgramtically(i, ii)) setValue(`forms.${index}.pages.${i}.modal.components.${ii}.components.0.max_length`, maxLength)
      }
    }

    setTextInputMaxLength(maxLength)
  }

  return (<VStack align='flex-start' mt={1}>
    {fields.map((page, i) => <Collapsible onlyToggleWithArrow key={page.id} name={
      <FormTitleInput premium={premium} setPremiumFeatureTarget={setPremiumFeatureTarget} onOpenPremium={onOpenPremium} remove={remove} insert={insert} append={append} move={move} setDisplayPage={setDisplayPage} updateTextInputMaxLength={updateTextInputMaxLength} fields={fields} index={index} pageIndex={i} register={register} watch={watch} getValues={getValues} fixMessage={fixMessage} errors={formState.errors} />
    } defaultIsOpen={i === 0} >

      <VStack align='flex-start' mt={2}>
        <FormLabel margin={0} display="flex"
          alignItems="center">
          <Text _after={{
            content: '" *"',
            color: "#ff7a6b",
          }}>Text Inputs</Text>
          <Counter
            count={watch(`forms.${index}.pages.${i}.modal.components`).length}
            max={5}
          />
        </FormLabel>
        <TextInputBuilder id={`forms.${index}.pages.${i}.modal.components`} nestIndex={index} pageIndex={i} {...{ control, register, formState, watch, setValue, resetField, fixMessage, updateTextInputMaxLength, textInputMaxLength }} />
      </VStack>
    </Collapsible>)}
    <Button variant='primary' mt={4} style={{ backgroundImage: 'linear-gradient(to right, rgb(52, 66, 217), rgb(1, 118, 164))' }} isDisabled={getValues('forms')?.[index]?.pages?.length >= 5} onClick={() => {
      if (!premium) {
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
                  style: 1,
                  max_length: 1024
                }
              ]
            }
          ]
        }
      })
      updateTextInputMaxLength()
      setDisplayPage(watch(`forms.${index}.pages`).length - 1)
    }}>Add Page</Button>
  </VStack>)
}
