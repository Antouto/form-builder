import { Box, Button, CloseButton, FormLabel, HStack, Link, Select, Text, useColorMode } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import Counter from './Counter';
import ErrorMessage from './ErrorMessage';
import ButtonBuilder from './ButtonBuilder';

export default function SubmitComponentsBuilder({ i, ii, control, getValues, resetField, setValue, register, errors, watch, premium }: any) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: `forms.${i}.submit_components.${ii}.components`
  });
  const colorMode = useColorMode().colorMode

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
        return <Collapsible key={item.id} name={`Button ${iii + 1}${button?.label && button?.label.match(/\S/) ? ` – ${button?.label}` : ''}`} deleteButton={getValues(`forms[${i}].submit_components.${ii}.components`)?.length > 1 ? <CloseButton onClick={() => { remove(iii) }} /> : null}>
          <HStack><ButtonBuilder forButton={`forms[${i}].submit_components.${ii}.components.${iii}`} error={errors.forms?.[i]?.submit_components?.[ii]?.components[iii]?.label} button={button} register={register} setValue={setValue} watch={watch} fix={() => { }} /></HStack>
          {/* <FormLabel>Button Logic</FormLabel> */}
          {/* <Collapsible name={'Logic'}> */}
          <FormLabel>Actions on click</FormLabel>
          <HStack wrap='wrap'>
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`, '')}>Add role to submitter</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`, '')}>Remove role from submitter</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`, {})}>Update button</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, {
              modal: {
                title: "DM response to submitter",
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        style: 2,
                        label: "Message"
                      }
                    ]
                  }
                ]
              },
              message: {
                content: "{TextInputValue1}"
              }
            })}>DM response to submitter</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`, true)}>Remove other buttons in this row</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) === undefined && <Button onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`, true)}>Delete this channel</Button>}
            {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) === undefined && <Button backgroundImage='linear-gradient(to right, rgb(52, 66, 217), rgb(1, 118, 164))' isDisabled={!premium} onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, '')}>Require permissions to use</Button>}
          </HStack>

          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Role ID - Add role to submitter</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`, { required: true, pattern: /^\d{10,20}$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`}
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.ADD_ROLE_TO_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Role ID - Remove role from submitter</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`, { required: true, pattern: /^\d{10,20}$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`}
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REMOVE_ROLE_FROM_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) !== undefined && <Box>
            <HStack><ButtonBuilder forButton={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`} error={errors.forms?.[i]?.submit_components?.[ii]?.components[iii]?.logic?.UPDATE_COMPONENT?.label} button={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`)} buttonLabel={'Update Label'} buttonLabelRequired={'no'} buttonColourRequired={'no'} buttonColour={'Update Colour'} register={register} setValue={setValue} watch={watch} allowColourDeselect={true} resetField={resetField} getValues={getValues} fix={() => { }} /> <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) }} /></HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`) !== undefined && <Box>
            <HStack>
              <FormLabel>User will be prompted to write a message - DM response to submitter</FormLabel>
              {/* <input
                  {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, { required: true, pattern: /^\d{10,20}$/ })}
                  id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`}
                /> */}
              <CloseButton onClick={() => { setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`) && <Box>
            <HStack>
              <FormLabel>Remove other buttons in this row</FormLabel>
              <CloseButton onClick={() => { setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) && <Box>
            <HStack>
              <FormLabel>Delete this channel</FormLabel>
              <CloseButton onClick={() => { setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) !== undefined && <Box>
            <FormLabel>Permissions Number - Require permissions to use</FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, { required: true, pattern: /^\d+$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`}
                placeholder='8 for administrator'
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REQUIRED_PERMISSIONS} />
            <Link href='https://discordapi.com/permissions.html' target="_blank" rel="noopener noreferrer" color='#00b0f4'>Discord Permissions Number Generator</Link>
          </Box>}
          {/* </Collapsible> */}
        </Collapsible>
      })}
      <Button isDisabled={fields.length >= 5} variant='primary' onClick={() => append({
        type: 2,
        label: 'Button',
        style: 1
      })}>Add Button</Button>
    </>
  )
}
