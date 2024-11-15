import { Box, Button, CloseButton, FormLabel, HStack, Input, Link, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Stack, Switch, Text, Tooltip, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
import ErrorMessage, { ErrorSeverity } from "./ErrorMessage";
import { FormAndOpenFormTypeBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import { useColorMode } from "@chakra-ui/react";
import Counter from "./Counter";
import ButtonBuilder from "./ButtonBuilder";
import WebhookURLInput from "./WebhookURLInput";
import FormTitleInput from "./FormTitleInput";
import ActionRowBuilder from "./ActionRowBuilder";
import SubmissionChannelIDInput from "./SubmissionChannelIDInput";
import PermissionOverwritesBuilder from "./PermissionOverwritesBuilder";
import PageBuilder from "./PageBuilder";
import { AiFillExclamationCircle } from "react-icons/ai";

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
  // handleCooldownChange,
  //@ts-expect-error
  webhookUrlFocused,
  //@ts-expect-error
  webhookUrlSetFocused,
  premium,
  //@ts-expect-error
  submissionType,
  //@ts-expect-error
  setSubmissionType,
  //@ts-expect-error
  submissionChannel,
  //@ts-expect-error
  setSubmissionChannel,
  //@ts-expect-error
  onOpenWhereDoIFindSubmissionChannelID,
  //@ts-expect-error
  fixSubmitChannel,
  //@ts-expect-error
  formMessageComponents,
  //@ts-expect-error
  formMessageComponentsAppend,
  //@ts-expect-error
  formMessageComponentsRemove,
  //@ts-expect-error
  openFormType,
  //@ts-expect-error
  displayPage,
  //@ts-expect-error
  setDisplayPage,
  //@ts-expect-error
  isOpenPremium,
  //@ts-expect-error
  onOpenPremium,
  //@ts-expect-error
  onClosePremium,
  //@ts-expect-error
  setPremiumFeatureTarget,
  //@ts-expect-error
  currentGuild,
  //@ts-expect-error
  cookieValue,
  //@ts-expect-error
  getGuilds,
  //@ts-expect-error
  setStage,
  //@ts-expect-error
  setCookieValue,
  //@ts-expect-error
  loadingGuild,
  //@ts-expect-error
  setLoadingGuild,
  //@ts-expect-error
  onOpenAddToServer,
  //@ts-expect-error
  guilds,
  //@ts-expect-error
  currentGuildID,
  //@ts-expect-error
  setCurrentGuildID
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

  const [cooldownDisabled, setCooldownDisabled] = useState(false)

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

  const [formsThatNeedSubmitChannelIDString, setFormsThatNeedSubmitChannelIDString] = useState('');

  useEffect(() => {
    let formsThatNeedSubmitChannelID: number[] = [];
    console.log(formsThatNeedSubmitChannelID)
    fields.forEach((form, i) => {
      if (submissionChannel[i] === 'existing' && submissionType[i] === 'bot' && (formState.errors.forms?.[i]?.submit_channel_id || !getValues(`forms.${i}.submit_channel_id`) || getValues(`forms.${i}.submit_channel`))) {
        formsThatNeedSubmitChannelID.push(i + 1)
      }
    })
    console.log(formsThatNeedSubmitChannelID)

    if (formsThatNeedSubmitChannelID.length) {
      if (formsThatNeedSubmitChannelID.length === 1) {
        setFormsThatNeedSubmitChannelIDString(` ${formsThatNeedSubmitChannelID[0]} requires`)
      } else {
        const lastElement = formsThatNeedSubmitChannelID.pop()
        setFormsThatNeedSubmitChannelIDString(`s ${formsThatNeedSubmitChannelID.join(', ')}, and ${lastElement} require`)
      }
    } else {
      setFormsThatNeedSubmitChannelIDString('')
    }
  }, [formState, fields, submissionChannel])

  // function handleCooldownClick(index) {
  //   if (!premium) {
  //     setPremiumFeatureTarget('submission_cooldown')
  //     setCooldownDisabled(true)
  //     setTimeout(() => setCooldownDisabled(false), 1);
  //     onOpenPremium()
  //     handleCooldownChange(null, null, index)
  //     return;
  //   }
  // }

  return (
    <Box width='100%' pb={2}>
      <FormLabel display='flex' alignItems='center' pb={2}><Text>Forms</Text><Counter count={getValues('forms')?.length} max={getValues('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5 - (getValues('message.components.0.components')?.filter(component => component.style === 5))?.length)} /></FormLabel>
      {formsThatNeedSubmitChannelIDString && <Box mb={4}><ErrorMessage>
        <Text>Form{formsThatNeedSubmitChannelIDString} a Submission Channel ID.</Text>
      </ErrorMessage></Box>}
      <ul>
        {fields.map((item, index) => {
          return (<>
            <Collapsible name={`Form ${index + 1}${getValues('forms')[index]?.pages[0]?.modal.title && getValues('forms')[index]?.pages?.[0]?.modal.title?.match(/\S/) ? ` – ${getValues('forms')[index]?.pages?.[0]?.modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => {
              remove(index)

              if (openFormType === 'button') {
                //@ts-expect-error
                const formToDeleteIndex = getValues('message.components[0].components')?.findIndex(component => (component.custom_id) && (component.custom_id === `{FormID${index + 1}}`))
                formMessageComponentsRemove(formToDeleteIndex)
                //@ts-expect-error
                getValues('message.components[0].components').forEach((component, i) => {
                  if ((i >= formToDeleteIndex) && component.custom_id && component.custom_id?.match(/\d+/)) {
                    //@ts-expect-error
                    setValue(`message.components[0].components.${i}.custom_id`, `{FormID${parseInt(component.custom_id?.match(/\d+/)[0]) - 1}}`)
                  }
                });
              }

              let newServerSubmissionMessage = serverSubmissionMessage;
              newServerSubmissionMessage.splice(index, 1);
              __setServerSubmissionMessage(newServerSubmissionMessage)

              let newdmSubmissionMessage = dmSubmissionMessage;
              newdmSubmissionMessage.splice(index, 1);
              __setdmSubmissionMessage(newdmSubmissionMessage)

              setSubmissionType('delete', null, index)
              setSubmissionChannel('delete', null, index)
              setDisplayForm(displayForm - 1)
            }} /> : null} key={item.id}>
              <Collapsible name={<>General{(!(watch(`forms.${index}.submit_channel_id`) || watch(`forms.${index}.webhook_url`)) || formState?.errors?.forms?.[index]?.submit_channel_id || formState?.errors?.forms?.[index]?.webhook_url) && !watch(`forms.${index}.submit_channel`) && <AiFillExclamationCircle style={{ marginLeft: '4px' }} color={colorMode === 'dark' ? '#ff7a6b' : '#d92f2f'} />}</>}>


                <HStack wrap='wrap' mb='8px'>
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
                    // isDisabled={!premium}
                    border='1px solid rgba(255, 255, 255, 0.16)'
                    // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
                    _focus={{ outline: 'none' }}
                    _focusVisible={{ outline: 'none' }}
                    _hover={{ borderColor: "transparent" }}
                    onClick={() => {
                      if (!premium) {
                        setPremiumFeatureTarget('webhook_submissions')
                        onOpenPremium()
                        return;
                      }
                    }}
                    onChange={(event) => {
                      setSubmissionType('edit', event.target.value, index)
                    }}
                    value={submissionType[index]}
                  >
                    <option value="bot">Bot</option>
                    <option value="webhook">Webhook</option>
                  </Select>
                  {submissionType[index] === 'bot' && <>
                    <FormLabel whiteSpace="nowrap" m={0}>
                      to
                    </FormLabel>
                    <Select
                      backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))'
                      height="24px!important"
                      width='fit-content'
                      borderWidth="2px"
                      borderColor="transparent"
                      borderRadius="4px"
                      border='1px solid rgba(255, 255, 255, 0.16)'
                      // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
                      _focus={{ outline: 'none' }}
                      _focusVisible={{ outline: 'none' }}
                      _hover={{ borderColor: "transparent" }}
                      onClick={() => {
                        if (!premium) {
                          setPremiumFeatureTarget('tickets')
                          onOpenPremium()
                          return;
                        }
                      }}
                      onChange={(event) => {
                        setSubmissionChannel('edit', event.target.value, index)
                      }}
                      value={submissionChannel[index]}
                    >
                      <option value="existing">Existing Channel</option>
                      <option value="new">New Channel (For tickets)</option>
                      <option value="new_thread">New Thread (For tickets)</option>
                    </Select>
                  </>}
                </HStack>

                {submissionType[index] === 'bot' && (submissionChannel[index] === 'existing' || submissionChannel[index] === 'new_thread') && <SubmissionChannelIDInput index={index} register={register} errors={formState.errors} watch={watch} fixMessage={fixMessage} onOpenWhereDoIFindSubmissionChannelID={onOpenWhereDoIFindSubmissionChannelID} currentGuild={currentGuild} getValues={getValues} setValue={setValue} cookieValue={cookieValue} getGuilds={getGuilds} setStage={setStage} setCookieValue={setCookieValue} setLoadingGuild={setLoadingGuild} onOpenAddToServer={onOpenAddToServer} loadingGuild={loadingGuild} guilds={guilds} currentGuildID={currentGuildID} setCurrentGuildID={setCurrentGuildID}/>}
                {submissionType[index] === 'webhook' && <WebhookURLInput index={index} register={register} webhookUrlFocused={webhookUrlFocused} webhookUrlSetFocused={webhookUrlSetFocused} errors={formState.errors} fixMessage={fixMessage} />}
                {submissionChannel[index] === 'new' && <Collapsible name='New Channel'>
                  <HStack mb={2} wrap={isReallySmallScreen ? 'wrap' : 'nowrap'}>
                    <Box width='100%'>
                      <FormLabel htmlFor={`forms[${index}].submit_channel.name`} display='flex' alignItems='center'>
                        <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Name</Text>
                        {/* @ts-expect-error */}
                        <Counter count={getValues('forms')[index].submit_channel?.name?.length} max={100} />
                      </FormLabel>
                      <Input
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_channel.name`, { required: true, maxLength: 100, pattern: /^[^ _!"§$%&/()=]+$/, onChange: () => fixSubmitChannel(index) })}
                        id={`forms[${index}].submit_channel.name`}
                        height='36px'
                      />

                      {/* @ts-expect-error */}
                      <ErrorMessage error={errors.forms?.[index]?.submit_channel?.name} />
                    </Box>
                    <Box width='100%'>
                      <FormLabel htmlFor={`forms[${index}].submit_channel.parent_id`}>Category ID</FormLabel>
                      <input
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_channel.parent_id`, { pattern: /^\d{10,20}$/, onChange: () => fixSubmitChannel(index) })}
                        id={`forms[${index}].submit_channel.parent_id`}
                      />
                      {/* @ts-expect-error */}
                      <ErrorMessage error={errors.forms?.[index]?.submit_channel?.parent_id} />
                    </Box>
                    <Box>
                      <FormLabel htmlFor={`forms[${index}].submit_channel.nsfw`}>NSFW</FormLabel>
                      <Switch
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_channel.nsfw`)}
                        colorScheme='blurple'
                      />
                    </Box>
                  </HStack>

                  <FormLabel htmlFor={`forms[${index}].submit_channel.permission_overwrites`}>Permission Overwrites</FormLabel>
                  Use this <Link href='https://discordapi.com/permissions.html' target="_blank" rel="noopener noreferrer" color='#00b0f4'>permissions number generator</Link> for the allow and deny fields.
                  <PermissionOverwritesBuilder control={control} i={index} forPermissionOverwrite={`forms.${index}.submit_channel.permission_overwrites`} register={register} errors={errors} getValues={getValues} setValue={setValue} resetField={resetField} premium={premium} />
                </Collapsible>}
                {submissionChannel[index] === 'new_thread' && <Collapsible name='New Thread'>
                  <HStack mb={2} wrap={isSmallScreen ? 'wrap' : 'nowrap'}>
                    <Box width='60%'>
                      <FormLabel htmlFor={`forms[${index}].submit_thread.name`} display='flex' alignItems='center'>
                        <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Name</Text>
                        {/* @ts-expect-error */}
                        <Counter count={getValues('forms')[index].submit_thread?.name?.length} max={100} />
                      </FormLabel>
                      <Input
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_thread.name`, { required: true, maxLength: 100, pattern: /^[^ _!"§$%&/()=]+$/ })}
                        id={`forms[${index}].submit_thread.name`}
                        height='36px'
                      />

                      {/* @ts-expect-error */}
                      <ErrorMessage error={errors.forms?.[index]?.submit_thread?.name} />
                    </Box>
                    {/* <Box width='100%'>
                      <FormLabel htmlFor={`forms[${index}].submit_channel.parent_id`}>Category ID</FormLabel>
                      <input
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_channel.parent_id`, { pattern: /^\d{10,20}$/, onChange: () => fixSubmitChannel(index) })}
                        id={`forms[${index}].submit_channel.parent_id`}
                      /> */}
                    {/* @ ts-expect-error */}
                    {/* <ErrorMessage error={errors.forms?.[index]?.submit_channel?.parent_id} />
                    </Box> */}
                    <Box>
                      <FormLabel htmlFor={`forms[${index}].submit_thread.add_submitter`}>Add submitter</FormLabel>
                      <Switch
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_thread.add_submitter`, {
                          onChange: (e) => {
                            //@ts-expect-error
                            setValue(`forms[${index}].submit_thread.add_submitter`, e.target.checked ? true : undefined)
                          }
                        })}
                        colorScheme='blurple'
                      />
                    </Box>
                    <Box>
                      <FormLabel htmlFor={`forms[${index}].submit_thread.type`}>Private</FormLabel>
                      <Switch
                        //@ts-expect-error
                        {...register(`forms[${index}].submit_thread.type`, {
                          onChange: (e) => {
                            //@ts-expect-error
                            setValue(`forms[${index}].submit_thread.type`, e.target.checked ? 12 : 11)
                            //@ts-expect-error
                            if (!e.target.checked) setValue(`forms[${index}].submit_thread.invitable`, undefined)
                          }
                        })}
                        colorScheme='blurple'
                      />
                    </Box>
                  </HStack>
                  {/* @ts-expect-error */}
                  {(watch(`forms[${index}].submit_thread.type`) === 12) && <Box>
                    <FormLabel htmlFor={`forms[${index}].submit_thread.invitable`}>Anyone can add people to the thread</FormLabel>
                    <Switch
                      //@ts-expect-error
                      {...register(`forms[${index}].submit_thread.invitable`, {
                        onChange: (e) => {
                          //@ts-expect-error
                          setValue(`forms[${index}].submit_thread.invitable`, e.target.checked ? undefined : false)
                        }
                      })}
                      colorScheme='blurple'
                      defaultChecked
                    />
                  </Box>}
                </Collapsible>}

                <Stack direction={isSmallScreen ? 'column' : 'row'} marginBottom='8px' alignItems='flex-start'>
                  <Stack direction={isReallySmallScreen ? 'column' : 'row'} width='100%'>
                    {
                      watch('forms.0.select_menu_option') && <>
                        <Box width='100%'>
                          <FormLabel htmlFor={`forms[${index}].select_menu_option.label`} display='flex' alignItems='center'>
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
                          <FormLabel htmlFor={`forms[${index}].select_menu_option.description`} display='flex' alignItems='center'>
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
                      //@ts-expect-error
                      watch('forms.0.button') && <ButtonBuilder forButton={`forms[${index}].button`} error={errors.forms?.[index]?.button?.label} button={getValues('forms')[index].button} register={register} fix={fixMessage} setValue={setValue} watch={watch} buttonLabelPlaceholder={'Open Form'} />
                    }
                  </Stack>
                </Stack>

                {watch('forms.0.select_menu_option') &&
                  <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].select_menu_option.emoji.id`} display='flex' alignItems='center'>Select Menu Option Emoji ID</FormLabel>
                    <input
                      //@ts-expect-error
                      {...register(`forms[${index}].select_menu_option.emoji.id`, { maxLength: 100, pattern: /^\d{10,20}$/, onChange: () => fixMessage() })}
                      id={`forms[${index}].select_menu_option.emoji.id`}
                      type='number'
                      inputMode='numeric'
                    />
                    {/* @ts-expect-error */}
                    <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.emoji?.id} />
                  </Box>
                }

                <Box>
                  <FormLabel htmlFor={`forms[${index}].cooldown`} display='flex' alignItems='center'><Text>Cooldown (seconds)</Text></FormLabel>
                  <NumberInput min={0} isDisabled={!premium && cooldownDisabled} onClick={() => {
                    if (!premium) {
                      setPremiumFeatureTarget('submission_cooldown')
                      setCooldownDisabled(true)
                      setTimeout(() => setCooldownDisabled(false), 1);
                      onOpenPremium()
                      return;
                    }
                  }}>
                    <NumberInputField _focusVisible={{ boxShadow: 'inset 0 0 0 2px #5865F2', border: 'none' }} height='36px' placeholder="OFF, Use 0 for Infinity" backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' {...register(`forms.${index}.cooldown`)} id={`forms.${index}.cooldown`} onChange={(event) => {
                      setValue(`forms.${index}.cooldown`, event.target.value === '' ? undefined : (parseInt(event.target.value) < 0 ? 0 : parseInt(event.target.value)));
                    }} />
                  </NumberInput>
                  {/* <HStack><Text width='60px'>Days</Text><Text width='60px'>Hours</Text><Text width='60px'>Minutes</Text><Text width='60px'>Seconds</Text><Text width='60px'>Infinite</Text></HStack>
                  <HStack>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.days`, { onChange: e => handleCooldownChange('days', e, index) })} onClick={() => handleCooldownClick(index)} />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.hours`, { onChange: e => handleCooldownChange('hours', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.minutes`, { onChange: e => handleCooldownChange('minutes', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.seconds`, { onChange: e => handleCooldownChange('seconds', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <Switch
                      onChange={e => {
                        setValue(`forms.${index}.cooldown`, e.target.checked ? 0 : undefined );
                        setCooldownDisabled(e.target.checked)
                      }}
                      isDisabled={!premium}
                      colorScheme='blurple'
                    />
                  </HStack> */}
                </Box>
              </Collapsible >
              <hr />
              <Collapsible name="Pages">
                <PageBuilder {...{ index, control, premium, getValues, setValue, register, formState, watch, resetField, fixMessage, setDisplayPage, isOpenPremium, onOpenPremium, onClosePremium, setPremiumFeatureTarget }} />
              </Collapsible>
              <hr />
              <Collapsible name="Submission & Confirmation Messages">
                <VStack align={'flex-start'}>
                  {/* <HStack>
                    <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    <Text>This section is still in development and currently only supports the message content</Text>
                  </HStack> */}
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
                    <FormLabel htmlFor={`forms[${index}].guild_submit_message.content`} display='flex' alignItems='center'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].guild_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <textarea
                      {...register(`forms.${index}.guild_submit_message.content`, { maxLength: 2000, onChange: () => fixServerSubmissionMessage(index) })}
                      id={`forms.${index}.guild_submit_message.content`}
                      style={{ height: "99px" }}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.guild_submit_message?.content} />
                    {serverSubmissionMessage[index] === 'custom' && getValues(`forms.${index}.guild_submit_message`)?.content && !(JSON.stringify(getValues(`forms.${index}.guild_submit_message.content`)).match(/\{TextInputValue\d{1,2}\}/)) && <ErrorMessage severity={ErrorSeverity.Warning}>{'Don\'t forget to add variables such as {TextInputValue1}, {TextInputValue2} and so on, in order to see the submission contents.'}</ErrorMessage>}
                  </Box>}
                  {serverSubmissionMessage[index] === 'custom' && dmSubmissionMessage[index] === 'same_as_server' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='center'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <textarea
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.submit_message.content`}
                      style={{ height: "99px" }}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.submit_message?.content} />
                    {serverSubmissionMessage[index] === 'custom' && getValues(`forms.${index}.submit_message`)?.content && !(JSON.stringify(getValues(`forms.${index}.submit_message.content`)).match(/\{TextInputValue\d{1,2}\}/)) && <ErrorMessage severity={ErrorSeverity.Warning}>{'Don\'t forget to add variables such as {TextInputValue1}, {TextInputValue2} and so on, in order to see the submission contents.'}</ErrorMessage>}
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
                    <FormLabel htmlFor={`forms[${index}].dm_submit_message.content`} display='flex' alignItems='center'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].dm_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <textarea
                      {...register(`forms.${index}.dm_submit_message.content`, { maxLength: 2000, onChange: () => fixdmSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                      style={{ height: "99px" }}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.dm_submit_message?.content} />
                  </Box>}
                  {dmSubmissionMessage[index] === 'custom' && serverSubmissionMessage[index] === 'same_as_dm' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='center'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <textarea
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                      style={{ height: "99px" }}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.submit_message?.content} />
                  </Box>}
                  <FormLabel>Server Submission Buttons</FormLabel>
                  <HStack>
                    <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    <Text>Buttons can be used once and are then automatically disabled</Text>
                  </HStack>
                  <ActionRowBuilder control={control} i={index} getValues={getValues} resetField={resetField} setValue={setValue} register={register} errors={errors} watch={watch} premium={premium} {...{ setPremiumFeatureTarget, onOpenPremium }} />
                </VStack>
              </Collapsible>
            </Collapsible >
          </>);
        })}
      </ul >

      <section>
        <Button
          variant='primary'
          isDisabled={(getValues('message') && getValues('forms.0.select_menu_option') && getValues('forms').length >= 25) || (getValues('message') && !getValues('forms.0.select_menu_option') && getValues('message.components.0.components')?.length >= 5) || getValues('application_command') && getValues('forms').length >= 1}
          onClick={() => {
            if (openFormType === 'button') formMessageComponentsAppend({
              label: 'Open Form',
              custom_id: `{FormID${fields.length + 1}}`,
              style: 1,
              type: 2
            })
            append({
              pages: [{
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
              }]
            })
            setDisplayForm(fields.length)
            serverSubmissionMessage.push('default')
            dmSubmissionMessage.push('default')
            setSubmissionType('append', 'bot')
            setSubmissionChannel('append', 'existing')

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
