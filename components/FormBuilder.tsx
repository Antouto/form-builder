import { Box, Button, CloseButton, FormLabel, HStack, Link, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Control,
  FieldValues,
  FormState,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues,
  UseFormResetField
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import TextInputBuilder from "./TextInputBuilder";
import ErrorMessage from "./ErrorMessage";
import { FormAndOpenFormTypeBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import { useColorMode } from "@chakra-ui/react";
import Counter from "./Counter";
import ButtonBuilder from "./ButtonBuilder";
import WebhookURLInput from "./WebhookURLInput";
import FormTitleInput from "./FormTitleInput";
import ActionRowBuilder from "./ActionRowBuilder";
import SubmissionChannelIDInput from "./SubmissionChannelIDInput";

export interface FormBuilderProperties<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  resetField: UseFormResetField<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  premium: boolean;
}

export default function FormBuilder({
  control,
  register,
  setValue,
  getValues,
  resetField,
  formState,
  formState: { errors },
  watch,
  displayForm,
  setDisplayForm,
  //@ts-expect-error
  fixMessage,
  //@ts-expect-error
  webhookUrlFocused,
  //@ts-expect-error
  webhookUrlSetFocused,
  premium,
  //@ts-expect-error
  submissionType,
  //@ts-expect-error
  setSubmissionType
}: FormBuilderProperties<FormAndOpenFormTypeBuilder>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
    rules: { minLength: 1 }
  });

  const [serverSubmissionMessage, __setServerSubmissionMessage] = useState(['default'])
  const [dmSubmissionMessage, __setdmSubmissionMessage] = useState(['default'])
  const isSmallScreen = !useScreenWidth(1240);
  const isReallySmallScreen = !useScreenWidth(400);
  const colorMode = useColorMode().colorMode

  function _setServerSubmissionMessage(value: string, index: number) {
    const array = serverSubmissionMessage.slice();
    array[index] = value;
    __setServerSubmissionMessage(array)
    console.log('__setServerSubmissionMessage', serverSubmissionMessage)
  }

  function _setdmSubmissionMessage(value: string, index: number) {
    const array = dmSubmissionMessage.slice();
    array[index] = value;
    __setdmSubmissionMessage(array)
    console.log('__setdmSubmissionMessage', dmSubmissionMessage)
  }

  function setServerSubmissionMessage(value: string, index: number) {
    _setServerSubmissionMessage(value, index)
    console.log('_setServerSubmissionMessage')

    switch (value) {
      case 'default': {
        resetField(`forms.${index}.guild_submit_message`);
        if (serverSubmissionMessage[index] === 'same_as_dm') {
          setValue(`forms.${index}.dm_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
          _setServerSubmissionMessage('default', index);
          console.log('_setdmSubmissionMessage')
        }
        if (dmSubmissionMessage[index] === 'same_as_server') {
          resetField(`forms.${index}.submit_message`);
          _setdmSubmissionMessage('default', index)
        }
        break;
      } case 'custom': {
        if (serverSubmissionMessage[index] === 'same_as_dm') {
          setValue(`forms.${index}.dm_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
        }
        resetField(`forms.${index}.guild_submit_message`);
        break;
      }
      case 'same_as_dm': {
        setValue(`forms.${index}.submit_message`, getValues(`forms.${index}.dm_submit_message`));
        resetField(`forms.${index}.dm_submit_message`)
        resetField(`forms.${index}.guild_submit_message`)
        break;
      }
    }
    fixSubmissionMessage(index);
    fixdmSubmissionMessage(index);
    fixServerSubmissionMessage(index);
  }

  function setdmSubmissionMessage(value: string, index: number) {
    _setdmSubmissionMessage(value, index)
    switch (value) {
      case 'default': {
        resetField(`forms.${index}.dm_submit_message`);
        if (dmSubmissionMessage[index] === 'same_as_server') {
          setValue(`forms.${index}.guild_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
          _setdmSubmissionMessage('default', index);
          console.log('_setServerSubmissionMessage')
        }
        if (serverSubmissionMessage[index] === 'same_as_dm') {
          resetField(`forms.${index}.submit_message`);
          _setServerSubmissionMessage('default', index)
        }
        break;
      } case 'custom': {
        if (dmSubmissionMessage[index] === 'same_as_server') {
          setValue(`forms.${index}.guild_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
        }
        resetField(`forms.${index}.dm_submit_message`);
        break;
      }
      case 'same_as_server': {
        setValue(`forms.${index}.submit_message`, getValues(`forms.${index}.guild_submit_message`));
        resetField(`forms.${index}.guild_submit_message`)
        resetField(`forms.${index}.dm_submit_message`)
        break;
      }
      case 'off': {
        if (dmSubmissionMessage[index] === 'same_as_server') {
          setValue(`forms.${index}.guild_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
        }
        //@ts-expect-error
        setValue(`forms.${index}.dm_submit_message`, null);
        if (serverSubmissionMessage[index] === 'same_as_dm') {
          resetField(`forms.${index}.submit_message`);
          _setServerSubmissionMessage('default', index);
          console.log('_setServerSubmissionMessage')
        }
        break;
      }
    }
    fixSubmissionMessage(index);
    fixdmSubmissionMessage(index);
    fixServerSubmissionMessage(index);
  }

  function fixButton(index: number) {
    setTimeout(() => {
      //@ts-expect-error
      if (typeof watch(`forms.${index}.button.style`) === 'string') setValue(`forms.${index}.button.style`, parseInt(watch(`forms.${index}.button.style`)))
    }, 1)
  }

  function fixServerSubmissionMessage(index: number) {
    if (!getValues(`forms.${index}.guild_submit_message`)) return;
    //@ts-expect-error
    const { content } = getValues(`forms.${index}.guild_submit_message`)
    if (!content) resetField(`forms.${index}.guild_submit_message`);
  }

  function fixdmSubmissionMessage(index: number) {
    if (!getValues(`forms.${index}.dm_submit_message`)) return;
    //@ts-expect-error
    const { content } = getValues(`forms.${index}.dm_submit_message`)
    if (!content) resetField(`forms.${index}.dm_submit_message`);
  }

  function fixSubmissionMessage(index: number) {
    if (!getValues(`forms.${index}.submit_message`)) return;
    //@ts-expect-error
    const { content } = getValues(`forms.${index}.submit_message`)
    if (!content) resetField(`forms.${index}.submit_message`);
  }

  return (
    <Box width='100%' pb={2}>
      <FormLabel display='flex' alignItems='flex-end' pb={2}><Text>Forms</Text><Counter count={getValues('forms')?.length} max={getValues('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5)} /></FormLabel>
      <ul>
        {fields.map((item, index) => {
          return (

            <Collapsible name={`Form ${index + 1}${getValues('forms')[index]?.modal.title && getValues('forms')[index]?.modal.title.match(/\S/) ? ` – ${getValues('forms')[index]?.modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => {
              remove(index)
              let newServerSubmissionMessage = serverSubmissionMessage;
              newServerSubmissionMessage.splice(index, 1);
              __setServerSubmissionMessage(newServerSubmissionMessage)

              let newdmSubmissionMessage = dmSubmissionMessage;
              newdmSubmissionMessage.splice(index, 1);
              __setdmSubmissionMessage(newdmSubmissionMessage)

              setSubmissionType('delete')
              setDisplayForm(displayForm - 1)
            }} /> : null} key={item.id}>
              <Collapsible name="General">


                <HStack>
                  <FormLabel whiteSpace="nowrap" m={0}>
                    Send submissions using
                  </FormLabel>
                  <Select
                    backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))'
                    height="24px!important"
                    width='fit-content'
                    borderWidth="2px"
                    borderColor="transparent"
                    borderRadius="4px"
                    isDisabled={!premium}
                    border='1px solid rgba(255, 255, 255, 0.16)'
                    // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
                    _focus={{ outline: 'none' }}
                    _focusVisible={{ outline: 'none' }}
                    _hover={{ borderColor: "transparent" }}
                    onChange={(event) => {
                      setSubmissionType('edit', event.target.value, index)
                    }}
                    value={submissionType[index]}
                  >
                    <option value="bot">Bot</option>
                    <option value="webhook">Webhook</option>
                  </Select>
                </HStack>

                {submissionType[index] === 'bot' && <SubmissionChannelIDInput index={index} register={register} errors={formState.errors} fixMessage={fixMessage} />}
                {submissionType[index] === 'webhook' && <WebhookURLInput index={index} register={register} webhookUrlFocused={webhookUrlFocused} webhookUrlSetFocused={webhookUrlSetFocused} errors={formState.errors} fixMessage={fixMessage} />}

                <Stack direction={isSmallScreen ? 'column' : 'row'} marginBottom='8px' alignItems='flex-start'>
                  <Stack direction={isReallySmallScreen ? 'column' : 'row'}>
                    {
                      watch('forms.0.select_menu_option') && <>
                        <Box width='100%'>
                          <FormLabel htmlFor={`forms[${index}].select_menu_option.label`} display='flex' alignItems='flex-end'>
                            <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Select Menu Option Label</Text>
                            <Counter count={getValues('forms')[index].select_menu_option?.label?.length} max={100} />
                          </FormLabel>
                          <input
                            {...register(`forms.${index}.select_menu_option.label`, { required: true, maxLength: 100, onChange: () => fixMessage() })}
                            id={`forms[${index}].select_menu_option.label`}
                            placeholder='Form'
                          />
                          <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.label} />
                        </Box>
                        <Box width='100%'>
                          <FormLabel htmlFor={`forms[${index}].select_menu_option.description`} display='flex' alignItems='flex-end'>
                            <Text>Select Menu Option Description</Text>
                            <Counter count={getValues('forms')[index].select_menu_option?.description?.length} max={100}></Counter>
                          </FormLabel>
                          <input
                            {...register(`forms.${index}.select_menu_option.description`, { maxLength: 100, onChange: () => fixMessage() })}
                            id={`forms[${index}].select_menu_option.description`}
                          />
                          <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.description} />
                        </Box>
                      </>
                    }

                    {
                      watch('forms.0.button') && <ButtonBuilder forButton={`forms[${index}].button`} error={errors.forms?.[index]?.button?.label} button={getValues('forms')[index].button} register={register} fix={fixMessage} setValue={setValue} watch={watch} />
                    }
                  </Stack>


                  <Box width={isSmallScreen ? '100%' : '40%'}>
                    <FormLabel htmlFor={`forms[${index}].cooldown`} display='flex' alignItems='flex-end'><Text>Cooldown (days)</Text></FormLabel>
                    <NumberInput min={0} isDisabled={!premium}>
                      <NumberInputField _focusVisible={{ boxShadow: 'inset 0 0 0 2px #5865F2', border: 'none' }} height='36px' placeholder="OFF, Use 0 for Infinity" backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' {...register(`forms.${index}.cooldown`)} id={`forms.${index}.cooldown`} onChange={(event) => {
                        setValue(`forms.${index}.cooldown`, event.target.value === '' ? undefined : (parseInt(event.target.value) < 0 ? 0 : parseInt(event.target.value)));
                      }} />
                    </NumberInput></Box>
                </Stack>

                <FormTitleInput index={index} register={register} getValues={getValues} fixMessage={fixMessage} errors={formState.errors} />
              </Collapsible >
              <hr />
              <Collapsible name="Text Inputs">
                <TextInputBuilder id={`forms.${index}.modal.components`} nestIndex={index} {...{ control, register, formState, watch, setValue, resetField, fixMessage }} />
              </Collapsible>
              <hr />
              <Collapsible name="Submission & Confirmation Messages">
                <VStack align={'flex-start'}>
                  <HStack>
                    <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    <Text>This section is still in development and currently only supports the message content</Text>
                  </HStack>
                  <HStack><Text>Use variables to add the response content to your message:</Text><Link color='#00b0f4' href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940#variables" isExternal>Show Variables</Link></HStack>
                  <HStack justifyContent='space-between' width='100%'>
                    <FormLabel whiteSpace='nowrap' m={0}>Server Submission Message</FormLabel>
                    <Select
                      height='24px!important'
                      maxWidth='155px'
                      borderWidth='2px'
                      borderColor='transparent'
                      borderRadius='4px'
                      bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                      _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                      _hover={{ borderColor: 'transparent' }}
                      onChange={(event) => setServerSubmissionMessage(event.target.value, index)}
                      value={serverSubmissionMessage[index]}
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                      {dmSubmissionMessage[index] === 'custom' && <option value="same_as_dm">Same as DM</option>}
                    </Select>
                  </HStack>
                  {serverSubmissionMessage[index] === 'custom' && dmSubmissionMessage[index] !== 'same_as_server' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].guild_submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].guild_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.guild_submit_message.content`, { maxLength: 2000, onChange: () => fixServerSubmissionMessage(index) })}
                      id={`forms.${index}.guild_submit_message.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.guild_submit_message?.content} />
                  </Box>}
                  {serverSubmissionMessage[index] === 'custom' && dmSubmissionMessage[index] === 'same_as_server' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.submit_message.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.guild_submit_message?.content} />
                  </Box>}
                  <HStack justifyContent='space-between' width='100%'>
                    <FormLabel whiteSpace='nowrap' m={0}>DM Confirmation Message</FormLabel>
                    <Select
                      height='24px!important'
                      maxWidth='155px'
                      borderWidth='2px'
                      borderColor='transparent'
                      borderRadius='4px'
                      bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                      _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                      _hover={{ borderColor: 'transparent' }}
                      onChange={(event) => setdmSubmissionMessage(event.target.value, index)}
                      value={dmSubmissionMessage[index]}
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                      {serverSubmissionMessage[index] === 'custom' && <option value="same_as_server">Same as Server</option>}
                      <option value="off">Off</option>
                    </Select>
                  </HStack>
                  {dmSubmissionMessage[index] === 'custom' && serverSubmissionMessage[index] !== 'same_as_dm' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].dm_submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].dm_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.dm_submit_message.content`, { maxLength: 2000, onChange: () => fixdmSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.dm_submit_message?.content} />
                  </Box>}
                  {dmSubmissionMessage[index] === 'custom' && serverSubmissionMessage[index] === 'same_as_dm' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.submit_message?.content} />
                  </Box>}
                  <FormLabel>Submission Buttons</FormLabel> 
                  <ActionRowBuilder control={control} i={index} getValues={getValues} resetField={resetField} setValue={setValue} register={register} errors={errors} watch={watch} premium={premium}/>
                </VStack>
              </Collapsible>
            </Collapsible >
          );
        })}
      </ul >

      <section>
        <Button
          variant='primary'
          isDisabled={(getValues('message') && getValues('forms.0.select_menu_option') && getValues('forms').length >= 25) || (getValues('message') && getValues('forms.0.button') && getValues('forms').length >= 5) || getValues('application_command') && getValues('forms').length >= 1}
          onClick={() => {
            setDisplayForm(fields.length)
            append({
              button: {
                label: '',
                style: 1
              },
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
            serverSubmissionMessage.push('default')
            dmSubmissionMessage.push('default')
            setSubmissionType('append', 'bot')

            fixMessage()
          }}
        >
          Add Form
        </Button>
        {getValues('forms')?.length > 5 || getValues('application_command') && getValues('forms').length > 1 && <ErrorMessage>You have too many forms</ErrorMessage>}
      </section>
    </Box >
  );
}
