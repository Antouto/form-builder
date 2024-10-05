/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Control, FieldValues, FormState, UseFormGetValues, UseFormRegister, UseFormReset, UseFormResetField, UseFormSetValue, UseFormWatch, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayMove } from "react-hook-form";
import FormBuilder from "../components/FormBuilder";
import { Box, VStack, Button, Heading, useToast, HStack, Input, cssVar, Spinner, Text, FormLabel, useDisclosure, Link, Divider, Switch, Tooltip, Stack, Image } from "@chakra-ui/react";
import JSONViewer, { DOWNLOAD_SPINNER_TIME } from "../components/JSONViewer";
import ErrorMessage from "../components/ErrorMessage";
import OpenFormTypeBuilder from "./OpenFormTypeBuilder";
import { SlashCommand, UserMention } from "../components/Mention";
import ClearedValues from "../ClearedValues.json";
import { ActionRow, FormAndOpenFormTypeBuilder, ToastStyles } from "../util/types";
import { createName } from "../util/form";
import { useScreenWidth } from "../util/width";
// import { useRouter } from "next/router";

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import ApplicationCommandBuilder from "./ApplicationCommandBuilder";
import FormTitleInput from "./FormTitleInput";
import TextInputBuilder from "./TextInputBuilder";
import SubmissionChannelIDInput from "./SubmissionChannelIDInput";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";

import Cookies from 'js-cookie'

const Defaults = {
  Embed: {
    color: 5793266,
    title: "Example Form",
    description: "Fill out the form below!",
    author: {
      name: "",
      url: "",
      icon_url: "",
    },
    footer: {
      text: "",
      icon_url: "",
    },
  },
  Message: "Fill out the form below!",
};


export interface EditorProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  reset: UseFormReset<T>;
  displaySection: boolean;
  resetField: UseFormResetField<T>;
  stage: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  formMessageComponents: ActionRow[];
  formMessageComponentsAppend: UseFieldArrayAppend<T>;
  formMessageComponentsRemove: UseFieldArrayRemove;
  formMessageComponentsMove: UseFieldArrayMove;
}

export function Editor({
  displayForm,
  setDisplayForm,
  watch,
  getValues,
  setValue,
  formState,
  control,
  register,
  reset,
  displaySection,
  resetField,
  stage,
  setStage,
  formMessageComponents,
  formMessageComponentsAppend,
  formMessageComponentsRemove,
  formMessageComponentsMove,
  //@ts-expect-error
  displayPage,
  //@ts-expect-error
  setDisplayPage,
  //@ts-expect-error
  openFormType,
  //@ts-expect-error
  setOpenFormType,
  //@ts-expect-error
  setPremium,
  //@ts-expect-error
  premium,
  //@ts-expect-error
  _setPremium,
  //@ts-expect-error
  submissionType,
  //@ts-expect-error
  _setSubmissionType,
  //@ts-expect-error
  submissionChannel,
  //@ts-expect-error
  _setSubmissionChannel,
  //@ts-expect-error
  setPreset
}: EditorProps<FormAndOpenFormTypeBuilder>) {
  const toast = useToast();

  function postToast({
    title,
    description,
    style,
  }: {
    title: string;
    description?: string;
    style: ToastStyles;
  }) {
    return toast({
      title,
      description,
      status: style as unknown as undefined,
      containerStyle: {
        backgroundColor: "#5865f2",
        borderRadius: "0.3rem",
      },
      position: "bottom",
      duration: 3000,
      isClosable: true,
    });
  }

  const [cookieValue, setCookieValue] = useState(Cookies.get('discord_token') || ''); // Initialize state with existing cookie value

  useEffect(()=> {
    if(!cookieValue) window.location.replace('https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fform-builder.pages.dev%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds');
  }, [cookieValue])


  const [webhookUrlFocused, webhookUrlSetFocused] = useState(false);
  const { isOpen, onOpen: onOpenWhereDoIFindSubmissionChannelID, onClose } = useDisclosure()
  const { isOpen: isOpenPremium, onOpen: onOpenPremium, onClose: onClosePremium } = useDisclosure()
  const [premiumFeatureTarget, setPremiumFeatureTarget] = useState('custom_branding')

  const [fileInput, setFileInput] = useState<HTMLInputElement>();
  const [isReading, setReading] = useState(false);

  const ReadFile = (targetFile: React.ChangeEvent<HTMLInputElement>) => {
    setReading(true);
    function CannotRead() {
      return postToast({
        style: ToastStyles.Error,
        title: "Cannot read form",
      });
    }

    if (targetFile.target.files == null) return CannotRead();

    const file = targetFile.target.files[0];
    console.log(file, targetFile.target.files);
    const fileType = file.type;
    function makeError() {
      return postToast({
        title: "Invalid JSON File",
        style: ToastStyles.Error,
      });
    }

    if (fileType !== "application/json") {
      makeError();
      //@ts-expect-error
      targetFile.target.value = null;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result != "string") return CannotRead();
      const json = JSON.parse(e.target.result) as FormAndOpenFormTypeBuilder;

      // Log for debugging purposes
      console.log(json);

      if (
        json?.forms == null ||
        !Array.isArray(json?.forms) ||
        (json?.message == null && json?.application_command == null)
      ) {
        return makeError();
      }

      // Validator for the number of forms
      // 🔗 https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal
      if (json.forms.length > 25) {
        json.forms.length = 25;
      }

      // Add the json.forms array to the form hook
      setValue("forms", json.forms);

      if (!json.forms?.[0].select_menu_option) {
        setOpenFormType("button", false);
      } else if (json.forms[0].select_menu_option) {
        setOpenFormType("select_menu", false);
      } else if (json.application_command) {
        setOpenFormType("application_command", false);
      }

      //@ts-expect-error
      let newSubmissionType = []
      //@ts-expect-error
      let newSubmissionChannel = []
      json.forms.forEach((form, i) => {
        if (form.webhook_url) setPremium(true)
        if (form.submit_channel) {
          setTimeout(() => {
            //@ts-expect-error
            if (form.submit_channel?.parent_id === '') setValue(`forms.${i}.submit_channel.parent_id`, undefined)

            //@ts-expect-error
            if (getValues(`forms.${i}.submit_channel.permission_overwrites`)) getValues(`forms.${i}.submit_channel.permission_overwrites`).forEach((overwrite, ii) => {
              console.log('overwrite', overwrite)
              //@ts-expect-error
              if (overwrite.allow === '') setValue(`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`, undefined)
              //@ts-expect-error
              if (overwrite.deny === '') setValue(`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`, undefined)
            })
          }, 1);
        }
        if (form.submit_components) {
          //@ts-expect-error
          form.submit_components.forEach((action_row, ii) => {
            if (action_row.components) {
              //@ts-expect-error
              action_row.components.forEach((component, iii) => {
                if (component?.logic && component?.logic?.REQUIRED_PERMISSIONS) setPremium(true)
                setTimeout(() => {
                  if (component?.logic?.UPDATE_THIS_CHANNEL?.permission_overwrites) {
                    //@ts-expect-error
                    getValues(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites`).forEach((overwrite, iiii) => {
                      //@ts-expect-error
                      if (overwrite.allow === '') setValue(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.allow`, undefined)
                      //@ts-expect-error
                      if (overwrite.deny === '') setValue(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.deny`, undefined)
                    })
                  }
                }, 1)
              })
            }
          })
        }



        if (form.webhook_url) {
          newSubmissionType.push('webhook_url')
        } else {
          newSubmissionType.push('bot')
        }

        if (form.submit_channel) {
          newSubmissionChannel.push('new')
        } else if (form.submit_thread) {
          newSubmissionChannel.push('new_thread')
        } else {
          newSubmissionChannel.push('existing')
        }
      });
      //@ts-expect-error
      _setSubmissionType(newSubmissionType)
      //@ts-expect-error
      _setSubmissionChannel(newSubmissionChannel)
      if (!json.application_command) {
        // Add the json.message object to the form hook
        setValue("message", json.message);
      }

      if (json.select_menu_placeholder) setValue("select_menu_placeholder", json.select_menu_placeholder);

      setReading(false);
      // Send a toast the the user notifying that the form has
      // been uploaded
      postToast({
        title: "Form Uploaded",
        style: ToastStyles.Success,
      });
    };

    reader.readAsText(file);
    return;
  };

  const downloadForm = () => {
    setTimeout(() => {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(watch(), null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = createName({ getValues }) + ".json";
      link.click();
    }, 500);
  };

  const [loading, setLoading] = useState(false);
  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
  };

  const isSmallScreen = !useScreenWidth(1070);
  const isReallySmallScreen = !useScreenWidth(500);



  function setSubmissionType(type: string, value: string, index: number) {
    let newSubmissionType = submissionType
    switch (type) {
      case 'edit': {
        newSubmissionType[index] = value
        _setSubmissionType(newSubmissionType)
        switch (value) {
          case 'bot': setValue(`forms.${index}.webhook_url`, undefined); break;
          case 'webhook': setValue(`forms.${index}.submit_channel_id`, undefined); setSubmissionChannel('edit', 'existing', index); break;
        }
        break;
      }
      case 'append': {
        newSubmissionType.push(value)
        break;
      }
      case 'delete': {
        newSubmissionType.splice(value, 1)
        break;
      }
    }
  }
  function setSubmissionChannel(type: string, value: string, index: number) {
    let newSubmissionChannel = submissionChannel
    switch (type) {
      case 'edit': {
        newSubmissionChannel[index] = value
        _setSubmissionChannel(newSubmissionChannel)
        switch (value) {
          case 'existing': {
            setValue(`forms.${index}.submit_channel`, undefined);
            setValue(`forms.${index}.submit_thread`, undefined);
            break;
          }
          case 'new': {
            setValue(`forms.${index}.submit_thread`, undefined);
            setValue(`forms.${index}.webhook_url`, undefined);
            setValue(`forms.${index}.submit_channel_id`, undefined);
            //@ts-expect-error
            setValue(`forms.${index}.submit_channel.type`, 0);
            //@ts-expect-error
            setValue(`forms.${index}.submit_channel.name`, 'ticket');
            //@ts-expect-error
            setValue(`forms.${index}.submit_channel.permission_overwrites`, [
              {
                id: '{ServerID}',
                type: 0,
                deny: 1024
              },
              {
                id: '{ApplicationID}',
                type: 1,
                allow: 19456
              },
              {
                id: '{UserID}',
                type: 1,
                allow: 52224
              }
            ]);
            setTimeout(() => {
              //@ts-expect-error
              if (getValues(`forms.${index}.submit_channel.parent_id`) === '') setValue(`forms.${index}.submit_channel.parent_id`, undefined)
              //@ts-expect-error
              getValues(`forms.${index}.submit_channel.permission_overwrites`).map((overwrite, i) => {
                //@ts-expect-error
                if (overwrite.allow === '') setValue(`forms.${index}.submit_channel.permission_overwrites.${i}.allow`, undefined)
                //@ts-expect-error
                if (overwrite.deny === '') setValue(`forms.${index}.submit_channel.permission_overwrites.${i}.deny`, undefined)
              })
            }, 1);
            break;
          }
          case 'new_thread': {
            setValue(`forms.${index}.submit_channel`, undefined);
            setValue(`forms.${index}.submit_thread`, undefined);
            setValue(`forms.${index}.webhook_url`, undefined);

            setValue(`forms.${index}.submit_thread`, {
              name: 'ticket',
              type: 12,
              add_submitter: true
            });
            break;
          }
        }
        break;
      }
      case 'append': {
        newSubmissionChannel.push(value)
        break;
      }
      case 'delete': {
        newSubmissionChannel.splice(index, 1)
        break;
      }
    }
  }

  // function handleCooldownChange(unit, e, index) {
  //   let prev = getValues(`forms.${index}.cooldown`)
  //   if (typeof prev !== 'object') prev = {}

  //   const updated = {
  //     days: parseInt(prev.days) || undefined,
  //     hours: parseInt(prev.hours) || undefined,
  //     minutes: parseInt(prev.minutes) || undefined,
  //     seconds: parseInt(prev.seconds) || undefined,
  //     ...unit && { [unit]: Number.isInteger(parseInt(e.target.value)) ? parseInt(e.target.value) : undefined }
  //   }

  //   let numKeys = 0;
  //   if (updated.days) numKeys++
  //   if (updated.hours) numKeys++
  //   if (updated.minutes) numKeys++
  //   if (updated.seconds) numKeys++

  //   setValue(`forms.${index}.cooldown`, numKeys ? updated : undefined)

  // }

  function fixMessage() {
    const message = getValues("message");
    if (!message) return;
    const { content, embeds } = message;
    if (!content) setValue(`message.content`, undefined);
    if (embeds?.length) {
      for (let i = 0; i < embeds.length; i++) {
        const { title, description, color, image, author, footer } = embeds[i];
        if (!author?.name && !author?.icon_url && !author?.url) {
          setValue(`message.embeds.${i}.author`, undefined);
        } else {
          //@ts-expect-error
          if (!author?.name) setValue(`message.embeds.${i}.author.name`, undefined);
          if (!author?.icon_url)
            //@ts-expect-error
            setValue(`message.embeds.${i}.author.icon_url`, undefined);
          //@ts-expect-error
          if (!author?.url) setValue(`message.embeds.${i}.author.url`, undefined);
        }
        if (!title) setValue(`message.embeds.${i}.title`, undefined);
        if (!description) setValue(`message.embeds.${i}.description`, undefined);
        if (typeof color === "string" && color.length) {
          setValue(`message.embeds.${i}.color`, parseInt(color));
        }
        if (typeof color === "string" && !color.length) {
          setValue(`message.embeds.${i}.color`, undefined);
        }
        if (!image?.url) setValue(`message.embeds.${i}.image`, undefined);
        if (!footer?.text && !footer?.icon_url) {
          setValue(`message.embeds.${i}.footer`, undefined);
        } else {
          //@ts-expect-error
          if (!footer?.text) setValue(`message.embeds.${i}.footer.text`, undefined);
          if (!footer?.icon_url)
            //@ts-expect-error
            setValue(`message.embeds.${i}.footer.icon_url`, undefined);
        }
      }
    } else {
      setValue(`message.embeds`, undefined);
    }

    // Also fix text inputs
    if (watch("forms")?.length)
      for (let i = 0; i < watch("forms")?.length; i++) {
        // handleCooldownChange(null, null, i)
        for (let ii = 0; ii < watch(`forms.${i}.pages`)?.length; ii++) {
          for (
            let iii = 0;
            iii < watch(`forms.${i}.pages.${ii}.modal.components`).length;
            iii++
          ) {
            setTimeout(() => {
              if (
                !watch(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.placeholder`
                )
              )
                setValue(
                  //@ts-expect-error
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.placeholder`, undefined
                );
              if (!watch(`forms.${i}.pages.${ii}.modal.components.${iii}.components.0.value`))
                setValue(
                  //@ts-expect-error
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.value`, undefined
                );

              if (
                typeof watch(
                  `forms.${ii}.pages.${ii}.modal.components.${iii}.components.0.style`
                ) === "string"
              )
                setValue(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.style`,
                  //@ts-expect-error
                  parseInt(
                    watch(
                      `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.style`
                    ) as unknown as string
                  )
                );
            }, 1);
          }
        }
      }
  }

  function fixSubmitChannel(index: any) {
    //@ts-expect-error
    if (!getValues(`forms.${index}.submit_channel.parent_id`)) setValue(`forms.${index}.submit_channel.parent_id`, undefined)
  }

  return (
    <>
      <VStack
        align="flex-start"
        overflowY="scroll"
        p="16px"
        height="calc(100vh - 48px);"
        display={displaySection ? "flex" : "none"}
      >{stage === 'editor' && <>
        <Stack direction={isReallySmallScreen ? 'column' : 'row'} justifyContent='space-between' width='100%'>
          <HStack>
            <Button
              onClick={() => {
                if (fileInput == null) {
                  return postToast({
                    title: "Something didn't go right.",
                    style: ToastStyles.Error,
                  });
                } else fileInput.click();
              }}
              variant="secondary"
              isLoading={isReading}
            >
              Upload JSON
            </Button>
            <Input
              id="json"
              type="file"
              accept=".json"
              display="none"
              onChange={ReadFile}
              ref={(input) => {
                if (input != null) {
                  setFileInput(input);
                }
              }}
            />
            <Button variant="danger-outline" onClick={() => {
              //@ts-expect-error
              reset(ClearedValues)
              setOpenFormType('button', false)
              _setSubmissionType(['bot'])
              _setSubmissionChannel(['existing'])
            }}>
              Clear All
            </Button>
          </HStack>
          <HStack border='2px solid #1C5CBE' backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' borderRadius={8} p={2} justifyContent='space-between'>
            <HStack><Switch
              variant='green'
              onChange={(event) => setPremium(event.target.checked)}
              isChecked={premium}
            />
              <Text>Use premium features</Text>
              <Tooltip hasArrow label={
                'When enabled forms will only work in servers with an active premium subscription. Premium includes custom branding.'
              } placement='right' shouldWrapChildren bg="#181414">
                <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
              </Tooltip></HStack>
            <Link href="https://forms.lemonsqueezy.com/buy/6c238e6d-28f7-44ea-b965-b2f8c9e2512b" target="_blank"><Button variant='link-outline'>Upgrade</Button></Link>
          </HStack>

        </Stack>
        <OpenFormTypeBuilder
          {...{
            Defaults,
            getValues,
            resetField,
            control,
            formState,
            register,
            setValue,
            openFormType,
            setOpenFormType,
            fixMessage,
            watch,
            formMessageComponents,
            formMessageComponentsAppend,
            formMessageComponentsRemove,
            formMessageComponentsMove,
            premium
          }}
        />
        <FormBuilder
          {...{
            control,
            register,
            getValues,
            setValue,
            resetField,
            formState,
            watch,
            displayForm,
            setDisplayForm,
            fixMessage,
            // handleCooldownChange,
            webhookUrlFocused,
            webhookUrlSetFocused,
            premium,
            submissionType,
            setSubmissionType,
            submissionChannel,
            setSubmissionChannel,
            onOpenWhereDoIFindSubmissionChannelID,
            fixSubmitChannel,
            formMessageComponents,
            formMessageComponentsAppend,
            formMessageComponentsRemove,
            openFormType,
            displayPage,
            setDisplayPage,
            isOpenPremium,
            onOpenPremium,
            onClosePremium,
            setPremiumFeatureTarget
          }}
        />
        <VStack width="100%" align="flex-start">
          <Heading size="sm" marginBottom="5px">
            Form Configuration File
          </Heading>
          <Box>
            This is the configuration file you'll need to give to the{" "}
            <UserMention isFormsBot>Forms</UserMention> bot to create your form.
            The <UserMention isFormsBot>Forms</UserMention> bot needs to be in
            your server.
          </Box>
          <JSONViewer {...{ downloadForm, getValues }}>
            {JSON.stringify(watch(), null, 2)}
          </JSONViewer>
          <VStack alignItems="flex-start">
            <HStack alignItems="flex-start">
              <Button
                variant="success"
                //@ts-expect-error
                isDisabled={
                  !formState.isValid ||
                  watch("forms").length >
                  (watch("application_command")
                    ? 1
                    : getValues("message") &&
                      getValues("forms.0.select_menu_option")
                      ? 25
                      : 5) ||
                  (getValues("message.embeds")?.length &&
                    (() => {
                      const embeds = getValues("message.embeds");
                      if (embeds != undefined) {
                        for (const {
                          title,
                          description,
                          author,
                          footer,
                        } of embeds) {
                          if (
                            !(
                              title ||
                              description ||
                              author?.name ||
                              footer?.text
                            )
                          )
                            return true;
                        }
                      }
                    })())
                }
                onClick={() => {
                  handleLoad();
                  downloadForm();
                }}
                width={225}
              // bgColor={loading ? "#215b32" : undefined}
              >
                {!loading && "Download Configuration File"}
                {loading && <Spinner size="sm" />}
              </Button>
              <Link href='https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=805309456&scope=bot+applications.commands' target='_blank' rel='noopener noreferrer'><Button variant='success-outline'>Invite Bot</Button></Link>
            </HStack>
            {(!formState.isValid ||
              watch("forms").length >
              (watch("application_command")
                ? 1
                : getValues("message") &&
                  getValues("forms.0.select_menu_option")
                  ? 25
                  : 5) ||
              (getValues("message.embeds")?.length &&
                (() => {
                  const embeds = getValues("message.embeds");
                  if (embeds != undefined) {
                    for (const {
                      title,
                      description,
                      author,
                      image,
                      footer,
                    } of embeds) {
                      if (
                        !(
                          title ||
                          description ||
                          author?.name ||
                          image?.url ||
                          footer?.text
                        )
                      )
                        return true;
                    }
                  }
                })())) && (
                <ErrorMessage>
                  Fill out the fields correctly before downloading the configuration
                  file.
                </ErrorMessage>
              )}
          </VStack>
          <Box>
            Upload the configuration file using the{" "}
            <SlashCommand>form create</SlashCommand> command on the{" "}
            <UserMention isFormsBot>Forms</UserMention> bot.
          </Box>
        </VStack></>
        }
        {stage === 'welcome' && <><Text mt={5} align='center' width='100%' fontSize={30} fontFamily='Whitney Bold'>Create a form</Text><VStack align='center' gap={4} mt='30px' width='100%'>
          <Button variant='primary' onClick={() => setPreset()}>Start quick setup</Button>
          <Text fontSize={18} my={4}>or start from a template</Text>
          <VStack>
            <Text fontSize={19}  fontFamily='Whitney Bold'>Free templates</Text>
            <Button variant='primary-outline' onClick={() => setPreset('application')}>Application</Button>
          </VStack>
          <VStack>
            <Text fontSize={19}  fontFamily='Whitney Bold'>Premium templates</Text>
            <Button variant='primary-outline' onClick={() => setPreset('thread_ticket')}>Thread Ticket System</Button>
            <Button variant='primary-outline' onClick={() => setPreset('ticket')}>Channel Ticket System</Button>
          </VStack>
          <VStack>
            <Text fontSize={19}  fontFamily='Whitney Bold'>Advanced</Text>
            <Button variant='secondary' onClick={() => setStage('editor')}>Open full editor</Button>
          </VStack>
          <a href='https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fform-builder.pages.dev%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds'>
      <button style={{color: 'darkgray'}}>{cookieValue ? `Cookie Value: ${cookieValue}` : '-'}</button>
    </a>
        </VStack></>}
        {stage === 'useCase' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>What kind of form would you like to create?</Text>
          <VStack align='center' mt={10} width='100%' gap={10}>
            <VStack align='left'>
              <FormLabel fontSize={18}>Basic</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => setOpenFormType('button')} border={openFormType === 'button' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>



                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports up to 5 different forms per message.</Text>
              </Box>
              <FormLabel fontSize={18}>Application</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => setOpenFormType('select_menu')} border={openFormType === 'select_menu' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>



                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports up to 25 different forms per message.</Text>
              </Box>
              <FormLabel fontSize={18}>Ticket</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => setOpenFormType('application_command')} border={openFormType === 'application_command' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>



                  <Image height='100%' src='https://cdn.discordapp.com/attachments/943471614580903956/1241452276246118400/Screenshot_2024-05-18_at_19.57.40.png?ex=664a4007&is=6648ee87&hm=51ee3e0c269ede6a9f27617fc52c4f45129f4b944e7ebbef527c91212699a8ae&'></Image>






                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports 1 form per command.</Text>
              </Box>
            </VStack>
            <HStack>
              <Button variant='secondary' onClick={() => setStage('welcome')}>Go back</Button>
              <Button variant='primary' onClick={() => {
                switch (openFormType) {
                  case 'application_command': setStage('applicationCommand'); break;
                  case 'button': case 'select_menu': setStage('form'); break;
                }
              }}>Continue</Button>
            </HStack>
          </VStack></>}
        {stage === 'openFormType' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>How should users open your form?</Text>
          <VStack align='center' mt={10} width='100%' gap={10}>
            <VStack align='left'>
              <FormLabel fontSize={18}>Buttons</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => {
                  if (openFormType === 'button') setStage('form')
                  setOpenFormType('button')
                }} border={openFormType === 'button' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>

                  <svg width="225" height="100" viewBox="0 0 192 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="192" height="68" rx="4" fill="#36393F" />
                    <rect x="8" y="6" width="27.1169" height="27.1169" rx="13.5585" fill="#616AF2" />
                    <circle cx="15.5332" cy="15.8429" r="1.29877" fill="white" />
                    <circle cx="15.5332" cy="23.6355" r="1.29877" fill="white" />
                    <circle cx="15.5332" cy="19.7393" r="1.29877" fill="white" />
                    <rect x="18.1307" y="14.8688" width="10.0655" height="1.94815" rx="0.974076" fill="white" />
                    <rect x="18.1307" y="18.7651" width="9.41607" height="1.94815" rx="0.974076" fill="white" />
                    <rect x="18.1307" y="22.6615" width="10.3901" height="1.94815" rx="0.974076" fill="white" />
                    <path d="M45.6006 9.82752V16.9369H44.6582V9.82752H45.6006ZM48.5791 13.0258V13.7973H45.3955V13.0258H48.5791ZM49.0625 9.82752V10.599H45.3955V9.82752H49.0625ZM49.7021 14.3539V14.2416C49.7021 13.8607 49.7575 13.5075 49.8682 13.182C49.9788 12.8532 50.1383 12.5684 50.3467 12.3275C50.555 12.0834 50.8073 11.8946 51.1035 11.7611C51.3997 11.6244 51.7318 11.556 52.0996 11.556C52.4707 11.556 52.8044 11.6244 53.1006 11.7611C53.4001 11.8946 53.654 12.0834 53.8623 12.3275C54.0739 12.5684 54.235 12.8532 54.3457 13.182C54.4564 13.5075 54.5117 13.8607 54.5117 14.2416V14.3539C54.5117 14.7348 54.4564 15.0879 54.3457 15.4135C54.235 15.739 54.0739 16.0238 53.8623 16.268C53.654 16.5088 53.4017 16.6976 53.1055 16.8344C52.8125 16.9678 52.4805 17.0346 52.1094 17.0346C51.7383 17.0346 51.4046 16.9678 51.1084 16.8344C50.8122 16.6976 50.5583 16.5088 50.3467 16.268C50.1383 16.0238 49.9788 15.739 49.8682 15.4135C49.7575 15.0879 49.7021 14.7348 49.7021 14.3539ZM50.6055 14.2416V14.3539C50.6055 14.6176 50.6364 14.8666 50.6982 15.101C50.7601 15.3321 50.8529 15.5372 50.9766 15.7162C51.1035 15.8952 51.2614 16.0368 51.4502 16.141C51.639 16.2419 51.8587 16.2924 52.1094 16.2924C52.3568 16.2924 52.5732 16.2419 52.7588 16.141C52.9476 16.0368 53.1038 15.8952 53.2275 15.7162C53.3512 15.5372 53.444 15.3321 53.5059 15.101C53.571 14.8666 53.6035 14.6176 53.6035 14.3539V14.2416C53.6035 13.9812 53.571 13.7354 53.5059 13.5043C53.444 13.2699 53.3496 13.0632 53.2227 12.8842C53.099 12.7019 52.9427 12.5586 52.7539 12.4545C52.5684 12.3503 52.3503 12.2982 52.0996 12.2982C51.8522 12.2982 51.6341 12.3503 51.4453 12.4545C51.2598 12.5586 51.1035 12.7019 50.9766 12.8842C50.8529 13.0632 50.7601 13.2699 50.6982 13.5043C50.6364 13.7354 50.6055 13.9812 50.6055 14.2416ZM56.5479 12.4838V16.9369H55.6445V11.6537H56.5234L56.5479 12.4838ZM58.1982 11.6244L58.1934 12.4642C58.1185 12.448 58.0469 12.4382 57.9785 12.4349C57.9134 12.4284 57.8385 12.4252 57.7539 12.4252C57.5456 12.4252 57.3617 12.4577 57.2021 12.5228C57.0426 12.5879 56.9076 12.6791 56.7969 12.7963C56.6862 12.9135 56.5983 13.0534 56.5332 13.2162C56.4714 13.3757 56.4307 13.5515 56.4111 13.7435L56.1572 13.89C56.1572 13.571 56.1882 13.2715 56.25 12.9916C56.3151 12.7116 56.4144 12.4642 56.5479 12.2494C56.6813 12.0313 56.8506 11.862 57.0557 11.7416C57.264 11.6179 57.5114 11.556 57.7979 11.556C57.863 11.556 57.9378 11.5642 58.0225 11.5805C58.1071 11.5935 58.1657 11.6081 58.1982 11.6244ZM59.9316 12.7035V16.9369H59.0234V11.6537H59.8828L59.9316 12.7035ZM59.7461 14.0951L59.3262 14.0805C59.3294 13.7191 59.3766 13.3855 59.4678 13.0795C59.5589 12.7702 59.694 12.5017 59.873 12.2738C60.0521 12.0459 60.2751 11.8702 60.542 11.7465C60.8089 11.6195 61.1182 11.556 61.4697 11.556C61.7171 11.556 61.945 11.5918 62.1533 11.6635C62.3617 11.7318 62.5423 11.8409 62.6953 11.9906C62.8483 12.1403 62.9671 12.3324 63.0518 12.5668C63.1364 12.8012 63.1787 13.0844 63.1787 13.4164V16.9369H62.2754V13.4603C62.2754 13.1836 62.2282 12.9623 62.1338 12.7963C62.0426 12.6303 61.9124 12.5098 61.7432 12.4349C61.5739 12.3568 61.3753 12.3178 61.1475 12.3178C60.8805 12.3178 60.6576 12.365 60.4785 12.4594C60.2995 12.5538 60.1562 12.684 60.0488 12.85C59.9414 13.016 59.8633 13.2064 59.8145 13.4213C59.7689 13.6329 59.7461 13.8575 59.7461 14.0951ZM63.1689 13.5971L62.5635 13.7826C62.5667 13.4929 62.6139 13.2146 62.7051 12.9476C62.7995 12.6807 62.9346 12.4431 63.1104 12.2348C63.2894 12.0264 63.5091 11.862 63.7695 11.7416C64.0299 11.6179 64.3278 11.556 64.6631 11.556C64.9463 11.556 65.1969 11.5935 65.415 11.6683C65.6364 11.7432 65.8219 11.8588 65.9717 12.015C66.1247 12.168 66.2402 12.365 66.3184 12.6058C66.3965 12.8467 66.4355 13.1332 66.4355 13.4652V16.9369H65.5273V13.4555C65.5273 13.1592 65.4801 12.9297 65.3857 12.767C65.2946 12.601 65.1644 12.4854 64.9951 12.4203C64.8291 12.3519 64.6305 12.3178 64.3994 12.3178C64.2008 12.3178 64.0251 12.3519 63.8721 12.4203C63.7191 12.4887 63.5905 12.5831 63.4863 12.7035C63.3822 12.8207 63.3024 12.9558 63.2471 13.1088C63.195 13.2618 63.1689 13.4245 63.1689 13.5971ZM70.8789 15.5355C70.8789 15.4053 70.8496 15.2849 70.791 15.1742C70.7357 15.0603 70.6201 14.9577 70.4443 14.8666C70.2718 14.7722 70.0114 14.6908 69.6631 14.6224C69.3701 14.5606 69.1048 14.4874 68.8672 14.4027C68.6328 14.3181 68.4326 14.2155 68.2666 14.0951C68.1038 13.9747 67.9785 13.8331 67.8906 13.6703C67.8027 13.5075 67.7588 13.3171 67.7588 13.099C67.7588 12.8907 67.8044 12.6937 67.8955 12.5082C67.9899 12.3226 68.1217 12.1583 68.291 12.015C68.4635 11.8718 68.6702 11.7595 68.9111 11.6781C69.152 11.5967 69.4206 11.556 69.7168 11.556C70.14 11.556 70.5013 11.6309 70.8008 11.7806C71.1003 11.9304 71.3298 12.1306 71.4893 12.3812C71.6488 12.6286 71.7285 12.9037 71.7285 13.2064H70.8252C70.8252 13.0599 70.7812 12.9183 70.6934 12.7816C70.6087 12.6417 70.4834 12.5261 70.3174 12.4349C70.1546 12.3438 69.9544 12.2982 69.7168 12.2982C69.4661 12.2982 69.2627 12.3373 69.1064 12.4154C68.9535 12.4903 68.8411 12.5863 68.7695 12.7035C68.7012 12.8207 68.667 12.9444 68.667 13.0746C68.667 13.1723 68.6833 13.2601 68.7158 13.3383C68.7516 13.4131 68.8135 13.4831 68.9014 13.5482C68.9893 13.6101 69.113 13.6687 69.2725 13.724C69.432 13.7793 69.6354 13.8347 69.8828 13.89C70.3158 13.9877 70.6722 14.1049 70.9521 14.2416C71.2321 14.3783 71.4404 14.5459 71.5771 14.7445C71.7139 14.9431 71.7822 15.184 71.7822 15.4672C71.7822 15.6983 71.7334 15.9099 71.6357 16.1019C71.5413 16.294 71.403 16.46 71.2207 16.6C71.0417 16.7367 70.8268 16.8441 70.5762 16.9223C70.3288 16.9971 70.0505 17.0346 69.7412 17.0346C69.2757 17.0346 68.8818 16.9515 68.5596 16.7855C68.2373 16.6195 67.9932 16.4047 67.8271 16.141C67.6611 15.8773 67.5781 15.599 67.5781 15.306H68.4863C68.4993 15.5534 68.571 15.7504 68.7012 15.8969C68.8314 16.0401 68.9909 16.1426 69.1797 16.2045C69.3685 16.2631 69.5557 16.2924 69.7412 16.2924C69.9886 16.2924 70.1953 16.2598 70.3613 16.1947C70.5306 16.1296 70.6592 16.0401 70.7471 15.9262C70.835 15.8122 70.8789 15.682 70.8789 15.5355Z" fill="#5296D5" />
                    <rect x="77.2449" y="8.39844" width="19" height="10" rx="2" fill="#5865F2" />
                    <path d="M82.3399 11.3893L80.8531 15.7028H79.9542L81.8272 10.7262H82.4014L82.3399 11.3893ZM83.584 15.7028L82.0938 11.3893L82.0289 10.7262H82.6065L84.4864 15.7028H83.584ZM83.5123 13.8571V14.5373H80.8052V13.8571H83.5123ZM86.9337 13.8468H85.6382V13.1667H86.9337C87.1592 13.1667 87.3415 13.1302 87.4805 13.0573C87.6195 12.9844 87.7209 12.8841 87.7847 12.7565C87.8508 12.6266 87.8839 12.4785 87.8839 12.3122C87.8839 12.1549 87.8508 12.008 87.7847 11.8712C87.7209 11.7322 87.6195 11.6206 87.4805 11.5363C87.3415 11.452 87.1592 11.4098 86.9337 11.4098H85.9014V15.7028H85.0435V10.7262H86.9337C87.3187 10.7262 87.6457 10.7946 87.9146 10.9313C88.1858 11.0657 88.392 11.2526 88.5333 11.4918C88.6745 11.7288 88.7452 12 88.7452 12.3053C88.7452 12.6266 88.6745 12.9023 88.5333 13.1325C88.392 13.3626 88.1858 13.5392 87.9146 13.6623C87.6457 13.7853 87.3187 13.8468 86.9337 13.8468ZM91.4044 13.8468H90.1089V13.1667H91.4044C91.6299 13.1667 91.8122 13.1302 91.9512 13.0573C92.0902 12.9844 92.1916 12.8841 92.2554 12.7565C92.3215 12.6266 92.3546 12.4785 92.3546 12.3122C92.3546 12.1549 92.3215 12.008 92.2554 11.8712C92.1916 11.7322 92.0902 11.6206 91.9512 11.5363C91.8122 11.452 91.6299 11.4098 91.4044 11.4098H90.3721V15.7028H89.5142V10.7262H91.4044C91.7894 10.7262 92.1164 10.7946 92.3853 10.9313C92.6565 11.0657 92.8627 11.2526 93.004 11.4918C93.1452 11.7288 93.2159 12 93.2159 12.3053C93.2159 12.6266 93.1452 12.9023 93.004 13.1325C92.8627 13.3626 92.6565 13.5392 92.3853 13.6623C92.1164 13.7853 91.7894 13.8468 91.4044 13.8468Z" fill="white" />
                    <path d="M105.757 10.1866V15.9054H105.034V11.089L103.577 11.6202V10.9679L105.644 10.1866H105.757ZM111.468 14.3663C111.468 14.7127 111.387 15.0069 111.226 15.2491C111.067 15.4887 110.851 15.671 110.577 15.796C110.306 15.921 110 15.9835 109.659 15.9835C109.318 15.9835 109.011 15.921 108.737 15.796C108.464 15.671 108.248 15.4887 108.089 15.2491C107.93 15.0069 107.851 14.7127 107.851 14.3663C107.851 14.1397 107.894 13.9327 107.98 13.7452C108.068 13.5551 108.192 13.3897 108.351 13.2491C108.512 13.1085 108.702 13.0004 108.921 12.9249C109.142 12.8468 109.386 12.8077 109.651 12.8077C110 12.8077 110.312 12.8754 110.585 13.0108C110.858 13.1437 111.073 13.3272 111.23 13.5616C111.388 13.796 111.468 14.0642 111.468 14.3663ZM110.741 14.3507C110.741 14.1397 110.696 13.9536 110.605 13.7921C110.513 13.628 110.386 13.5004 110.222 13.4093C110.058 13.3181 109.868 13.2726 109.651 13.2726C109.43 13.2726 109.239 13.3181 109.077 13.4093C108.918 13.5004 108.795 13.628 108.706 13.7921C108.618 13.9536 108.573 14.1397 108.573 14.3507C108.573 14.5694 108.616 14.7569 108.702 14.9132C108.791 15.0668 108.916 15.1853 109.077 15.2687C109.241 15.3494 109.435 15.3897 109.659 15.3897C109.883 15.3897 110.076 15.3494 110.237 15.2687C110.399 15.1853 110.523 15.0668 110.608 14.9132C110.697 14.7569 110.741 14.5694 110.741 14.3507ZM111.335 11.6983C111.335 11.9744 111.262 12.2231 111.116 12.4444C110.97 12.6658 110.771 12.8403 110.519 12.9679C110.266 13.0955 109.98 13.1593 109.659 13.1593C109.334 13.1593 109.043 13.0955 108.788 12.9679C108.536 12.8403 108.338 12.6658 108.194 12.4444C108.051 12.2231 107.98 11.9744 107.98 11.6983C107.98 11.3676 108.051 11.0864 108.194 10.8546C108.34 10.6228 108.539 10.4457 108.792 10.3233C109.045 10.2009 109.332 10.1397 109.655 10.1397C109.981 10.1397 110.27 10.2009 110.523 10.3233C110.775 10.4457 110.973 10.6228 111.116 10.8546C111.262 11.0864 111.335 11.3676 111.335 11.6983ZM110.612 11.7101C110.612 11.52 110.572 11.352 110.491 11.2062C110.411 11.0603 110.299 10.9457 110.155 10.8624C110.012 10.7765 109.845 10.7335 109.655 10.7335C109.465 10.7335 109.299 10.7739 109.155 10.8546C109.015 10.9327 108.904 11.0447 108.823 11.1905C108.745 11.3364 108.706 11.5095 108.706 11.7101C108.706 11.9054 108.745 12.0759 108.823 12.2218C108.904 12.3676 109.016 12.4809 109.159 12.5616C109.302 12.6424 109.469 12.6827 109.659 12.6827C109.849 12.6827 110.015 12.6424 110.155 12.5616C110.299 12.4809 110.411 12.3676 110.491 12.2218C110.572 12.0759 110.612 11.9054 110.612 11.7101ZM114.976 10.2179L112.605 16.3937H111.983L114.358 10.2179H114.976ZM119.257 12.6085V13.4757C119.257 13.9418 119.215 14.3351 119.132 14.6554C119.049 14.9757 118.929 15.2335 118.773 15.4288C118.616 15.6241 118.427 15.7661 118.206 15.8546C117.987 15.9405 117.74 15.9835 117.464 15.9835C117.245 15.9835 117.043 15.9562 116.858 15.9015C116.674 15.8468 116.507 15.7595 116.358 15.6397C116.213 15.5174 116.088 15.3585 115.983 15.1632C115.879 14.9679 115.8 14.7309 115.745 14.4522C115.69 14.1736 115.663 13.8481 115.663 13.4757V12.6085C115.663 12.1424 115.705 11.7517 115.788 11.4366C115.874 11.1215 115.995 10.8689 116.151 10.6788C116.308 10.4861 116.495 10.3481 116.714 10.2647C116.935 10.1814 117.183 10.1397 117.456 10.1397C117.677 10.1397 117.881 10.1671 118.065 10.2218C118.253 10.2739 118.42 10.3585 118.565 10.4757C118.711 10.5903 118.835 10.7439 118.937 10.9366C119.041 11.1267 119.12 11.3598 119.175 11.6358C119.23 11.9119 119.257 12.2361 119.257 12.6085ZM118.53 13.5929V12.4874C118.53 12.2322 118.515 12.0082 118.483 11.8155C118.455 11.6202 118.412 11.4536 118.355 11.3155C118.297 11.1775 118.224 11.0655 118.136 10.9796C118.05 10.8937 117.95 10.8312 117.835 10.7921C117.723 10.7504 117.597 10.7296 117.456 10.7296C117.284 10.7296 117.132 10.7621 116.999 10.8272C116.866 10.8897 116.754 10.99 116.663 11.128C116.575 11.2661 116.507 11.447 116.46 11.671C116.413 11.895 116.39 12.1671 116.39 12.4874V13.5929C116.39 13.8481 116.404 14.0733 116.433 14.2687C116.464 14.464 116.51 14.6332 116.569 14.7765C116.629 14.9171 116.702 15.033 116.788 15.1241C116.874 15.2153 116.973 15.283 117.085 15.3272C117.2 15.3689 117.326 15.3897 117.464 15.3897C117.641 15.3897 117.796 15.3559 117.929 15.2882C118.062 15.2205 118.172 15.115 118.261 14.9718C118.352 14.8259 118.42 14.6397 118.464 14.4132C118.508 14.184 118.53 13.9106 118.53 13.5929ZM123.913 15.3116V15.9054H120.19V15.3858L122.054 13.3116C122.283 13.0564 122.46 12.8403 122.585 12.6632C122.713 12.4835 122.801 12.3233 122.851 12.1827C122.903 12.0395 122.929 11.8937 122.929 11.7452C122.929 11.5577 122.89 11.3884 122.812 11.2374C122.736 11.0838 122.624 10.9614 122.476 10.8702C122.327 10.7791 122.148 10.7335 121.937 10.7335C121.684 10.7335 121.473 10.783 121.304 10.8819C121.137 10.9783 121.012 11.1137 120.929 11.2882C120.845 11.4627 120.804 11.6632 120.804 11.8897H120.081C120.081 11.5694 120.151 11.2765 120.292 11.0108C120.433 10.7452 120.641 10.5343 120.917 10.378C121.193 10.2192 121.533 10.1397 121.937 10.1397C122.296 10.1397 122.603 10.2036 122.858 10.3312C123.114 10.4562 123.309 10.6332 123.444 10.8624C123.582 11.089 123.651 11.3546 123.651 11.6593C123.651 11.8259 123.623 11.9952 123.565 12.1671C123.511 12.3364 123.434 12.5056 123.335 12.6749C123.239 12.8442 123.125 13.0108 122.995 13.1749C122.868 13.339 122.731 13.5004 122.585 13.6593L121.062 15.3116H123.913ZM127.28 10.2179L124.909 16.3937H124.288L126.663 10.2179H127.28ZM131.718 15.3116V15.9054H127.995V15.3858L129.858 13.3116C130.088 13.0564 130.265 12.8403 130.39 12.6632C130.517 12.4835 130.606 12.3233 130.655 12.1827C130.707 12.0395 130.733 11.8937 130.733 11.7452C130.733 11.5577 130.694 11.3884 130.616 11.2374C130.541 11.0838 130.429 10.9614 130.28 10.8702C130.132 10.7791 129.952 10.7335 129.741 10.7335C129.489 10.7335 129.278 10.783 129.108 10.8819C128.942 10.9783 128.817 11.1137 128.733 11.2882C128.65 11.4627 128.608 11.6632 128.608 11.8897H127.886C127.886 11.5694 127.956 11.2765 128.097 11.0108C128.237 10.7452 128.446 10.5343 128.722 10.378C128.998 10.2192 129.338 10.1397 129.741 10.1397C130.101 10.1397 130.408 10.2036 130.663 10.3312C130.918 10.4562 131.114 10.6332 131.249 10.8624C131.387 11.089 131.456 11.3546 131.456 11.6593C131.456 11.8259 131.427 11.9952 131.37 12.1671C131.315 12.3364 131.239 12.5056 131.14 12.6749C131.043 12.8442 130.93 13.0108 130.8 13.1749C130.672 13.339 130.536 13.5004 130.39 13.6593L128.866 15.3116H131.718ZM136.062 12.6085V13.4757C136.062 13.9418 136.02 14.3351 135.937 14.6554C135.853 14.9757 135.733 15.2335 135.577 15.4288C135.421 15.6241 135.232 15.7661 135.011 15.8546C134.792 15.9405 134.545 15.9835 134.269 15.9835C134.05 15.9835 133.848 15.9562 133.663 15.9015C133.478 15.8468 133.312 15.7595 133.163 15.6397C133.017 15.5174 132.892 15.3585 132.788 15.1632C132.684 14.9679 132.605 14.7309 132.55 14.4522C132.495 14.1736 132.468 13.8481 132.468 13.4757V12.6085C132.468 12.1424 132.51 11.7517 132.593 11.4366C132.679 11.1215 132.8 10.8689 132.956 10.6788C133.112 10.4861 133.3 10.3481 133.519 10.2647C133.74 10.1814 133.987 10.1397 134.261 10.1397C134.482 10.1397 134.685 10.1671 134.87 10.2218C135.058 10.2739 135.224 10.3585 135.37 10.4757C135.516 10.5903 135.64 10.7439 135.741 10.9366C135.845 11.1267 135.925 11.3598 135.98 11.6358C136.034 11.9119 136.062 12.2361 136.062 12.6085ZM135.335 13.5929V12.4874C135.335 12.2322 135.319 12.0082 135.288 11.8155C135.26 11.6202 135.217 11.4536 135.159 11.3155C135.102 11.1775 135.029 11.0655 134.94 10.9796C134.855 10.8937 134.754 10.8312 134.64 10.7921C134.528 10.7504 134.401 10.7296 134.261 10.7296C134.089 10.7296 133.937 10.7621 133.804 10.8272C133.671 10.8897 133.559 10.99 133.468 11.128C133.379 11.2661 133.312 11.447 133.265 11.671C133.218 11.895 133.194 12.1671 133.194 12.4874V13.5929C133.194 13.8481 133.209 14.0733 133.237 14.2687C133.269 14.464 133.314 14.6332 133.374 14.7765C133.434 14.9171 133.507 15.033 133.593 15.1241C133.679 15.2153 133.778 15.283 133.89 15.3272C134.004 15.3689 134.131 15.3897 134.269 15.3897C134.446 15.3897 134.601 15.3559 134.733 15.2882C134.866 15.2205 134.977 15.115 135.065 14.9718C135.157 14.8259 135.224 14.6397 135.269 14.4132C135.313 14.184 135.335 13.9106 135.335 13.5929ZM140.718 15.3116V15.9054H136.995V15.3858L138.858 13.3116C139.088 13.0564 139.265 12.8403 139.39 12.6632C139.517 12.4835 139.606 12.3233 139.655 12.1827C139.707 12.0395 139.733 11.8937 139.733 11.7452C139.733 11.5577 139.694 11.3884 139.616 11.2374C139.541 11.0838 139.429 10.9614 139.28 10.8702C139.132 10.7791 138.952 10.7335 138.741 10.7335C138.489 10.7335 138.278 10.783 138.108 10.8819C137.942 10.9783 137.817 11.1137 137.733 11.2882C137.65 11.4627 137.608 11.6632 137.608 11.8897H136.886C136.886 11.5694 136.956 11.2765 137.097 11.0108C137.237 10.7452 137.446 10.5343 137.722 10.378C137.998 10.2192 138.338 10.1397 138.741 10.1397C139.101 10.1397 139.408 10.2036 139.663 10.3312C139.918 10.4562 140.114 10.6332 140.249 10.8624C140.387 11.089 140.456 11.3546 140.456 11.6593C140.456 11.8259 140.427 11.9952 140.37 12.1671C140.315 12.3364 140.239 12.5056 140.14 12.6749C140.043 12.8442 139.93 13.0108 139.8 13.1749C139.672 13.339 139.536 13.5004 139.39 13.6593L137.866 15.3116H140.718ZM145.218 15.3116V15.9054H141.495V15.3858L143.358 13.3116C143.588 13.0564 143.765 12.8403 143.89 12.6632C144.017 12.4835 144.106 12.3233 144.155 12.1827C144.207 12.0395 144.233 11.8937 144.233 11.7452C144.233 11.5577 144.194 11.3884 144.116 11.2374C144.041 11.0838 143.929 10.9614 143.78 10.8702C143.632 10.7791 143.452 10.7335 143.241 10.7335C142.989 10.7335 142.778 10.783 142.608 10.8819C142.442 10.9783 142.317 11.1137 142.233 11.2882C142.15 11.4627 142.108 11.6632 142.108 11.8897H141.386C141.386 11.5694 141.456 11.2765 141.597 11.0108C141.737 10.7452 141.946 10.5343 142.222 10.378C142.498 10.2192 142.838 10.1397 143.241 10.1397C143.601 10.1397 143.908 10.2036 144.163 10.3312C144.418 10.4562 144.614 10.6332 144.749 10.8624C144.887 11.089 144.956 11.3546 144.956 11.6593C144.956 11.8259 144.927 11.9952 144.87 12.1671C144.815 12.3364 144.739 12.5056 144.64 12.6749C144.543 12.8442 144.43 13.0108 144.3 13.1749C144.172 13.339 144.036 13.5004 143.89 13.6593L142.366 15.3116H145.218Z" fill="#DBDEE1" fill-opacity="0.5" />
                    <rect x="114.349" y="35.6061" width="69.0407" height="23.6441" rx="2" fill="#5865F2" />
                    <path d="M126.545 47.4765V47.8671C126.545 48.4042 126.475 48.886 126.335 49.3124C126.195 49.7388 125.995 50.1018 125.735 50.4013C125.478 50.7008 125.168 50.9303 124.807 51.0898C124.446 51.246 124.045 51.3241 123.606 51.3241C123.17 51.3241 122.771 51.246 122.41 51.0898C122.051 50.9303 121.741 50.7008 121.477 50.4013C121.213 50.1018 121.008 49.7388 120.862 49.3124C120.718 48.886 120.647 48.4042 120.647 47.8671V47.4765C120.647 46.9394 120.718 46.4592 120.862 46.036C121.005 45.6096 121.207 45.2467 121.467 44.9472C121.731 44.6444 122.042 44.415 122.4 44.2587C122.761 44.0992 123.16 44.0194 123.596 44.0194C124.035 44.0194 124.436 44.0992 124.797 44.2587C125.159 44.415 125.469 44.6444 125.73 44.9472C125.99 45.2467 126.19 45.6096 126.33 46.036C126.474 46.4592 126.545 46.9394 126.545 47.4765ZM125.32 47.8671V47.4667C125.32 47.0696 125.281 46.7196 125.202 46.4169C125.128 46.1109 125.015 45.8554 124.866 45.6503C124.719 45.442 124.538 45.2857 124.324 45.1816C124.109 45.0741 123.866 45.0204 123.596 45.0204C123.326 45.0204 123.085 45.0741 122.873 45.1816C122.662 45.2857 122.481 45.442 122.331 45.6503C122.185 45.8554 122.073 46.1109 121.994 46.4169C121.916 46.7196 121.877 47.0696 121.877 47.4667V47.8671C121.877 48.2642 121.916 48.6158 121.994 48.9218C122.073 49.2278 122.187 49.4866 122.336 49.6982C122.489 49.9065 122.672 50.0644 122.883 50.1718C123.095 50.276 123.336 50.328 123.606 50.328C123.879 50.328 124.122 50.276 124.333 50.1718C124.545 50.0644 124.724 49.9065 124.87 49.6982C125.017 49.4866 125.128 49.2278 125.202 48.9218C125.281 48.6158 125.32 48.2642 125.32 47.8671ZM128.835 46.9589V53.2577H127.659V45.9433H128.743L128.835 46.9589ZM132.278 48.536V48.6386C132.278 49.0227 132.232 49.3791 132.141 49.7079C132.053 50.0334 131.921 50.3183 131.745 50.5624C131.573 50.8033 131.36 50.9905 131.106 51.1239C130.852 51.2574 130.559 51.3241 130.227 51.3241C129.898 51.3241 129.61 51.2639 129.363 51.1435C129.118 51.0198 128.912 50.8456 128.743 50.621C128.573 50.3964 128.437 50.1327 128.332 49.83C128.231 49.524 128.16 49.1887 128.118 48.8241V48.4286C128.16 48.0413 128.231 47.6897 128.332 47.3739C128.437 47.0582 128.573 46.7864 128.743 46.5585C128.912 46.3306 129.118 46.1549 129.363 46.0312C129.607 45.9075 129.892 45.8456 130.217 45.8456C130.549 45.8456 130.844 45.9107 131.101 46.0409C131.358 46.1679 131.575 46.3502 131.75 46.5878C131.926 46.8222 132.058 47.1054 132.146 47.4374C132.234 47.7662 132.278 48.1324 132.278 48.536ZM131.101 48.6386V48.536C131.101 48.2919 131.078 48.0657 131.033 47.8573C130.987 47.6458 130.915 47.4602 130.818 47.3007C130.72 47.1412 130.595 47.0175 130.442 46.9296C130.292 46.8385 130.111 46.7929 129.9 46.7929C129.691 46.7929 129.512 46.8287 129.363 46.9003C129.213 46.9687 129.088 47.0647 128.987 47.1884C128.886 47.3121 128.808 47.4569 128.752 47.623C128.697 47.7857 128.658 47.9631 128.635 48.1552V49.1025C128.674 49.3368 128.741 49.5517 128.835 49.747C128.93 49.9423 129.063 50.0985 129.236 50.2157C129.411 50.3297 129.636 50.3866 129.91 50.3866C130.121 50.3866 130.302 50.3411 130.451 50.2499C130.601 50.1588 130.723 50.0334 130.818 49.8739C130.915 49.7112 130.987 49.524 131.033 49.3124C131.078 49.1008 131.101 48.8762 131.101 48.6386ZM135.608 51.3241C135.217 51.3241 134.864 51.2607 134.548 51.1337C134.236 51.0035 133.969 50.8228 133.747 50.5917C133.529 50.3606 133.362 50.0888 133.244 49.7763C133.127 49.4638 133.069 49.1269 133.069 48.7655V48.5702C133.069 48.1568 133.129 47.7825 133.249 47.4472C133.37 47.1119 133.537 46.8254 133.752 46.5878C133.967 46.3469 134.221 46.163 134.514 46.036C134.807 45.9091 135.124 45.8456 135.466 45.8456C135.844 45.8456 136.174 45.9091 136.457 46.036C136.741 46.163 136.975 46.342 137.16 46.5732C137.349 46.801 137.489 47.0728 137.58 47.3886C137.675 47.7043 137.722 48.0527 137.722 48.4335V48.9364H133.64V48.0917H136.56V47.9989C136.553 47.7874 136.511 47.5888 136.433 47.4032C136.358 47.2177 136.243 47.068 136.086 46.954C135.93 46.8401 135.722 46.7831 135.461 46.7831C135.266 46.7831 135.092 46.8254 134.939 46.9101C134.789 46.9915 134.664 47.1103 134.563 47.2665C134.462 47.4228 134.384 47.6116 134.328 47.8329C134.276 48.051 134.25 48.2968 134.25 48.5702V48.7655C134.25 48.9967 134.281 49.2115 134.343 49.4101C134.408 49.6054 134.503 49.7763 134.626 49.9228C134.75 50.0693 134.9 50.1848 135.076 50.2694C135.251 50.3508 135.451 50.3915 135.676 50.3915C135.959 50.3915 136.212 50.3346 136.433 50.2206C136.654 50.1067 136.846 49.9456 137.009 49.7372L137.629 50.3378C137.515 50.5038 137.367 50.6633 137.185 50.8163C137.003 50.9661 136.78 51.0881 136.516 51.1825C136.256 51.2769 135.953 51.3241 135.608 51.3241ZM139.807 47.0712V51.2265H138.63V45.9433H139.739L139.807 47.0712ZM139.597 48.3896L139.216 48.3847C139.219 48.0103 139.271 47.6669 139.372 47.3544C139.477 47.0419 139.62 46.7734 139.802 46.5487C139.988 46.3241 140.209 46.1516 140.466 46.0312C140.723 45.9075 141.01 45.8456 141.326 45.8456C141.579 45.8456 141.809 45.8814 142.014 45.953C142.222 46.0214 142.4 46.1337 142.546 46.29C142.696 46.4462 142.81 46.6497 142.888 46.9003C142.966 47.1477 143.005 47.4521 143.005 47.8134V51.2265H141.824V47.8085C141.824 47.5546 141.786 47.3544 141.711 47.2079C141.64 47.0582 141.534 46.9524 141.394 46.8905C141.257 46.8254 141.086 46.7929 140.881 46.7929C140.679 46.7929 140.499 46.8352 140.339 46.9198C140.18 47.0045 140.045 47.12 139.934 47.2665C139.826 47.413 139.743 47.5823 139.685 47.7743C139.626 47.9664 139.597 48.1715 139.597 48.3896ZM148.039 44.1171V51.2265H146.814V44.1171H148.039ZM150.94 47.2275V48.1991H147.727V47.2275H150.94ZM151.345 44.1171V45.0937H147.727V44.1171H151.345ZM151.872 48.6435V48.5312C151.872 48.1503 151.928 47.7971 152.038 47.4716C152.149 47.1428 152.309 46.858 152.517 46.6171C152.729 46.373 152.986 46.1842 153.288 46.0507C153.594 45.914 153.939 45.8456 154.324 45.8456C154.711 45.8456 155.056 45.914 155.359 46.0507C155.665 46.1842 155.924 46.373 156.135 46.6171C156.347 46.858 156.508 47.1428 156.618 47.4716C156.729 47.7971 156.785 48.1503 156.785 48.5312V48.6435C156.785 49.0243 156.729 49.3775 156.618 49.703C156.508 50.0286 156.347 50.3134 156.135 50.5575C155.924 50.7984 155.666 50.9872 155.364 51.1239C155.061 51.2574 154.717 51.3241 154.333 51.3241C153.946 51.3241 153.599 51.2574 153.293 51.1239C152.991 50.9872 152.733 50.7984 152.522 50.5575C152.31 50.3134 152.149 50.0286 152.038 49.703C151.928 49.3775 151.872 49.0243 151.872 48.6435ZM153.049 48.5312V48.6435C153.049 48.8811 153.074 49.1057 153.122 49.3173C153.171 49.5289 153.248 49.7144 153.352 49.8739C153.456 50.0334 153.59 50.1588 153.752 50.2499C153.915 50.3411 154.109 50.3866 154.333 50.3866C154.551 50.3866 154.74 50.3411 154.9 50.2499C155.062 50.1588 155.196 50.0334 155.3 49.8739C155.404 49.7144 155.481 49.5289 155.53 49.3173C155.582 49.1057 155.608 48.8811 155.608 48.6435V48.5312C155.608 48.2968 155.582 48.0754 155.53 47.8671C155.481 47.6555 155.403 47.4683 155.295 47.3056C155.191 47.1428 155.058 47.0159 154.895 46.9247C154.735 46.8303 154.545 46.7831 154.324 46.7831C154.102 46.7831 153.91 46.8303 153.747 46.9247C153.588 47.0159 153.456 47.1428 153.352 47.3056C153.248 47.4683 153.171 47.6555 153.122 47.8671C153.074 48.0754 153.049 48.2968 153.049 48.5312ZM158.952 46.9491V51.2265H157.776V45.9433H158.899L158.952 46.9491ZM160.569 45.9091L160.559 47.0028C160.487 46.9898 160.409 46.9801 160.325 46.9735C160.243 46.967 160.162 46.9638 160.08 46.9638C159.879 46.9638 159.701 46.9931 159.548 47.0517C159.395 47.107 159.267 47.1884 159.162 47.2958C159.062 47.4 158.983 47.5269 158.928 47.6767C158.873 47.8264 158.84 47.9941 158.83 48.1796L158.562 48.1991C158.562 47.8671 158.594 47.5595 158.66 47.2763C158.725 46.9931 158.822 46.7441 158.952 46.5292C159.086 46.3144 159.252 46.1467 159.451 46.0263C159.652 45.9058 159.885 45.8456 160.149 45.8456C160.22 45.8456 160.297 45.8521 160.378 45.8652C160.463 45.8782 160.526 45.8928 160.569 45.9091ZM162.483 47.0175V51.2265H161.306V45.9433H162.414L162.483 47.0175ZM162.292 48.3896L161.892 48.3847C161.892 48.0201 161.937 47.6832 162.029 47.3739C162.12 47.0647 162.253 46.7961 162.429 46.5683C162.605 46.3372 162.823 46.1597 163.083 46.036C163.347 45.9091 163.651 45.8456 163.996 45.8456C164.237 45.8456 164.457 45.8814 164.656 45.953C164.857 46.0214 165.032 46.1305 165.178 46.2802C165.328 46.4299 165.442 46.622 165.52 46.8564C165.601 47.0907 165.642 47.3739 165.642 47.706V51.2265H164.465V47.8085C164.465 47.5513 164.426 47.3495 164.348 47.203C164.273 47.0566 164.164 46.9524 164.021 46.8905C163.881 46.8254 163.713 46.7929 163.518 46.7929C163.297 46.7929 163.108 46.8352 162.951 46.9198C162.799 47.0045 162.673 47.12 162.576 47.2665C162.478 47.413 162.406 47.5823 162.361 47.7743C162.315 47.9664 162.292 48.1715 162.292 48.3896ZM165.569 48.0771L165.017 48.1991C165.017 47.8801 165.061 47.579 165.149 47.2958C165.24 47.0094 165.372 46.7587 165.544 46.5439C165.72 46.3258 165.937 46.1549 166.194 46.0312C166.451 45.9075 166.745 45.8456 167.077 45.8456C167.348 45.8456 167.589 45.8831 167.8 45.9579C168.015 46.0295 168.197 46.1435 168.347 46.2997C168.497 46.456 168.611 46.6594 168.689 46.9101C168.767 47.1575 168.806 47.4569 168.806 47.8085V51.2265H167.624V47.8036C167.624 47.5367 167.585 47.33 167.507 47.1835C167.432 47.037 167.325 46.9361 167.185 46.8808C167.045 46.8222 166.877 46.7929 166.682 46.7929C166.5 46.7929 166.339 46.8271 166.199 46.8954C166.062 46.9605 165.946 47.0533 165.852 47.1737C165.757 47.2909 165.686 47.426 165.637 47.579C165.591 47.732 165.569 47.898 165.569 48.0771ZM177.204 50.289V51.2265H172.439V50.4208L174.753 47.8964C175.007 47.6099 175.207 47.3625 175.354 47.1542C175.5 46.9459 175.603 46.7587 175.661 46.5927C175.723 46.4234 175.754 46.259 175.754 46.0995C175.754 45.8749 175.712 45.678 175.627 45.5087C175.546 45.3362 175.425 45.2011 175.266 45.1034C175.106 45.0025 174.913 44.9521 174.685 44.9521C174.421 44.9521 174.2 45.009 174.021 45.123C173.842 45.2369 173.707 45.3948 173.616 45.5966C173.524 45.7952 173.479 46.023 173.479 46.2802H172.302C172.302 45.8668 172.396 45.4892 172.585 45.1474C172.774 44.8023 173.048 44.5289 173.406 44.3271C173.764 44.122 174.195 44.0194 174.7 44.0194C175.175 44.0194 175.578 44.0992 175.91 44.2587C176.243 44.4182 176.495 44.6444 176.667 44.9374C176.843 45.2304 176.931 45.5771 176.931 45.9775C176.931 46.1988 176.895 46.4185 176.824 46.6366C176.752 46.8547 176.649 47.0728 176.516 47.2909C176.386 47.5058 176.231 47.7222 176.052 47.9403C175.873 48.1552 175.676 48.3733 175.461 48.5946L173.923 50.289H177.204Z" fill="white" />
                    <rect x="42.4712" y="35.6061" width="66.8654" height="23.6441" rx="2" fill="#5865F2" />
                    <path d="M53.914 47.4765V47.8671C53.914 48.4042 53.844 48.886 53.704 49.3124C53.564 49.7388 53.3638 50.1018 53.1034 50.4013C52.8463 50.7008 52.537 50.9303 52.1757 51.0898C51.8144 51.246 51.414 51.3241 50.9745 51.3241C50.5383 51.3241 50.1395 51.246 49.7782 51.0898C49.4201 50.9303 49.1093 50.7008 48.8456 50.4013C48.5819 50.1018 48.3769 49.7388 48.2304 49.3124C48.0871 48.886 48.0155 48.4042 48.0155 47.8671V47.4765C48.0155 46.9394 48.0871 46.4592 48.2304 46.036C48.3736 45.6096 48.5754 45.2467 48.8358 44.9472C49.0995 44.6444 49.4104 44.415 49.7685 44.2587C50.1298 44.0992 50.5285 44.0194 50.9647 44.0194C51.4042 44.0194 51.8046 44.0992 52.1659 44.2587C52.5272 44.415 52.8381 44.6444 53.0985 44.9472C53.3589 45.2467 53.5591 45.6096 53.6991 46.036C53.8423 46.4592 53.914 46.9394 53.914 47.4765ZM52.6884 47.8671V47.4667C52.6884 47.0696 52.6493 46.7196 52.5712 46.4169C52.4963 46.1109 52.384 45.8554 52.2343 45.6503C52.0878 45.442 51.9071 45.2857 51.6923 45.1816C51.4774 45.0741 51.2349 45.0204 50.9647 45.0204C50.6946 45.0204 50.4537 45.0741 50.2421 45.1816C50.0305 45.2857 49.8498 45.442 49.7001 45.6503C49.5536 45.8554 49.4413 46.1109 49.3632 46.4169C49.2851 46.7196 49.246 47.0696 49.246 47.4667V47.8671C49.246 48.2642 49.2851 48.6158 49.3632 48.9218C49.4413 49.2278 49.5552 49.4866 49.705 49.6982C49.858 49.9065 50.0403 50.0644 50.2519 50.1718C50.4634 50.276 50.7043 50.328 50.9745 50.328C51.2479 50.328 51.4905 50.276 51.702 50.1718C51.9136 50.0644 52.0927 49.9065 52.2392 49.6982C52.3856 49.4866 52.4963 49.2278 52.5712 48.9218C52.6493 48.6158 52.6884 48.2642 52.6884 47.8671ZM56.204 46.9589V53.2577H55.0272V45.9433H56.1112L56.204 46.9589ZM59.6464 48.536V48.6386C59.6464 49.0227 59.6008 49.3791 59.5097 49.7079C59.4218 50.0334 59.2899 50.3183 59.1142 50.5624C58.9416 50.8033 58.7284 50.9905 58.4745 51.1239C58.2206 51.2574 57.9276 51.3241 57.5956 51.3241C57.2668 51.3241 56.9787 51.2639 56.7313 51.1435C56.4872 51.0198 56.2805 50.8456 56.1112 50.621C55.942 50.3964 55.8052 50.1327 55.7011 49.83C55.6002 49.524 55.5285 49.1887 55.4862 48.8241V48.4286C55.5285 48.0413 55.6002 47.6897 55.7011 47.3739C55.8052 47.0582 55.942 46.7864 56.1112 46.5585C56.2805 46.3306 56.4872 46.1549 56.7313 46.0312C56.9755 45.9075 57.2603 45.8456 57.5858 45.8456C57.9179 45.8456 58.2125 45.9107 58.4696 46.0409C58.7268 46.1679 58.9433 46.3502 59.119 46.5878C59.2948 46.8222 59.4267 47.1054 59.5145 47.4374C59.6024 47.7662 59.6464 48.1324 59.6464 48.536ZM58.4696 48.6386V48.536C58.4696 48.2919 58.4468 48.0657 58.4013 47.8573C58.3557 47.6458 58.2841 47.4602 58.1864 47.3007C58.0888 47.1412 57.9634 47.0175 57.8104 46.9296C57.6607 46.8385 57.48 46.7929 57.2685 46.7929C57.0601 46.7929 56.8811 46.8287 56.7313 46.9003C56.5816 46.9687 56.4563 47.0647 56.3554 47.1884C56.2545 47.3121 56.1763 47.4569 56.121 47.623C56.0657 47.7857 56.0266 47.9631 56.0038 48.1552V49.1025C56.0429 49.3368 56.1096 49.5517 56.204 49.747C56.2984 49.9423 56.4319 50.0985 56.6044 50.2157C56.7802 50.3297 57.0048 50.3866 57.2782 50.3866C57.4898 50.3866 57.6705 50.3411 57.8202 50.2499C57.9699 50.1588 58.092 50.0334 58.1864 49.8739C58.2841 49.7112 58.3557 49.524 58.4013 49.3124C58.4468 49.1008 58.4696 48.8762 58.4696 48.6386ZM62.9765 51.3241C62.5858 51.3241 62.2326 51.2607 61.9169 51.1337C61.6044 51.0035 61.3375 50.8228 61.1161 50.5917C60.898 50.3606 60.7304 50.0888 60.6132 49.7763C60.496 49.4638 60.4374 49.1269 60.4374 48.7655V48.5702C60.4374 48.1568 60.4976 47.7825 60.6181 47.4472C60.7385 47.1119 60.9061 46.8254 61.121 46.5878C61.3358 46.3469 61.5897 46.163 61.8827 46.036C62.1757 45.9091 62.4931 45.8456 62.8349 45.8456C63.2125 45.8456 63.5429 45.9091 63.8261 46.036C64.1093 46.163 64.3436 46.342 64.5292 46.5732C64.718 46.801 64.858 47.0728 64.9491 47.3886C65.0435 47.7043 65.0907 48.0527 65.0907 48.4335V48.9364H61.0087V48.0917H63.9286V47.9989C63.9221 47.7874 63.8798 47.5888 63.8017 47.4032C63.7268 47.2177 63.6112 47.068 63.455 46.954C63.2987 46.8401 63.0904 46.7831 62.83 46.7831C62.6347 46.7831 62.4605 46.8254 62.3075 46.9101C62.1578 46.9915 62.0324 47.1103 61.9315 47.2665C61.8306 47.4228 61.7525 47.6116 61.6972 47.8329C61.6451 48.051 61.619 48.2968 61.619 48.5702V48.7655C61.619 48.9967 61.65 49.2115 61.7118 49.4101C61.7769 49.6054 61.8713 49.7763 61.995 49.9228C62.1187 50.0693 62.2685 50.1848 62.4442 50.2694C62.62 50.3508 62.8202 50.3915 63.0448 50.3915C63.328 50.3915 63.5803 50.3346 63.8017 50.2206C64.023 50.1067 64.2151 49.9456 64.3778 49.7372L64.9979 50.3378C64.884 50.5038 64.7359 50.6633 64.5536 50.8163C64.3713 50.9661 64.1483 51.0881 63.8847 51.1825C63.6242 51.2769 63.3215 51.3241 62.9765 51.3241ZM67.1757 47.0712V51.2265H65.9989V45.9433H67.1073L67.1757 47.0712ZM66.9657 48.3896L66.5849 48.3847C66.5881 48.0103 66.6402 47.6669 66.7411 47.3544C66.8453 47.0419 66.9885 46.7734 67.1708 46.5487C67.3563 46.3241 67.5777 46.1516 67.8349 46.0312C68.092 45.9075 68.3785 45.8456 68.6942 45.8456C68.9481 45.8456 69.1776 45.8814 69.3827 45.953C69.591 46.0214 69.7685 46.1337 69.9149 46.29C70.0647 46.4462 70.1786 46.6497 70.2567 46.9003C70.3349 47.1477 70.3739 47.4521 70.3739 47.8134V51.2265H69.1923V47.8085C69.1923 47.5546 69.1548 47.3544 69.08 47.2079C69.0084 47.0582 68.9026 46.9524 68.7626 46.8905C68.6259 46.8254 68.455 46.7929 68.2499 46.7929C68.0481 46.7929 67.8674 46.8352 67.7079 46.9198C67.5484 47.0045 67.4133 47.12 67.3026 47.2665C67.1952 47.413 67.1122 47.5823 67.0536 47.7743C66.995 47.9664 66.9657 48.1715 66.9657 48.3896ZM75.4081 44.1171V51.2265H74.1825V44.1171H75.4081ZM78.3085 47.2275V48.1991H75.0956V47.2275H78.3085ZM78.7138 44.1171V45.0937H75.0956V44.1171H78.7138ZM79.2411 48.6435V48.5312C79.2411 48.1503 79.2964 47.7971 79.4071 47.4716C79.5178 47.1428 79.6773 46.858 79.8856 46.6171C80.0972 46.373 80.3544 46.1842 80.6571 46.0507C80.9631 45.914 81.3082 45.8456 81.6923 45.8456C82.0796 45.8456 82.4247 45.914 82.7274 46.0507C83.0334 46.1842 83.2922 46.373 83.5038 46.6171C83.7154 46.858 83.8765 47.1428 83.9872 47.4716C84.0979 47.7971 84.1532 48.1503 84.1532 48.5312V48.6435C84.1532 49.0243 84.0979 49.3775 83.9872 49.703C83.8765 50.0286 83.7154 50.3134 83.5038 50.5575C83.2922 50.7984 83.0351 50.9872 82.7323 51.1239C82.4296 51.2574 82.0862 51.3241 81.702 51.3241C81.3147 51.3241 80.968 51.2574 80.662 51.1239C80.3593 50.9872 80.1021 50.7984 79.8905 50.5575C79.6789 50.3134 79.5178 50.0286 79.4071 49.703C79.2964 49.3775 79.2411 49.0243 79.2411 48.6435ZM80.4179 48.5312V48.6435C80.4179 48.8811 80.4423 49.1057 80.4911 49.3173C80.5399 49.5289 80.6164 49.7144 80.7206 49.8739C80.8248 50.0334 80.9582 50.1588 81.121 50.2499C81.2838 50.3411 81.4774 50.3866 81.702 50.3866C81.9201 50.3866 82.1089 50.3411 82.2685 50.2499C82.4312 50.1588 82.5647 50.0334 82.6688 49.8739C82.773 49.7144 82.8495 49.5289 82.8983 49.3173C82.9504 49.1057 82.9765 48.8811 82.9765 48.6435V48.5312C82.9765 48.2968 82.9504 48.0754 82.8983 47.8671C82.8495 47.6555 82.7714 47.4683 82.664 47.3056C82.5598 47.1428 82.4263 47.0159 82.2636 46.9247C82.1041 46.8303 81.9136 46.7831 81.6923 46.7831C81.4709 46.7831 81.2789 46.8303 81.1161 46.9247C80.9566 47.0159 80.8248 47.1428 80.7206 47.3056C80.6164 47.4683 80.5399 47.6555 80.4911 47.8671C80.4423 48.0754 80.4179 48.2968 80.4179 48.5312ZM86.3212 46.9491V51.2265H85.1444V45.9433H86.2675L86.3212 46.9491ZM87.9374 45.9091L87.9276 47.0028C87.856 46.9898 87.7779 46.9801 87.6933 46.9735C87.6119 46.967 87.5305 46.9638 87.4491 46.9638C87.2473 46.9638 87.0699 46.9931 86.9169 47.0517C86.7639 47.107 86.6353 47.1884 86.5311 47.2958C86.4302 47.4 86.3521 47.5269 86.2968 47.6767C86.2414 47.8264 86.2089 47.9941 86.1991 48.1796L85.9306 48.1991C85.9306 47.8671 85.9631 47.5595 86.0282 47.2763C86.0933 46.9931 86.191 46.7441 86.3212 46.5292C86.4546 46.3144 86.6207 46.1467 86.8192 46.0263C87.0211 45.9058 87.2538 45.8456 87.5175 45.8456C87.5891 45.8456 87.6656 45.8521 87.747 45.8652C87.8316 45.8782 87.8951 45.8928 87.9374 45.9091ZM89.8515 47.0175V51.2265H88.6747V45.9433H89.7831L89.8515 47.0175ZM89.661 48.3896L89.2606 48.3847C89.2606 48.0201 89.3062 47.6832 89.3974 47.3739C89.4885 47.0647 89.622 46.7961 89.7977 46.5683C89.9735 46.3372 90.1916 46.1597 90.452 46.036C90.7157 45.9091 91.0201 45.8456 91.3651 45.8456C91.606 45.8456 91.8257 45.8814 92.0243 45.953C92.2261 46.0214 92.4003 46.1305 92.5468 46.2802C92.6965 46.4299 92.8104 46.622 92.8886 46.8564C92.9699 47.0907 93.0106 47.3739 93.0106 47.706V51.2265H91.8339V47.8085C91.8339 47.5513 91.7948 47.3495 91.7167 47.203C91.6418 47.0566 91.5328 46.9524 91.3895 46.8905C91.2496 46.8254 91.0819 46.7929 90.8866 46.7929C90.6653 46.7929 90.4765 46.8352 90.3202 46.9198C90.1672 47.0045 90.0419 47.12 89.9442 47.2665C89.8466 47.413 89.775 47.5823 89.7294 47.7743C89.6838 47.9664 89.661 48.1715 89.661 48.3896ZM92.9374 48.0771L92.3856 48.1991C92.3856 47.8801 92.4296 47.579 92.5175 47.2958C92.6086 47.0094 92.7405 46.7587 92.913 46.5439C93.0888 46.3258 93.3052 46.1549 93.5624 46.0312C93.8196 45.9075 94.1142 45.8456 94.4462 45.8456C94.7164 45.8456 94.9573 45.8831 95.1688 45.9579C95.3837 46.0295 95.566 46.1435 95.7157 46.2997C95.8655 46.456 95.9794 46.6594 96.0575 46.9101C96.1356 47.1575 96.1747 47.4569 96.1747 47.8085V51.2265H94.9931V47.8036C94.9931 47.5367 94.954 47.33 94.8759 47.1835C94.801 47.037 94.6936 46.9361 94.5536 46.8808C94.4136 46.8222 94.246 46.7929 94.0507 46.7929C93.8684 46.7929 93.7073 46.8271 93.5673 46.8954C93.4306 46.9605 93.315 47.0533 93.2206 47.1737C93.1262 47.2909 93.0546 47.426 93.0058 47.579C92.9602 47.732 92.9374 47.898 92.9374 48.0771ZM103.02 44.0927V51.2265H101.844V45.4892L100.1 46.08V45.1083L102.879 44.0927H103.02Z" fill="white" />
                    <path d="M47.0879 27.1503H45.1885V26.3837H47.0879C47.4558 26.3837 47.7536 26.3251 47.9815 26.2079C48.2093 26.0907 48.3754 25.9279 48.4795 25.7196C48.5869 25.5113 48.6407 25.2736 48.6407 25.0067C48.6407 24.7626 48.5869 24.5331 48.4795 24.3182C48.3754 24.1034 48.2093 23.9309 47.9815 23.8006C47.7536 23.6672 47.4558 23.6005 47.0879 23.6005H45.4082V29.9383H44.4659V22.829H47.0879C47.625 22.829 48.0791 22.9217 48.4502 23.1073C48.8213 23.2928 49.1029 23.55 49.295 23.8788C49.487 24.2043 49.583 24.577 49.583 24.9969C49.583 25.4527 49.487 25.8417 49.295 26.1639C49.1029 26.4862 48.8213 26.732 48.4502 26.9012C48.0791 27.0673 47.625 27.1503 47.0879 27.1503ZM51.6192 22.4383V29.9383H50.711V22.4383H51.6192ZM55.2617 30.036C54.8939 30.036 54.5603 29.9742 54.2608 29.8505C53.9645 29.7235 53.709 29.5461 53.4942 29.3182C53.2826 29.0904 53.1198 28.8202 53.0059 28.5077C52.892 28.1952 52.835 27.8534 52.835 27.4823V27.2772C52.835 26.8475 52.8985 26.465 53.0254 26.1298C53.1524 25.7912 53.3249 25.5048 53.543 25.2704C53.7611 25.036 54.0085 24.8586 54.2852 24.7381C54.5619 24.6177 54.8483 24.5575 55.1446 24.5575C55.5222 24.5575 55.8477 24.6226 56.1211 24.7528C56.3978 24.883 56.6241 25.0653 56.7998 25.2997C56.9756 25.5308 57.1058 25.8042 57.1905 26.12C57.2751 26.4325 57.3174 26.7743 57.3174 27.1454V27.5506H53.3721V26.8133H56.4141V26.745C56.4011 26.5106 56.3522 26.2827 56.2676 26.0614C56.1862 25.84 56.056 25.6577 55.877 25.5145C55.6979 25.3713 55.4538 25.2997 55.1446 25.2997C54.9395 25.2997 54.7507 25.3436 54.5782 25.4315C54.4056 25.5161 54.2575 25.6431 54.1338 25.8124C54.0101 25.9816 53.9141 26.1883 53.8457 26.4325C53.7774 26.6766 53.7432 26.9582 53.7432 27.2772V27.4823C53.7432 27.7329 53.7774 27.9689 53.8457 28.1903C53.9173 28.4084 54.0199 28.6005 54.1534 28.7665C54.2901 28.9325 54.4545 29.0627 54.6465 29.1571C54.8418 29.2515 55.0632 29.2987 55.3106 29.2987C55.6296 29.2987 55.8998 29.2336 56.1211 29.1034C56.3425 28.9732 56.5362 28.799 56.7022 28.5809L57.2491 29.0155C57.1351 29.188 56.9903 29.3524 56.8145 29.5087C56.6387 29.6649 56.4222 29.7919 56.1651 29.8895C55.9112 29.9872 55.6101 30.036 55.2617 30.036ZM61.4873 29.035V26.3153C61.4873 26.107 61.445 25.9263 61.3604 25.7733C61.279 25.6171 61.1553 25.4966 60.9893 25.412C60.8233 25.3273 60.6182 25.285 60.3741 25.285C60.1462 25.285 59.946 25.3241 59.7735 25.4022C59.6042 25.4803 59.4707 25.5829 59.3731 25.7098C59.2787 25.8368 59.2315 25.9735 59.2315 26.12H58.3282C58.3282 25.9312 58.377 25.744 58.4746 25.5585C58.5723 25.3729 58.7123 25.2053 58.8946 25.0555C59.0801 24.9025 59.3015 24.7821 59.5586 24.6942C59.819 24.6031 60.1088 24.5575 60.4278 24.5575C60.8119 24.5575 61.1504 24.6226 61.4434 24.7528C61.7396 24.883 61.9707 25.0799 62.1367 25.3436C62.306 25.604 62.3907 25.9312 62.3907 26.3251V28.786C62.3907 28.9618 62.4053 29.149 62.4346 29.3475C62.4672 29.5461 62.5144 29.717 62.5762 29.8602V29.9383H61.6338C61.5882 29.8342 61.5524 29.6958 61.5264 29.5233C61.5004 29.3475 61.4873 29.1848 61.4873 29.035ZM61.6436 26.7352L61.6534 27.37H60.7403C60.4831 27.37 60.2536 27.3911 60.0518 27.4335C59.85 27.4725 59.6807 27.5327 59.544 27.6141C59.4073 27.6955 59.3031 27.798 59.2315 27.9217C59.1599 28.0422 59.1241 28.1838 59.1241 28.3465C59.1241 28.5126 59.1615 28.6639 59.2364 28.8006C59.3112 28.9374 59.4235 29.0464 59.5733 29.1278C59.7263 29.2059 59.9134 29.245 60.1348 29.245C60.4115 29.245 60.6556 29.1864 60.8672 29.0692C61.0788 28.952 61.2464 28.8088 61.3701 28.6395C61.4971 28.4702 61.5655 28.3059 61.5752 28.1464L61.961 28.5809C61.9382 28.7176 61.8763 28.869 61.7754 29.035C61.6745 29.201 61.5394 29.3605 61.3701 29.5135C61.2041 29.6633 61.0056 29.7886 60.7744 29.8895C60.5466 29.9872 60.2894 30.036 60.003 30.036C59.6449 30.036 59.3308 29.966 59.0606 29.826C58.7937 29.6861 58.5853 29.4989 58.4356 29.2645C58.2891 29.0269 58.2159 28.7616 58.2159 28.4686C58.2159 28.1854 58.2712 27.9364 58.3819 27.7215C58.4925 27.5034 58.652 27.3228 58.8604 27.1796C59.0687 27.0331 59.3194 26.9224 59.6123 26.8475C59.9053 26.7727 60.2325 26.7352 60.5938 26.7352H61.6436ZM66.8877 28.537C66.8877 28.4068 66.8584 28.2863 66.7998 28.1756C66.7445 28.0617 66.6289 27.9592 66.4532 27.868C66.2806 27.7736 66.0202 27.6923 65.6719 27.6239C65.3789 27.562 65.1136 27.4888 64.876 27.4042C64.6416 27.3195 64.4414 27.217 64.2754 27.0965C64.1127 26.9761 63.9873 26.8345 63.8994 26.6717C63.8116 26.509 63.7676 26.3186 63.7676 26.1005C63.7676 25.8921 63.8132 25.6952 63.9043 25.5096C63.9987 25.3241 64.1306 25.1597 64.2998 25.0165C64.4724 24.8732 64.6791 24.7609 64.92 24.6796C65.1608 24.5982 65.4294 24.5575 65.7256 24.5575C66.1488 24.5575 66.5101 24.6324 66.8096 24.7821C67.1091 24.9318 67.3386 25.132 67.4981 25.3827C67.6576 25.6301 67.7373 25.9051 67.7373 26.2079H66.834C66.834 26.0614 66.7901 25.9198 66.7022 25.7831C66.6175 25.6431 66.4922 25.5275 66.3262 25.4364C66.1634 25.3452 65.9632 25.2997 65.7256 25.2997C65.475 25.2997 65.2715 25.3387 65.1153 25.4169C64.9623 25.4917 64.85 25.5878 64.7784 25.7049C64.71 25.8221 64.6758 25.9458 64.6758 26.076C64.6758 26.1737 64.6921 26.2616 64.7246 26.3397C64.7604 26.4146 64.8223 26.4846 64.9102 26.5497C64.9981 26.6115 65.1218 26.6701 65.2813 26.7255C65.4408 26.7808 65.6442 26.8361 65.8916 26.8915C66.3246 26.9891 66.681 27.1063 66.961 27.243C67.2409 27.3798 67.4492 27.5474 67.586 27.746C67.7227 27.9445 67.791 28.1854 67.791 28.4686C67.791 28.6997 67.7422 28.9113 67.6446 29.1034C67.5502 29.2954 67.4118 29.4615 67.2295 29.6014C67.0505 29.7381 66.8356 29.8456 66.585 29.9237C66.3376 29.9986 66.0593 30.036 65.75 30.036C65.2845 30.036 64.8907 29.953 64.5684 29.787C64.2461 29.621 64.002 29.4061 63.836 29.1424C63.67 28.8788 63.5869 28.6005 63.5869 28.3075H64.4951C64.5082 28.5549 64.5798 28.7518 64.71 28.8983C64.8402 29.0415 64.9997 29.1441 65.1885 29.2059C65.3773 29.2645 65.5645 29.2938 65.75 29.2938C65.9974 29.2938 66.2041 29.2613 66.3701 29.1962C66.5394 29.1311 66.668 29.0415 66.7559 28.9276C66.8438 28.8137 66.8877 28.6835 66.8877 28.537ZM71.17 30.036C70.8021 30.036 70.4685 29.9742 70.169 29.8505C69.8728 29.7235 69.6172 29.5461 69.4024 29.3182C69.1908 29.0904 69.028 28.8202 68.9141 28.5077C68.8002 28.1952 68.7432 27.8534 68.7432 27.4823V27.2772C68.7432 26.8475 68.8067 26.465 68.9336 26.1298C69.0606 25.7912 69.2331 25.5048 69.4512 25.2704C69.6693 25.036 69.9167 24.8586 70.1934 24.7381C70.4701 24.6177 70.7565 24.5575 71.0528 24.5575C71.4304 24.5575 71.7559 24.6226 72.0293 24.7528C72.306 24.883 72.5323 25.0653 72.708 25.2997C72.8838 25.5308 73.014 25.8042 73.0987 26.12C73.1833 26.4325 73.2256 26.7743 73.2256 27.1454V27.5506H69.2803V26.8133H72.3223V26.745C72.3093 26.5106 72.2604 26.2827 72.1758 26.0614C72.0944 25.84 71.9642 25.6577 71.7852 25.5145C71.6062 25.3713 71.362 25.2997 71.0528 25.2997C70.8477 25.2997 70.6589 25.3436 70.4864 25.4315C70.3138 25.5161 70.1657 25.6431 70.042 25.8124C69.9183 25.9816 69.8223 26.1883 69.7539 26.4325C69.6856 26.6766 69.6514 26.9582 69.6514 27.2772V27.4823C69.6514 27.7329 69.6856 27.9689 69.7539 28.1903C69.8256 28.4084 69.9281 28.6005 70.0616 28.7665C70.1983 28.9325 70.3627 29.0627 70.5547 29.1571C70.75 29.2515 70.9714 29.2987 71.2188 29.2987C71.5378 29.2987 71.808 29.2336 72.0293 29.1034C72.2507 28.9732 72.4444 28.799 72.6104 28.5809L73.1573 29.0155C73.0433 29.188 72.8985 29.3524 72.7227 29.5087C72.5469 29.6649 72.3304 29.7919 72.0733 29.8895C71.8194 29.9872 71.5183 30.036 71.17 30.036ZM77.9668 29.9383H77.0635V24.1962C77.0635 23.7958 77.1416 23.4572 77.2979 23.1805C77.4541 22.9038 77.6771 22.6939 77.9668 22.5506C78.2565 22.4074 78.6 22.3358 78.9971 22.3358C79.2315 22.3358 79.461 22.3651 79.6856 22.4237C79.9102 22.479 80.1413 22.549 80.3789 22.6337L80.2276 23.3954C80.0778 23.3368 79.9037 23.2814 79.7051 23.2294C79.5098 23.174 79.295 23.1464 79.0606 23.1464C78.6732 23.1464 78.3933 23.2342 78.2207 23.41C78.0515 23.5826 77.9668 23.8446 77.9668 24.1962V29.9383ZM79.0459 24.6551V25.3485H76.2285V24.6551H79.0459ZM80.8233 24.6551V29.9383H79.92V24.6551H80.8233ZM83.2891 22.4383V29.9383H82.3809V22.4383H83.2891ZM85.7207 22.4383V29.9383H84.8125V22.4383H85.7207ZM89.4121 27.3553V27.243C89.4121 26.8622 89.4675 26.509 89.5782 26.1835C89.6888 25.8547 89.8483 25.5699 90.0567 25.329C90.265 25.0848 90.5173 24.896 90.8135 24.7626C91.1097 24.6258 91.4418 24.5575 91.8096 24.5575C92.1807 24.5575 92.5144 24.6258 92.8106 24.7626C93.1101 24.896 93.364 25.0848 93.5723 25.329C93.7839 25.5699 93.945 25.8547 94.0557 26.1835C94.1664 26.509 94.2217 26.8622 94.2217 27.243V27.3553C94.2217 27.7362 94.1664 28.0894 94.0557 28.4149C93.945 28.7404 93.7839 29.0253 93.5723 29.2694C93.364 29.5103 93.1117 29.6991 92.8155 29.8358C92.5225 29.9693 92.1905 30.036 91.8194 30.036C91.4483 30.036 91.1146 29.9693 90.8184 29.8358C90.5222 29.6991 90.2683 29.5103 90.0567 29.2694C89.8483 29.0253 89.6888 28.7404 89.5782 28.4149C89.4675 28.0894 89.4121 27.7362 89.4121 27.3553ZM90.3155 27.243V27.3553C90.3155 27.619 90.3464 27.868 90.4082 28.1024C90.4701 28.3335 90.5629 28.5386 90.6866 28.7176C90.8135 28.8967 90.9714 29.0383 91.1602 29.1424C91.349 29.2434 91.5687 29.2938 91.8194 29.2938C92.0668 29.2938 92.2832 29.2434 92.4688 29.1424C92.6576 29.0383 92.8138 28.8967 92.9375 28.7176C93.0612 28.5386 93.154 28.3335 93.2159 28.1024C93.281 27.868 93.3135 27.619 93.3135 27.3553V27.243C93.3135 26.9826 93.281 26.7368 93.2159 26.5057C93.154 26.2714 93.0596 26.0646 92.9326 25.8856C92.8089 25.7033 92.6527 25.5601 92.4639 25.4559C92.2784 25.3518 92.0603 25.2997 91.8096 25.2997C91.5622 25.2997 91.3441 25.3518 91.1553 25.4559C90.9698 25.5601 90.8135 25.7033 90.6866 25.8856C90.5629 26.0646 90.4701 26.2714 90.4082 26.5057C90.3464 26.7368 90.3155 26.9826 90.3155 27.243ZM98.5869 28.7176V24.6551H99.4951V29.9383H98.6309L98.5869 28.7176ZM98.7578 27.6044L99.1338 27.5946C99.1338 27.9462 99.0964 28.2717 99.0215 28.5712C98.9499 28.8674 98.8327 29.1245 98.67 29.3426C98.5072 29.5607 98.294 29.7316 98.0303 29.8553C97.7666 29.9758 97.446 30.036 97.0684 30.036C96.8112 30.036 96.5752 29.9986 96.3604 29.9237C96.1488 29.8488 95.9665 29.7333 95.8135 29.577C95.6605 29.4208 95.5417 29.2173 95.4571 28.9667C95.3757 28.716 95.335 28.4149 95.335 28.0633V24.6551H96.2383V28.0731C96.2383 28.3107 96.2644 28.5077 96.3164 28.6639C96.3718 28.8169 96.445 28.939 96.5362 29.0301C96.6306 29.118 96.7347 29.1799 96.8487 29.2157C96.9659 29.2515 97.0863 29.2694 97.21 29.2694C97.5941 29.2694 97.8985 29.1962 98.1231 29.0497C98.3477 28.8999 98.5088 28.6997 98.6065 28.4491C98.7074 28.1952 98.7578 27.9136 98.7578 27.6044ZM103.084 24.6551V25.3485H100.228V24.6551H103.084ZM101.194 23.371H102.098V28.6298C102.098 28.8088 102.125 28.9439 102.181 29.035C102.236 29.1262 102.308 29.1864 102.396 29.2157C102.483 29.245 102.578 29.2596 102.679 29.2596C102.754 29.2596 102.832 29.2531 102.913 29.2401C102.998 29.2238 103.061 29.2108 103.104 29.201L103.108 29.9383C103.037 29.9611 102.942 29.9823 102.825 30.0018C102.711 30.0246 102.573 30.036 102.41 30.036C102.189 30.036 101.985 29.9921 101.8 29.9042C101.614 29.8163 101.466 29.6698 101.355 29.4647C101.248 29.2564 101.194 28.9764 101.194 28.6249V23.371ZM108.836 24.6551V25.3485H105.98V24.6551H108.836ZM106.946 23.371H107.85V28.6298C107.85 28.8088 107.877 28.9439 107.933 29.035C107.988 29.1262 108.06 29.1864 108.147 29.2157C108.235 29.245 108.33 29.2596 108.431 29.2596C108.506 29.2596 108.584 29.2531 108.665 29.2401C108.75 29.2238 108.813 29.2108 108.855 29.201L108.86 29.9383C108.789 29.9611 108.694 29.9823 108.577 30.0018C108.463 30.0246 108.325 30.036 108.162 30.036C107.941 30.036 107.737 29.9921 107.552 29.9042C107.366 29.8163 107.218 29.6698 107.107 29.4647C107 29.2564 106.946 28.9764 106.946 28.6249V23.371ZM110.799 22.4383V29.9383H109.896V22.4383H110.799ZM110.584 27.0965L110.208 27.0819C110.211 26.7206 110.265 26.3869 110.369 26.0809C110.473 25.7717 110.62 25.5031 110.809 25.2753C110.997 25.0474 111.222 24.8716 111.482 24.7479C111.746 24.621 112.037 24.5575 112.356 24.5575C112.617 24.5575 112.851 24.5933 113.06 24.6649C113.268 24.7333 113.445 24.8439 113.592 24.9969C113.742 25.1499 113.855 25.3485 113.934 25.5926C114.012 25.8335 114.051 26.1281 114.051 26.4764V29.9383H113.143V26.4667C113.143 26.19 113.102 25.9686 113.021 25.8026C112.939 25.6333 112.82 25.5113 112.664 25.4364C112.508 25.3583 112.316 25.3192 112.088 25.3192C111.863 25.3192 111.658 25.3664 111.473 25.4608C111.29 25.5552 111.133 25.6854 110.999 25.8514C110.869 26.0174 110.766 26.2079 110.691 26.4227C110.62 26.6343 110.584 26.8589 110.584 27.0965ZM117.596 30.036C117.228 30.036 116.894 29.9742 116.595 29.8505C116.299 29.7235 116.043 29.5461 115.828 29.3182C115.617 29.0904 115.454 28.8202 115.34 28.5077C115.226 28.1952 115.169 27.8534 115.169 27.4823V27.2772C115.169 26.8475 115.232 26.465 115.359 26.1298C115.486 25.7912 115.659 25.5048 115.877 25.2704C116.095 25.036 116.342 24.8586 116.619 24.7381C116.896 24.6177 117.182 24.5575 117.479 24.5575C117.856 24.5575 118.182 24.6226 118.455 24.7528C118.732 24.883 118.958 25.0653 119.134 25.2997C119.31 25.5308 119.44 25.8042 119.524 26.12C119.609 26.4325 119.651 26.7743 119.651 27.1454V27.5506H115.706V26.8133H118.748V26.745C118.735 26.5106 118.686 26.2827 118.602 26.0614C118.52 25.84 118.39 25.6577 118.211 25.5145C118.032 25.3713 117.788 25.2997 117.479 25.2997C117.273 25.2997 117.085 25.3436 116.912 25.4315C116.74 25.5161 116.592 25.6431 116.468 25.8124C116.344 25.9816 116.248 26.1883 116.18 26.4325C116.111 26.6766 116.077 26.9582 116.077 27.2772V27.4823C116.077 27.7329 116.111 27.9689 116.18 28.1903C116.251 28.4084 116.354 28.6005 116.487 28.7665C116.624 28.9325 116.788 29.0627 116.98 29.1571C117.176 29.2515 117.397 29.2987 117.645 29.2987C117.964 29.2987 118.234 29.2336 118.455 29.1034C118.676 28.9732 118.87 28.799 119.036 28.5809L119.583 29.0155C119.469 29.188 119.324 29.3524 119.148 29.5087C118.973 29.6649 118.756 29.7919 118.499 29.8895C118.245 29.9872 117.944 30.036 117.596 30.036ZM124.534 29.9383H123.631V24.0985C123.631 23.7176 123.699 23.397 123.836 23.1366C123.976 22.8729 124.176 22.6743 124.437 22.5409C124.697 22.4042 125.006 22.3358 125.364 22.3358C125.468 22.3358 125.573 22.3423 125.677 22.3553C125.784 22.3684 125.888 22.3879 125.989 22.4139L125.94 23.1512C125.872 23.135 125.794 23.1236 125.706 23.1171C125.621 23.1105 125.537 23.1073 125.452 23.1073C125.26 23.1073 125.094 23.1464 124.954 23.2245C124.817 23.2993 124.713 23.41 124.642 23.5565C124.57 23.703 124.534 23.8837 124.534 24.0985V29.9383ZM125.657 24.6551V25.3485H122.796V24.6551H125.657ZM126.424 27.3553V27.243C126.424 26.8622 126.479 26.509 126.59 26.1835C126.701 25.8547 126.86 25.5699 127.068 25.329C127.277 25.0848 127.529 24.896 127.825 24.7626C128.121 24.6258 128.453 24.5575 128.821 24.5575C129.192 24.5575 129.526 24.6258 129.822 24.7626C130.122 24.896 130.376 25.0848 130.584 25.329C130.796 25.5699 130.957 25.8547 131.067 26.1835C131.178 26.509 131.233 26.8622 131.233 27.243V27.3553C131.233 27.7362 131.178 28.0894 131.067 28.4149C130.957 28.7404 130.796 29.0253 130.584 29.2694C130.376 29.5103 130.123 29.6991 129.827 29.8358C129.534 29.9693 129.202 30.036 128.831 30.036C128.46 30.036 128.126 29.9693 127.83 29.8358C127.534 29.6991 127.28 29.5103 127.068 29.2694C126.86 29.0253 126.701 28.7404 126.59 28.4149C126.479 28.0894 126.424 27.7362 126.424 27.3553ZM127.327 27.243V27.3553C127.327 27.619 127.358 27.868 127.42 28.1024C127.482 28.3335 127.575 28.5386 127.698 28.7176C127.825 28.8967 127.983 29.0383 128.172 29.1424C128.361 29.2434 128.58 29.2938 128.831 29.2938C129.078 29.2938 129.295 29.2434 129.48 29.1424C129.669 29.0383 129.826 28.8967 129.949 28.7176C130.073 28.5386 130.166 28.3335 130.228 28.1024C130.293 27.868 130.325 27.619 130.325 27.3553V27.243C130.325 26.9826 130.293 26.7368 130.228 26.5057C130.166 26.2714 130.071 26.0646 129.944 25.8856C129.821 25.7033 129.664 25.5601 129.476 25.4559C129.29 25.3518 129.072 25.2997 128.821 25.2997C128.574 25.2997 128.356 25.3518 128.167 25.4559C127.981 25.5601 127.825 25.7033 127.698 25.8856C127.575 26.0646 127.482 26.2714 127.42 26.5057C127.358 26.7368 127.327 26.9826 127.327 27.243ZM133.27 25.4852V29.9383H132.366V24.6551H133.245L133.27 25.4852ZM134.92 24.6258L134.915 25.4657C134.84 25.4494 134.769 25.4396 134.7 25.4364C134.635 25.4299 134.56 25.4266 134.476 25.4266C134.267 25.4266 134.083 25.4592 133.924 25.5243C133.764 25.5894 133.629 25.6805 133.519 25.7977C133.408 25.9149 133.32 26.0549 133.255 26.2176C133.193 26.3771 133.152 26.5529 133.133 26.745L132.879 26.8915C132.879 26.5725 132.91 26.273 132.972 25.993C133.037 25.7131 133.136 25.4657 133.27 25.2508C133.403 25.0327 133.572 24.8635 133.777 24.743C133.986 24.6193 134.233 24.5575 134.52 24.5575C134.585 24.5575 134.66 24.5656 134.744 24.5819C134.829 24.5949 134.887 24.6096 134.92 24.6258ZM136.653 25.7049V29.9383H135.745V24.6551H136.605L136.653 25.7049ZM136.468 27.0965L136.048 27.0819C136.051 26.7206 136.098 26.3869 136.189 26.0809C136.281 25.7717 136.416 25.5031 136.595 25.2753C136.774 25.0474 136.997 24.8716 137.264 24.7479C137.531 24.621 137.84 24.5575 138.191 24.5575C138.439 24.5575 138.667 24.5933 138.875 24.6649C139.083 24.7333 139.264 24.8423 139.417 24.9921C139.57 25.1418 139.689 25.3339 139.773 25.5682C139.858 25.8026 139.9 26.0858 139.9 26.4178V29.9383H138.997V26.4618C138.997 26.1851 138.95 25.9637 138.855 25.7977C138.764 25.6317 138.634 25.5113 138.465 25.4364C138.296 25.3583 138.097 25.3192 137.869 25.3192C137.602 25.3192 137.379 25.3664 137.2 25.4608C137.021 25.5552 136.878 25.6854 136.771 25.8514C136.663 26.0174 136.585 26.2079 136.536 26.4227C136.491 26.6343 136.468 26.8589 136.468 27.0965ZM139.891 26.5985L139.285 26.784C139.288 26.4943 139.336 26.216 139.427 25.9491C139.521 25.6822 139.656 25.4445 139.832 25.2362C140.011 25.0279 140.231 24.8635 140.491 24.743C140.752 24.6193 141.05 24.5575 141.385 24.5575C141.668 24.5575 141.919 24.5949 142.137 24.6698C142.358 24.7447 142.544 24.8602 142.693 25.0165C142.846 25.1695 142.962 25.3664 143.04 25.6073C143.118 25.8482 143.157 26.1346 143.157 26.4667V29.9383H142.249V26.4569C142.249 26.1607 142.202 25.9312 142.107 25.7684C142.016 25.6024 141.886 25.4868 141.717 25.4217C141.551 25.3534 141.352 25.3192 141.121 25.3192C140.923 25.3192 140.747 25.3534 140.594 25.4217C140.441 25.4901 140.312 25.5845 140.208 25.7049C140.104 25.8221 140.024 25.9572 139.969 26.1102C139.917 26.2632 139.891 26.426 139.891 26.5985ZM147.601 28.537C147.601 28.4068 147.571 28.2863 147.513 28.1756C147.457 28.0617 147.342 27.9592 147.166 27.868C146.994 27.7736 146.733 27.6923 146.385 27.6239C146.092 27.562 145.827 27.4888 145.589 27.4042C145.355 27.3195 145.154 27.217 144.988 27.0965C144.826 26.9761 144.7 26.8345 144.612 26.6717C144.524 26.509 144.48 26.3186 144.48 26.1005C144.48 25.8921 144.526 25.6952 144.617 25.5096C144.712 25.3241 144.843 25.1597 145.013 25.0165C145.185 24.8732 145.392 24.7609 145.633 24.6796C145.874 24.5982 146.142 24.5575 146.439 24.5575C146.862 24.5575 147.223 24.6324 147.522 24.7821C147.822 24.9318 148.051 25.132 148.211 25.3827C148.37 25.6301 148.45 25.9051 148.45 26.2079H147.547C147.547 26.0614 147.503 25.9198 147.415 25.7831C147.33 25.6431 147.205 25.5275 147.039 25.4364C146.876 25.3452 146.676 25.2997 146.439 25.2997C146.188 25.2997 145.984 25.3387 145.828 25.4169C145.675 25.4917 145.563 25.5878 145.491 25.7049C145.423 25.8221 145.389 25.9458 145.389 26.076C145.389 26.1737 145.405 26.2616 145.438 26.3397C145.473 26.4146 145.535 26.4846 145.623 26.5497C145.711 26.6115 145.835 26.6701 145.994 26.7255C146.154 26.7808 146.357 26.8361 146.605 26.8915C147.037 26.9891 147.394 27.1063 147.674 27.243C147.954 27.3798 148.162 27.5474 148.299 27.746C148.436 27.9445 148.504 28.1854 148.504 28.4686C148.504 28.6997 148.455 28.9113 148.357 29.1034C148.263 29.2954 148.125 29.4615 147.942 29.6014C147.763 29.7381 147.549 29.8456 147.298 29.9237C147.05 29.9986 146.772 30.036 146.463 30.036C145.997 30.036 145.604 29.953 145.281 29.787C144.959 29.621 144.715 29.4061 144.549 29.1424C144.383 28.8788 144.3 28.6005 144.3 28.3075H145.208C145.221 28.5549 145.293 28.7518 145.423 28.8983C145.553 29.0415 145.713 29.1441 145.901 29.2059C146.09 29.2645 146.277 29.2938 146.463 29.2938C146.71 29.2938 146.917 29.2613 147.083 29.1962C147.252 29.1311 147.381 29.0415 147.469 28.9276C147.557 28.8137 147.601 28.6835 147.601 28.537ZM152.166 22.4383H153.074V28.913L152.996 29.9383H152.166V22.4383ZM156.644 27.2528V27.3553C156.644 27.7395 156.598 28.0959 156.507 28.4247C156.416 28.7502 156.282 29.0334 156.106 29.2743C155.931 29.5152 155.716 29.7023 155.462 29.8358C155.208 29.9693 154.917 30.036 154.588 30.036C154.253 30.036 153.958 29.979 153.704 29.8651C153.453 29.7479 153.242 29.5803 153.069 29.3622C152.897 29.1441 152.758 28.8804 152.654 28.5712C152.553 28.2619 152.483 27.9136 152.444 27.5262V27.077C152.483 26.6864 152.553 26.3365 152.654 26.0272C152.758 25.718 152.897 25.4543 153.069 25.2362C153.242 25.0148 153.453 24.8472 153.704 24.7333C153.955 24.6161 154.246 24.5575 154.578 24.5575C154.91 24.5575 155.205 24.6226 155.462 24.7528C155.719 24.8798 155.934 25.062 156.106 25.2997C156.282 25.5373 156.416 25.8221 156.507 26.1542C156.598 26.4829 156.644 26.8492 156.644 27.2528ZM155.735 27.3553V27.2528C155.735 26.9891 155.711 26.7417 155.662 26.5106C155.613 26.2762 155.535 26.0712 155.428 25.8954C155.32 25.7163 155.179 25.5764 155.003 25.4755C154.827 25.3713 154.611 25.3192 154.354 25.3192C154.126 25.3192 153.927 25.3583 153.758 25.4364C153.592 25.5145 153.45 25.6203 153.333 25.7538C153.216 25.884 153.12 26.0337 153.045 26.203C152.973 26.369 152.92 26.5415 152.884 26.7206V27.8973C152.936 28.1252 153.021 28.3449 153.138 28.5565C153.258 28.7648 153.418 28.9357 153.616 29.0692C153.818 29.2027 154.067 29.2694 154.363 29.2694C154.607 29.2694 154.816 29.2206 154.988 29.1229C155.164 29.022 155.306 28.8837 155.413 28.7079C155.524 28.5321 155.605 28.3286 155.657 28.0975C155.709 27.8664 155.735 27.619 155.735 27.3553ZM159.979 30.036C159.611 30.036 159.277 29.9742 158.978 29.8505C158.681 29.7235 158.426 29.5461 158.211 29.3182C157.999 29.0904 157.837 28.8202 157.723 28.5077C157.609 28.1952 157.552 27.8534 157.552 27.4823V27.2772C157.552 26.8475 157.615 26.465 157.742 26.1298C157.869 25.7912 158.042 25.5048 158.26 25.2704C158.478 25.036 158.725 24.8586 159.002 24.7381C159.279 24.6177 159.565 24.5575 159.861 24.5575C160.239 24.5575 160.564 24.6226 160.838 24.7528C161.115 24.883 161.341 25.0653 161.517 25.2997C161.692 25.5308 161.823 25.8042 161.907 26.12C161.992 26.4325 162.034 26.7743 162.034 27.1454V27.5506H158.089V26.8133H161.131V26.745C161.118 26.5106 161.069 26.2827 160.984 26.0614C160.903 25.84 160.773 25.6577 160.594 25.5145C160.415 25.3713 160.171 25.2997 159.861 25.2997C159.656 25.2997 159.467 25.3436 159.295 25.4315C159.122 25.5161 158.974 25.6431 158.851 25.8124C158.727 25.9816 158.631 26.1883 158.563 26.4325C158.494 26.6766 158.46 26.9582 158.46 27.2772V27.4823C158.46 27.7329 158.494 27.9689 158.563 28.1903C158.634 28.4084 158.737 28.6005 158.87 28.7665C159.007 28.9325 159.171 29.0627 159.363 29.1571C159.559 29.2515 159.78 29.2987 160.027 29.2987C160.346 29.2987 160.617 29.2336 160.838 29.1034C161.059 28.9732 161.253 28.799 161.419 28.5809L161.966 29.0155C161.852 29.188 161.707 29.3524 161.531 29.5087C161.355 29.6649 161.139 29.7919 160.882 29.8895C160.628 29.9872 160.327 30.036 159.979 30.036ZM164.07 22.4383V29.9383H163.162V22.4383H164.07ZM165.281 27.3553V27.243C165.281 26.8622 165.337 26.509 165.447 26.1835C165.558 25.8547 165.717 25.5699 165.926 25.329C166.134 25.0848 166.386 24.896 166.683 24.7626C166.979 24.6258 167.311 24.5575 167.679 24.5575C168.05 24.5575 168.383 24.6258 168.68 24.7626C168.979 24.896 169.233 25.0848 169.441 25.329C169.653 25.5699 169.814 25.8547 169.925 26.1835C170.036 26.509 170.091 26.8622 170.091 27.243V27.3553C170.091 27.7362 170.036 28.0894 169.925 28.4149C169.814 28.7404 169.653 29.0253 169.441 29.2694C169.233 29.5103 168.981 29.6991 168.685 29.8358C168.392 29.9693 168.06 30.036 167.689 30.036C167.317 30.036 166.984 29.9693 166.688 29.8358C166.391 29.6991 166.137 29.5103 165.926 29.2694C165.717 29.0253 165.558 28.7404 165.447 28.4149C165.337 28.0894 165.281 27.7362 165.281 27.3553ZM166.185 27.243V27.3553C166.185 27.619 166.216 27.868 166.277 28.1024C166.339 28.3335 166.432 28.5386 166.556 28.7176C166.683 28.8967 166.841 29.0383 167.029 29.1424C167.218 29.2434 167.438 29.2938 167.689 29.2938C167.936 29.2938 168.152 29.2434 168.338 29.1424C168.527 29.0383 168.683 28.8967 168.807 28.7176C168.93 28.5386 169.023 28.3335 169.085 28.1024C169.15 27.868 169.183 27.619 169.183 27.3553V27.243C169.183 26.9826 169.15 26.7368 169.085 26.5057C169.023 26.2714 168.929 26.0646 168.802 25.8856C168.678 25.7033 168.522 25.5601 168.333 25.4559C168.147 25.3518 167.929 25.2997 167.679 25.2997C167.431 25.2997 167.213 25.3518 167.024 25.4559C166.839 25.5601 166.683 25.7033 166.556 25.8856C166.432 26.0646 166.339 26.2714 166.277 26.5057C166.216 26.7368 166.185 26.9826 166.185 27.243ZM172.562 29.0008L173.919 24.6551H174.515L174.397 25.5194L173.016 29.9383H172.435L172.562 29.0008ZM171.648 24.6551L172.806 29.0497L172.889 29.9383H172.278L170.745 24.6551H171.648ZM175.814 29.0155L176.917 24.6551H177.815L176.282 29.9383H175.677L175.814 29.0155ZM174.647 24.6551L175.975 28.9276L176.126 29.9383H175.55L174.129 25.5096L174.012 24.6551H174.647ZM179.817 22.829L179.754 27.9315H178.939L178.87 22.829H179.817ZM178.841 29.4842C178.841 29.3378 178.885 29.2141 178.973 29.1131C179.064 29.0122 179.197 28.9618 179.373 28.9618C179.546 28.9618 179.677 29.0122 179.769 29.1131C179.863 29.2141 179.91 29.3378 179.91 29.4842C179.91 29.6242 179.863 29.7447 179.769 29.8456C179.677 29.9465 179.546 29.9969 179.373 29.9969C179.197 29.9969 179.064 29.9465 178.973 29.8456C178.885 29.7447 178.841 29.6242 178.841 29.4842Z" fill="#DBDEE1" fill-opacity="0.8" />
                  </svg>

                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports up to 5 different forms per message.</Text>
              </Box>
              <FormLabel fontSize={18}>Select Menu</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => {
                  if (openFormType === 'select_menu') setStage('form')
                  setOpenFormType('select_menu')
                }} border={openFormType === 'select_menu' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>

                  <svg width="225" height="100" viewBox="0 0 150 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="150" height="53" rx="4" fill="#36393F" />
                    <rect x="5" y="5" width="21.4507" height="21.4507" rx="10.7253" fill="#616AF2" />
                    <circle cx="10.9591" cy="12.7862" r="1.02738" fill="white" />
                    <circle cx="10.9591" cy="18.9505" r="1.02738" fill="white" />
                    <circle cx="10.9591" cy="15.8684" r="1.02738" fill="white" />
                    <rect x="13.0138" y="12.0156" width="7.96222" height="1.54108" rx="0.770538" fill="white" />
                    <rect x="13.0138" y="15.0978" width="7.44853" height="1.54108" rx="0.770538" fill="white" />
                    <rect x="13.0138" y="18.18" width="8.21907" height="1.54108" rx="0.770538" fill="white" />
                    <path d="M34.7596 7.84467V13.5322H34.0057V7.84467H34.7596ZM37.1424 10.4033V11.0205H34.5955V10.4033H37.1424ZM37.5291 7.84467V8.46186H34.5955V7.84467H37.5291ZM38.0408 11.4658V11.3759C38.0408 11.0712 38.0851 10.7887 38.1736 10.5283C38.2622 10.2652 38.3898 10.0374 38.5564 9.84467C38.7231 9.64936 38.9249 9.49832 39.1619 9.39155C39.3989 9.28217 39.6645 9.22749 39.9588 9.22749C40.2557 9.22749 40.5226 9.28217 40.7596 9.39155C40.9992 9.49832 41.2023 9.64936 41.3689 9.84467C41.5382 10.0374 41.6671 10.2652 41.7557 10.5283C41.8442 10.7887 41.8885 11.0712 41.8885 11.3759V11.4658C41.8885 11.7705 41.8442 12.053 41.7557 12.3134C41.6671 12.5738 41.5382 12.8017 41.3689 12.997C41.2023 13.1897 41.0005 13.3408 40.7635 13.4501C40.5291 13.5569 40.2635 13.6103 39.9666 13.6103C39.6697 13.6103 39.4028 13.5569 39.1658 13.4501C38.9288 13.3408 38.7257 13.1897 38.5564 12.997C38.3898 12.8017 38.2622 12.5738 38.1736 12.3134C38.0851 12.053 38.0408 11.7705 38.0408 11.4658ZM38.7635 11.3759V11.4658C38.7635 11.6767 38.7882 11.8759 38.8377 12.0634C38.8872 12.2483 38.9614 12.4124 39.0603 12.5556C39.1619 12.6988 39.2882 12.8121 39.4393 12.8955C39.5903 12.9762 39.7661 13.0165 39.9666 13.0165C40.1645 13.0165 40.3377 12.9762 40.4861 12.8955C40.6372 12.8121 40.7622 12.6988 40.8611 12.5556C40.9601 12.4124 41.0343 12.2483 41.0838 12.0634C41.1359 11.8759 41.1619 11.6767 41.1619 11.4658V11.3759C41.1619 11.1676 41.1359 10.971 41.0838 10.7861C41.0343 10.5986 40.9588 10.4332 40.8572 10.29C40.7583 10.1442 40.6333 10.0296 40.4822 9.94624C40.3338 9.8629 40.1593 9.82124 39.9588 9.82124C39.7609 9.82124 39.5864 9.8629 39.4353 9.94624C39.2869 10.0296 39.1619 10.1442 39.0603 10.29C38.9614 10.4332 38.8872 10.5986 38.8377 10.7861C38.7882 10.971 38.7635 11.1676 38.7635 11.3759ZM43.5174 9.96967V13.5322H42.7947V9.30561H43.4978L43.5174 9.96967ZM44.8377 9.28217L44.8338 9.95405C44.7739 9.94103 44.7166 9.93321 44.6619 9.93061C44.6098 9.9254 44.5499 9.9228 44.4822 9.9228C44.3156 9.9228 44.1684 9.94884 44.0408 10.0009C43.9132 10.053 43.8051 10.1259 43.7166 10.2197C43.6281 10.3134 43.5577 10.4254 43.5057 10.5556C43.4562 10.6832 43.4236 10.8238 43.408 10.9775L43.2049 11.0947C43.2049 10.8395 43.2296 10.5999 43.2791 10.3759C43.3312 10.152 43.4106 9.95405 43.5174 9.78217C43.6242 9.60769 43.7596 9.47228 43.9236 9.37592C44.0903 9.27696 44.2882 9.22749 44.5174 9.22749C44.5695 9.22749 44.6294 9.234 44.6971 9.24702C44.7648 9.25743 44.8117 9.26915 44.8377 9.28217ZM46.2244 10.1455V13.5322H45.4978V9.30561H46.1853L46.2244 10.1455ZM46.076 11.2587L45.74 11.247C45.7426 10.958 45.7804 10.691 45.8533 10.4462C45.9262 10.1988 46.0343 9.984 46.1775 9.8017C46.3208 9.61941 46.4992 9.47879 46.7127 9.37983C46.9262 9.27827 47.1736 9.22749 47.4549 9.22749C47.6528 9.22749 47.8351 9.25613 48.0018 9.31342C48.1684 9.36811 48.313 9.45535 48.4353 9.57514C48.5577 9.69493 48.6528 9.84858 48.7205 10.0361C48.7882 10.2236 48.8221 10.4501 48.8221 10.7158V13.5322H48.0994V10.7509C48.0994 10.5296 48.0617 10.3525 47.9861 10.2197C47.9132 10.0869 47.809 9.99051 47.6736 9.93061C47.5382 9.86811 47.3794 9.83686 47.1971 9.83686C46.9835 9.83686 46.8051 9.87462 46.6619 9.95014C46.5187 10.0257 46.4041 10.1298 46.3182 10.2626C46.2322 10.3955 46.1697 10.5478 46.1307 10.7197C46.0942 10.8889 46.076 11.0686 46.076 11.2587ZM48.8143 10.8603L48.3299 11.0087C48.3325 10.777 48.3702 10.5543 48.4432 10.3408C48.5187 10.1272 48.6268 9.93712 48.7674 9.77045C48.9106 9.60379 49.0864 9.47228 49.2947 9.37592C49.5031 9.27696 49.7413 9.22749 50.0096 9.22749C50.2361 9.22749 50.4367 9.25743 50.6111 9.31733C50.7882 9.37723 50.9367 9.46967 51.0564 9.59467C51.1788 9.71707 51.2713 9.87462 51.3338 10.0673C51.3963 10.26 51.4275 10.4892 51.4275 10.7548V13.5322H50.701V10.747C50.701 10.51 50.6632 10.3264 50.5877 10.1962C50.5148 10.0634 50.4106 9.97098 50.2752 9.91889C50.1424 9.8642 49.9835 9.83686 49.7986 9.83686C49.6398 9.83686 49.4992 9.8642 49.3768 9.91889C49.2544 9.97358 49.1515 10.0491 49.0682 10.1455C48.9848 10.2392 48.921 10.3473 48.8768 10.4697C48.8351 10.5921 48.8143 10.7223 48.8143 10.8603ZM54.9822 12.4111C54.9822 12.3069 54.9588 12.2106 54.9119 12.122C54.8676 12.0309 54.7752 11.9488 54.6346 11.8759C54.4965 11.8004 54.2882 11.7353 54.0096 11.6806C53.7752 11.6311 53.563 11.5725 53.3728 11.5048C53.1853 11.4371 53.0252 11.3551 52.8924 11.2587C52.7622 11.1624 52.6619 11.0491 52.5916 10.9189C52.5213 10.7887 52.4861 10.6363 52.4861 10.4619C52.4861 10.2952 52.5226 10.1376 52.5955 9.9892C52.671 9.84077 52.7765 9.70926 52.9119 9.59467C53.0499 9.48009 53.2153 9.39025 53.408 9.32514C53.6007 9.26004 53.8156 9.22749 54.0525 9.22749C54.3911 9.22749 54.6801 9.28738 54.9197 9.40717C55.1593 9.52696 55.3429 9.68712 55.4705 9.88764C55.5981 10.0856 55.6619 10.3056 55.6619 10.5478H54.9393C54.9393 10.4306 54.9041 10.3173 54.8338 10.208C54.7661 10.096 54.6658 10.0035 54.533 9.93061C54.4028 9.85769 54.2426 9.82124 54.0525 9.82124C53.852 9.82124 53.6893 9.85249 53.5643 9.91499C53.4419 9.97488 53.352 10.0517 53.2947 10.1455C53.24 10.2392 53.2127 10.3382 53.2127 10.4423C53.2127 10.5205 53.2257 10.5908 53.2518 10.6533C53.2804 10.7132 53.3299 10.7692 53.4002 10.8212C53.4705 10.8707 53.5695 10.9176 53.6971 10.9619C53.8247 11.0061 53.9874 11.0504 54.1853 11.0947C54.5317 11.1728 54.8169 11.2665 55.0408 11.3759C55.2648 11.4853 55.4314 11.6194 55.5408 11.7783C55.6502 11.9371 55.7049 12.1298 55.7049 12.3564C55.7049 12.5413 55.6658 12.7106 55.5877 12.8642C55.5122 13.0179 55.4015 13.1507 55.2557 13.2626C55.1124 13.372 54.9406 13.458 54.74 13.5205C54.5421 13.5804 54.3195 13.6103 54.0721 13.6103C53.6997 13.6103 53.3846 13.5439 53.1268 13.4111C52.8689 13.2783 52.6736 13.1064 52.5408 12.8955C52.408 12.6845 52.3416 12.4619 52.3416 12.2275H53.0682C53.0786 12.4254 53.1359 12.583 53.24 12.7001C53.3442 12.8147 53.4718 12.8968 53.6228 12.9462C53.7739 12.9931 53.9236 13.0165 54.0721 13.0165C54.27 13.0165 54.4353 12.9905 54.5682 12.9384C54.7036 12.8863 54.8064 12.8147 54.8768 12.7236C54.9471 12.6324 54.9822 12.5283 54.9822 12.4111Z" fill="#5296D5" />
                    <rect x="59.7758" y="6.89727" width="13.5" height="7.91045" rx="2" fill="#5865F2" />
                    <path d="M63.4051 9.84801L62.3431 12.9291H61.701L63.0389 9.37438H63.4491L63.4051 9.84801ZM64.2938 12.9291L63.2294 9.84801L63.183 9.37438H63.5956L64.9383 12.9291H64.2938ZM64.2425 11.6107V12.0965H62.3089V11.6107H64.2425ZM66.6864 11.6034H65.7611V11.1175H66.6864C66.8475 11.1175 66.9777 11.0915 67.077 11.0394C67.1763 10.9873 67.2487 10.9157 67.2943 10.8246C67.3415 10.7318 67.3651 10.626 67.3651 10.5072C67.3651 10.3949 67.3415 10.2899 67.2943 10.1923C67.2487 10.093 67.1763 10.0132 67.077 9.953C66.9777 9.89277 66.8475 9.86266 66.6864 9.86266H65.9491V12.9291H65.3363V9.37438H66.6864C66.9615 9.37438 67.195 9.42321 67.3871 9.52087C67.5808 9.6169 67.7281 9.75036 67.829 9.92126C67.9299 10.0905 67.9803 10.2842 67.9803 10.5023C67.9803 10.7318 67.9299 10.9287 67.829 11.0931C67.7281 11.2575 67.5808 11.3837 67.3871 11.4715C67.195 11.5594 66.9615 11.6034 66.6864 11.6034ZM69.8797 11.6034H68.9545V11.1175H69.8797C70.0409 11.1175 70.1711 11.0915 70.2704 11.0394C70.3697 10.9873 70.4421 10.9157 70.4877 10.8246C70.5349 10.7318 70.5585 10.626 70.5585 10.5072C70.5585 10.3949 70.5349 10.2899 70.4877 10.1923C70.4421 10.093 70.3697 10.0132 70.2704 9.953C70.1711 9.89277 70.0409 9.86266 69.8797 9.86266H69.1424V12.9291H68.5296V9.37438H69.8797C70.1548 9.37438 70.3884 9.42321 70.5804 9.52087C70.7741 9.6169 70.9214 9.75036 71.0223 9.92126C71.1232 10.0905 71.1737 10.2842 71.1737 10.5023C71.1737 10.7318 71.1232 10.9287 71.0223 11.0931C70.9214 11.2575 70.7741 11.3837 70.5804 11.4715C70.3884 11.5594 70.1548 11.6034 69.8797 11.6034Z" fill="white" />
                    <path d="M82.2132 9.00922V13.2983H81.6712V9.68598L80.5784 10.0844V9.59516L82.1282 9.00922H82.2132ZM86.4964 12.144C86.4964 12.4037 86.4358 12.6245 86.3147 12.8061C86.1956 12.9858 86.0335 13.1225 85.8284 13.2162C85.6253 13.31 85.3958 13.3569 85.1399 13.3569C84.8841 13.3569 84.6536 13.31 84.4485 13.2162C84.2435 13.1225 84.0813 12.9858 83.9622 12.8061C83.8431 12.6245 83.7835 12.4037 83.7835 12.144C83.7835 11.9741 83.8157 11.8188 83.8802 11.6782C83.9466 11.5356 84.0394 11.4116 84.1585 11.3061C84.2796 11.2006 84.4222 11.1196 84.5862 11.0629C84.7522 11.0043 84.9349 10.975 85.1341 10.975C85.3958 10.975 85.6292 11.0258 85.8343 11.1274C86.0394 11.227 86.2005 11.3647 86.3177 11.5405C86.4368 11.7162 86.4964 11.9174 86.4964 12.144ZM85.9515 12.1323C85.9515 11.9741 85.9173 11.8344 85.8489 11.7133C85.7806 11.5903 85.6849 11.4946 85.5618 11.4262C85.4388 11.3579 85.2962 11.3237 85.1341 11.3237C84.9681 11.3237 84.8245 11.3579 84.7034 11.4262C84.5843 11.4946 84.4915 11.5903 84.4251 11.7133C84.3587 11.8344 84.3255 11.9741 84.3255 12.1323C84.3255 12.2963 84.3577 12.437 84.4222 12.5541C84.4886 12.6694 84.5823 12.7582 84.7034 12.8207C84.8265 12.8813 84.972 12.9116 85.1399 12.9116C85.3079 12.9116 85.4524 12.8813 85.5735 12.8207C85.6946 12.7582 85.7874 12.6694 85.8519 12.5541C85.9183 12.437 85.9515 12.2963 85.9515 12.1323ZM86.3968 10.143C86.3968 10.35 86.3421 10.5366 86.2327 10.7026C86.1233 10.8686 85.9739 10.9995 85.7845 11.0952C85.595 11.1909 85.3802 11.2387 85.1399 11.2387C84.8958 11.2387 84.678 11.1909 84.4866 11.0952C84.2972 10.9995 84.1487 10.8686 84.0413 10.7026C83.9339 10.5366 83.8802 10.35 83.8802 10.143C83.8802 9.89496 83.9339 9.68402 84.0413 9.51019C84.1507 9.33637 84.3001 9.20355 84.4895 9.11176C84.679 9.01996 84.8948 8.97406 85.137 8.97406C85.3811 8.97406 85.5979 9.01996 85.7874 9.11176C85.9769 9.20355 86.1253 9.33637 86.2327 9.51019C86.3421 9.68402 86.3968 9.89496 86.3968 10.143ZM85.8548 10.1518C85.8548 10.0092 85.8245 9.88324 85.764 9.77387C85.7034 9.66449 85.6194 9.57855 85.512 9.51605C85.4046 9.4516 85.2796 9.41937 85.137 9.41937C84.9944 9.41937 84.8694 9.44965 84.762 9.51019C84.6565 9.56879 84.5735 9.65277 84.513 9.76215C84.4544 9.87152 84.4251 10.0014 84.4251 10.1518C84.4251 10.2983 84.4544 10.4262 84.513 10.5356C84.5735 10.645 84.6575 10.7299 84.7649 10.7905C84.8724 10.851 84.9974 10.8813 85.1399 10.8813C85.2825 10.8813 85.4065 10.851 85.512 10.7905C85.6194 10.7299 85.7034 10.645 85.764 10.5356C85.8245 10.4262 85.8548 10.2983 85.8548 10.1518ZM89.1272 9.03266L87.3489 13.6645H86.8831L88.6644 9.03266H89.1272ZM92.3382 10.8256V11.476C92.3382 11.8256 92.3069 12.1205 92.2444 12.3608C92.1819 12.601 92.0921 12.7944 91.9749 12.9409C91.8577 13.0873 91.7161 13.1938 91.5501 13.2602C91.386 13.3246 91.2005 13.3569 90.9935 13.3569C90.8294 13.3569 90.678 13.3364 90.5394 13.2954C90.4007 13.2543 90.2757 13.1889 90.1644 13.0991C90.055 13.0073 89.9612 12.8881 89.8831 12.7416C89.805 12.5952 89.7454 12.4174 89.7044 12.2084C89.6634 11.9995 89.6429 11.7553 89.6429 11.476V10.8256C89.6429 10.476 89.6741 10.183 89.7366 9.94672C89.8011 9.71039 89.8919 9.52094 90.0091 9.37836C90.1263 9.23383 90.2669 9.13031 90.431 9.06781C90.597 9.00531 90.7825 8.97406 90.9876 8.97406C91.1536 8.97406 91.306 8.99457 91.4446 9.03559C91.5853 9.07465 91.7103 9.13812 91.8196 9.22602C91.929 9.31195 92.0218 9.42719 92.0979 9.57172C92.1761 9.7143 92.2356 9.8891 92.2767 10.0961C92.3177 10.3032 92.3382 10.5463 92.3382 10.8256ZM91.7933 11.5639V10.7348C91.7933 10.5434 91.7815 10.3754 91.7581 10.2309C91.7366 10.0844 91.7044 9.95941 91.6614 9.8559C91.6185 9.75238 91.5638 9.6684 91.4974 9.60394C91.4329 9.53949 91.3577 9.49262 91.2718 9.46332C91.1878 9.43207 91.0931 9.41644 90.9876 9.41644C90.8587 9.41644 90.7444 9.44086 90.6448 9.48969C90.5452 9.53656 90.4612 9.61176 90.3929 9.71527C90.3265 9.81879 90.2757 9.95453 90.2405 10.1225C90.2054 10.2905 90.1878 10.4946 90.1878 10.7348V11.5639C90.1878 11.7553 90.1985 11.9243 90.22 12.0707C90.2435 12.2172 90.2776 12.3442 90.3226 12.4516C90.3675 12.5571 90.4222 12.644 90.4866 12.7123C90.5511 12.7807 90.6253 12.8315 90.7093 12.8647C90.7952 12.8959 90.8899 12.9116 90.9935 12.9116C91.1263 12.9116 91.2425 12.8862 91.3421 12.8354C91.4417 12.7846 91.5247 12.7055 91.5911 12.5981C91.6595 12.4887 91.7103 12.3491 91.7435 12.1791C91.7767 12.0073 91.7933 11.8022 91.7933 11.5639ZM95.8304 12.853V13.2983H93.0384V12.9086L94.4358 11.353C94.6077 11.1616 94.7405 10.9995 94.8343 10.8666C94.93 10.7319 94.9964 10.6118 95.0335 10.5063C95.0726 10.3989 95.0921 10.2895 95.0921 10.1782C95.0921 10.0375 95.0628 9.91059 95.0042 9.7973C94.9476 9.68207 94.8636 9.59027 94.7522 9.52191C94.6409 9.45355 94.5061 9.41937 94.3479 9.41937C94.1585 9.41937 94.0003 9.45648 93.8733 9.5307C93.7483 9.60297 93.6546 9.70453 93.5921 9.83539C93.5296 9.96625 93.4983 10.1166 93.4983 10.2866H92.9563C92.9563 10.0463 93.0091 9.8266 93.1145 9.62738C93.22 9.42816 93.3763 9.26996 93.5833 9.15277C93.7903 9.03363 94.0452 8.97406 94.3479 8.97406C94.6175 8.97406 94.8479 9.02191 95.0394 9.11762C95.2308 9.21137 95.3772 9.34418 95.4788 9.51605C95.5823 9.68598 95.6341 9.88519 95.6341 10.1137C95.6341 10.2387 95.6126 10.3657 95.5696 10.4946C95.5286 10.6215 95.471 10.7485 95.3968 10.8754C95.3245 11.0024 95.2395 11.1274 95.1419 11.2504C95.0462 11.3735 94.9436 11.4946 94.8343 11.6137L93.6917 12.853H95.8304ZM98.3558 9.03266L96.5774 13.6645H96.1116L97.8929 9.03266H98.3558ZM101.684 12.853V13.2983H98.8919V12.9086L100.289 11.353C100.461 11.1616 100.594 10.9995 100.688 10.8666C100.783 10.7319 100.85 10.6118 100.887 10.5063C100.926 10.3989 100.946 10.2895 100.946 10.1782C100.946 10.0375 100.916 9.91059 100.858 9.7973C100.801 9.68207 100.717 9.59027 100.606 9.52191C100.494 9.45355 100.36 9.41937 100.201 9.41937C100.012 9.41937 99.8538 9.45648 99.7269 9.5307C99.6019 9.60297 99.5081 9.70453 99.4456 9.83539C99.3831 9.96625 99.3519 10.1166 99.3519 10.2866H98.8099C98.8099 10.0463 98.8626 9.8266 98.9681 9.62738C99.0735 9.42816 99.2298 9.26996 99.4368 9.15277C99.6438 9.03363 99.8987 8.97406 100.201 8.97406C100.471 8.97406 100.701 9.02191 100.893 9.11762C101.084 9.21137 101.231 9.34418 101.332 9.51605C101.436 9.68598 101.488 9.88519 101.488 10.1137C101.488 10.2387 101.466 10.3657 101.423 10.4946C101.382 10.6215 101.325 10.7485 101.25 10.8754C101.178 11.0024 101.093 11.1274 100.995 11.2504C100.9 11.3735 100.797 11.4946 100.688 11.6137L99.5452 12.853H101.684ZM104.942 10.8256V11.476C104.942 11.8256 104.91 12.1205 104.848 12.3608C104.785 12.601 104.696 12.7944 104.578 12.9409C104.461 13.0873 104.32 13.1938 104.154 13.2602C103.99 13.3246 103.804 13.3569 103.597 13.3569C103.433 13.3569 103.282 13.3364 103.143 13.2954C103.004 13.2543 102.879 13.1889 102.768 13.0991C102.658 13.0073 102.565 12.8881 102.487 12.7416C102.408 12.5952 102.349 12.4174 102.308 12.2084C102.267 11.9995 102.246 11.7553 102.246 11.476V10.8256C102.246 10.476 102.278 10.183 102.34 9.94672C102.405 9.71039 102.495 9.52094 102.613 9.37836C102.73 9.23383 102.87 9.13031 103.034 9.06781C103.2 9.00531 103.386 8.97406 103.591 8.97406C103.757 8.97406 103.909 8.99457 104.048 9.03559C104.189 9.07465 104.314 9.13812 104.423 9.22602C104.533 9.31195 104.625 9.42719 104.701 9.57172C104.78 9.7143 104.839 9.8891 104.88 10.0961C104.921 10.3032 104.942 10.5463 104.942 10.8256ZM104.397 11.5639V10.7348C104.397 10.5434 104.385 10.3754 104.362 10.2309C104.34 10.0844 104.308 9.95941 104.265 9.8559C104.222 9.75238 104.167 9.6684 104.101 9.60394C104.036 9.53949 103.961 9.49262 103.875 9.46332C103.791 9.43207 103.697 9.41644 103.591 9.41644C103.462 9.41644 103.348 9.44086 103.248 9.48969C103.149 9.53656 103.065 9.61176 102.996 9.71527C102.93 9.81879 102.879 9.95453 102.844 10.1225C102.809 10.2905 102.791 10.4946 102.791 10.7348V11.5639C102.791 11.7553 102.802 11.9243 102.824 12.0707C102.847 12.2172 102.881 12.3442 102.926 12.4516C102.971 12.5571 103.026 12.644 103.09 12.7123C103.155 12.7807 103.229 12.8315 103.313 12.8647C103.399 12.8959 103.493 12.9116 103.597 12.9116C103.73 12.9116 103.846 12.8862 103.946 12.8354C104.045 12.7846 104.128 12.7055 104.195 12.5981C104.263 12.4887 104.314 12.3491 104.347 12.1791C104.38 12.0073 104.397 11.8022 104.397 11.5639ZM108.434 12.853V13.2983H105.642V12.9086L107.039 11.353C107.211 11.1616 107.344 10.9995 107.438 10.8666C107.533 10.7319 107.6 10.6118 107.637 10.5063C107.676 10.3989 107.696 10.2895 107.696 10.1782C107.696 10.0375 107.666 9.91059 107.608 9.7973C107.551 9.68207 107.467 9.59027 107.356 9.52191C107.244 9.45355 107.11 9.41937 106.951 9.41937C106.762 9.41937 106.604 9.45648 106.477 9.5307C106.352 9.60297 106.258 9.70453 106.196 9.83539C106.133 9.96625 106.102 10.1166 106.102 10.2866H105.56C105.56 10.0463 105.613 9.8266 105.718 9.62738C105.824 9.42816 105.98 9.26996 106.187 9.15277C106.394 9.03363 106.649 8.97406 106.951 8.97406C107.221 8.97406 107.451 9.02191 107.643 9.11762C107.834 9.21137 107.981 9.34418 108.082 9.51605C108.186 9.68598 108.238 9.88519 108.238 10.1137C108.238 10.2387 108.216 10.3657 108.173 10.4946C108.132 10.6215 108.075 10.7485 108 10.8754C107.928 11.0024 107.843 11.1274 107.745 11.2504C107.65 11.3735 107.547 11.4946 107.438 11.6137L106.295 12.853H108.434ZM111.809 12.853V13.2983H109.017V12.9086L110.414 11.353C110.586 11.1616 110.719 10.9995 110.813 10.8666C110.908 10.7319 110.975 10.6118 111.012 10.5063C111.051 10.3989 111.071 10.2895 111.071 10.1782C111.071 10.0375 111.041 9.91059 110.983 9.7973C110.926 9.68207 110.842 9.59027 110.731 9.52191C110.619 9.45355 110.485 9.41937 110.326 9.41937C110.137 9.41937 109.979 9.45648 109.852 9.5307C109.727 9.60297 109.633 9.70453 109.571 9.83539C109.508 9.96625 109.477 10.1166 109.477 10.2866H108.935C108.935 10.0463 108.988 9.8266 109.093 9.62738C109.199 9.42816 109.355 9.26996 109.562 9.15277C109.769 9.03363 110.024 8.97406 110.326 8.97406C110.596 8.97406 110.826 9.02191 111.018 9.11762C111.209 9.21137 111.356 9.34418 111.457 9.51605C111.561 9.68598 111.613 9.88519 111.613 10.1137C111.613 10.2387 111.591 10.3657 111.548 10.4946C111.507 10.6215 111.45 10.7485 111.375 10.8754C111.303 11.0024 111.218 11.1274 111.12 11.2504C111.025 11.3735 110.922 11.4946 110.813 11.6137L109.67 12.853H111.809Z" fill="#DBDEE1" fill-opacity="0.5" />
                    <rect x="33" y="27" width="111.716" height="18.194" rx="2" fill="#1E1F22" />
                    <path d="M132.147 34.1759C132.24 34.0848 132.366 34.0338 132.496 34.0338C132.627 34.0338 132.752 34.0848 132.845 34.1759L135.485 36.8045L138.126 34.1709C138.171 34.1192 138.226 34.0774 138.288 34.048C138.35 34.0187 138.418 34.0024 138.486 34.0002C138.555 33.9981 138.623 34.0101 138.687 34.0356C138.751 34.061 138.808 34.0993 138.857 34.148C138.905 34.1968 138.942 34.255 138.967 34.3189C138.992 34.3828 139.003 34.4511 138.999 34.5195C138.996 34.5879 138.979 34.6549 138.949 34.7164C138.918 34.7778 138.876 34.8323 138.823 34.8765L135.834 37.858C135.741 37.949 135.616 38 135.485 38C135.355 38 135.23 37.949 135.137 37.858L132.147 34.8765C132.101 34.8303 132.064 34.7754 132.038 34.7148C132.013 34.6543 132 34.5893 132 34.5237C132 34.4581 132.013 34.3932 132.038 34.3326C132.064 34.2721 132.101 34.2171 132.147 34.1709V34.1759Z" fill="white" />
                    <path d="M40.9375 37.1484H41.9141C41.8828 37.5208 41.7786 37.8529 41.6016 38.1445C41.4245 38.4336 41.1758 38.6615 40.8555 38.8281C40.5352 38.9948 40.1458 39.0781 39.6875 39.0781C39.3359 39.0781 39.0195 39.0156 38.7383 38.8906C38.457 38.763 38.2161 38.5833 38.0156 38.3516C37.8151 38.1172 37.6615 37.8346 37.5547 37.5039C37.4505 37.1732 37.3984 36.8034 37.3984 36.3945V35.9219C37.3984 35.513 37.4518 35.1432 37.5586 34.8125C37.668 34.4818 37.8242 34.1992 38.0273 33.9648C38.2305 33.7279 38.474 33.5469 38.7578 33.4219C39.0443 33.2969 39.3659 33.2344 39.7227 33.2344C40.1758 33.2344 40.5586 33.3177 40.8711 33.4844C41.1836 33.651 41.4258 33.8815 41.5977 34.1758C41.7721 34.4701 41.8789 34.8073 41.918 35.1875H40.9414C40.9154 34.9427 40.8581 34.7331 40.7695 34.5586C40.6836 34.3841 40.556 34.2513 40.3867 34.1602C40.2174 34.0664 39.9961 34.0195 39.7227 34.0195C39.4987 34.0195 39.3034 34.0612 39.1367 34.1445C38.9701 34.2279 38.8307 34.3503 38.7188 34.5117C38.6068 34.6732 38.5221 34.8724 38.4648 35.1094C38.4102 35.3438 38.3828 35.612 38.3828 35.9141V36.3945C38.3828 36.681 38.4076 36.9414 38.457 37.1758C38.5091 37.4076 38.5872 37.6068 38.6914 37.7734C38.7982 37.9401 38.9336 38.069 39.0977 38.1602C39.2617 38.2513 39.4583 38.2969 39.6875 38.2969C39.9661 38.2969 40.1914 38.2526 40.3633 38.1641C40.5378 38.0755 40.6693 37.9466 40.7578 37.7773C40.849 37.6055 40.9089 37.3958 40.9375 37.1484ZM43.6406 33V39H42.7031V33H43.6406ZM43.4766 36.7305L43.1719 36.7266C43.1745 36.4349 43.2148 36.1654 43.293 35.918C43.3737 35.6706 43.4857 35.4557 43.6289 35.2734C43.7747 35.0885 43.9492 34.9466 44.1523 34.8477C44.3555 34.7461 44.5807 34.6953 44.8281 34.6953C45.0365 34.6953 45.224 34.724 45.3906 34.7812C45.5599 34.8385 45.7057 34.931 45.8281 35.0586C45.9505 35.1836 46.043 35.3477 46.1055 35.5508C46.1706 35.7513 46.2031 35.9961 46.2031 36.2852V39H45.2578V36.2773C45.2578 36.0742 45.2279 35.9128 45.168 35.793C45.1107 35.6732 45.026 35.5872 44.9141 35.5352C44.8021 35.4805 44.6654 35.4531 44.5039 35.4531C44.3346 35.4531 44.1849 35.487 44.0547 35.5547C43.9271 35.6224 43.8203 35.7148 43.7344 35.832C43.6484 35.9492 43.5833 36.0846 43.5391 36.2383C43.4974 36.3919 43.4766 36.556 43.4766 36.7305ZM46.9766 36.9336V36.8438C46.9766 36.5391 47.0208 36.2565 47.1094 35.9961C47.1979 35.7331 47.3255 35.5052 47.4922 35.3125C47.6615 35.1172 47.8672 34.9661 48.1094 34.8594C48.3542 34.75 48.6302 34.6953 48.9375 34.6953C49.2474 34.6953 49.5234 34.75 49.7656 34.8594C50.0104 34.9661 50.2174 35.1172 50.3867 35.3125C50.556 35.5052 50.6849 35.7331 50.7734 35.9961C50.862 36.2565 50.9062 36.5391 50.9062 36.8438V36.9336C50.9062 37.2383 50.862 37.5208 50.7734 37.7812C50.6849 38.0417 50.556 38.2695 50.3867 38.4648C50.2174 38.6576 50.0117 38.8086 49.7695 38.918C49.5273 39.0247 49.2526 39.0781 48.9453 39.0781C48.6354 39.0781 48.3581 39.0247 48.1133 38.918C47.8711 38.8086 47.6654 38.6576 47.4961 38.4648C47.3268 38.2695 47.1979 38.0417 47.1094 37.7812C47.0208 37.5208 46.9766 37.2383 46.9766 36.9336ZM47.918 36.8438V36.9336C47.918 37.1237 47.9375 37.3034 47.9766 37.4727C48.0156 37.6419 48.0768 37.7904 48.1602 37.918C48.2435 38.0456 48.3503 38.1458 48.4805 38.2188C48.6107 38.2917 48.7656 38.3281 48.9453 38.3281C49.1198 38.3281 49.2708 38.2917 49.3984 38.2188C49.5286 38.1458 49.6354 38.0456 49.7188 37.918C49.8021 37.7904 49.8633 37.6419 49.9023 37.4727C49.944 37.3034 49.9648 37.1237 49.9648 36.9336V36.8438C49.9648 36.6562 49.944 36.4792 49.9023 36.3125C49.8633 36.1432 49.8008 35.9935 49.7148 35.8633C49.6315 35.7331 49.5247 35.6315 49.3945 35.5586C49.2669 35.4831 49.1146 35.4453 48.9375 35.4453C48.7604 35.4453 48.6068 35.4831 48.4766 35.5586C48.349 35.6315 48.2435 35.7331 48.1602 35.8633C48.0768 35.9935 48.0156 36.1432 47.9766 36.3125C47.9375 36.4792 47.918 36.6562 47.918 36.8438ZM51.5156 36.9336V36.8438C51.5156 36.5391 51.5599 36.2565 51.6484 35.9961C51.737 35.7331 51.8646 35.5052 52.0312 35.3125C52.2005 35.1172 52.4062 34.9661 52.6484 34.8594C52.8932 34.75 53.1693 34.6953 53.4766 34.6953C53.7865 34.6953 54.0625 34.75 54.3047 34.8594C54.5495 34.9661 54.7565 35.1172 54.9258 35.3125C55.0951 35.5052 55.224 35.7331 55.3125 35.9961C55.401 36.2565 55.4453 36.5391 55.4453 36.8438V36.9336C55.4453 37.2383 55.401 37.5208 55.3125 37.7812C55.224 38.0417 55.0951 38.2695 54.9258 38.4648C54.7565 38.6576 54.5508 38.8086 54.3086 38.918C54.0664 39.0247 53.7917 39.0781 53.4844 39.0781C53.1745 39.0781 52.8971 39.0247 52.6523 38.918C52.4102 38.8086 52.2044 38.6576 52.0352 38.4648C51.8659 38.2695 51.737 38.0417 51.6484 37.7812C51.5599 37.5208 51.5156 37.2383 51.5156 36.9336ZM52.457 36.8438V36.9336C52.457 37.1237 52.4766 37.3034 52.5156 37.4727C52.5547 37.6419 52.6159 37.7904 52.6992 37.918C52.7826 38.0456 52.8893 38.1458 53.0195 38.2188C53.1497 38.2917 53.3047 38.3281 53.4844 38.3281C53.6589 38.3281 53.8099 38.2917 53.9375 38.2188C54.0677 38.1458 54.1745 38.0456 54.2578 37.918C54.3411 37.7904 54.4023 37.6419 54.4414 37.4727C54.4831 37.3034 54.5039 37.1237 54.5039 36.9336V36.8438C54.5039 36.6562 54.4831 36.4792 54.4414 36.3125C54.4023 36.1432 54.3398 35.9935 54.2539 35.8633C54.1706 35.7331 54.0638 35.6315 53.9336 35.5586C53.806 35.4831 53.6536 35.4453 53.4766 35.4453C53.2995 35.4453 53.1458 35.4831 53.0156 35.5586C52.888 35.6315 52.7826 35.7331 52.6992 35.8633C52.6159 35.9935 52.5547 36.1432 52.5156 36.3125C52.4766 36.4792 52.457 36.6562 52.457 36.8438ZM58.6055 37.8555C58.6055 37.7617 58.582 37.6771 58.5352 37.6016C58.4883 37.5234 58.3984 37.4531 58.2656 37.3906C58.1354 37.3281 57.9427 37.2708 57.6875 37.2188C57.4635 37.1693 57.2578 37.1107 57.0703 37.043C56.8854 36.9727 56.7266 36.888 56.5938 36.7891C56.4609 36.6901 56.3581 36.5729 56.2852 36.4375C56.2122 36.3021 56.1758 36.1458 56.1758 35.9688C56.1758 35.7969 56.2135 35.6341 56.2891 35.4805C56.3646 35.3268 56.4727 35.1914 56.6133 35.0742C56.7539 34.957 56.9245 34.8646 57.125 34.7969C57.3281 34.7292 57.5547 34.6953 57.8047 34.6953C58.1589 34.6953 58.4622 34.7552 58.7148 34.875C58.9701 34.9922 59.1654 35.1523 59.3008 35.3555C59.4362 35.556 59.5039 35.7826 59.5039 36.0352H58.5625C58.5625 35.9232 58.5339 35.819 58.4766 35.7227C58.4219 35.6237 58.3385 35.5443 58.2266 35.4844C58.1146 35.4219 57.974 35.3906 57.8047 35.3906C57.6432 35.3906 57.5091 35.4167 57.4023 35.4688C57.2982 35.5182 57.2201 35.5833 57.168 35.6641C57.1185 35.7448 57.0938 35.8333 57.0938 35.9297C57.0938 36 57.1068 36.0638 57.1328 36.1211C57.1615 36.1758 57.2083 36.2266 57.2734 36.2734C57.3385 36.3177 57.4271 36.3594 57.5391 36.3984C57.6536 36.4375 57.7969 36.4753 57.9688 36.5117C58.2917 36.5794 58.569 36.6667 58.8008 36.7734C59.0352 36.8776 59.2148 37.013 59.3398 37.1797C59.4648 37.3438 59.5273 37.5521 59.5273 37.8047C59.5273 37.9922 59.487 38.1641 59.4062 38.3203C59.3281 38.474 59.2135 38.6081 59.0625 38.7227C58.9115 38.8346 58.7305 38.9219 58.5195 38.9844C58.3112 39.0469 58.0768 39.0781 57.8164 39.0781C57.4336 39.0781 57.1094 39.0104 56.8438 38.875C56.5781 38.737 56.3763 38.5612 56.2383 38.3477C56.1029 38.1315 56.0352 37.9076 56.0352 37.6758H56.9453C56.9557 37.8503 57.0039 37.9896 57.0898 38.0938C57.1784 38.1953 57.2878 38.2695 57.418 38.3164C57.5508 38.3607 57.6875 38.3828 57.8281 38.3828C57.9974 38.3828 58.1393 38.3607 58.2539 38.3164C58.3685 38.2695 58.4557 38.207 58.5156 38.1289C58.5755 38.0482 58.6055 37.957 58.6055 37.8555ZM62.2148 39.0781C61.9023 39.0781 61.6198 39.0273 61.3672 38.9258C61.1172 38.8216 60.9036 38.6771 60.7266 38.4922C60.5521 38.3073 60.418 38.0898 60.3242 37.8398C60.2305 37.5898 60.1836 37.3203 60.1836 37.0312V36.875C60.1836 36.5443 60.2318 36.2448 60.3281 35.9766C60.4245 35.7083 60.5586 35.4792 60.7305 35.2891C60.9023 35.0964 61.1055 34.9492 61.3398 34.8477C61.5742 34.7461 61.8281 34.6953 62.1016 34.6953C62.4036 34.6953 62.668 34.7461 62.8945 34.8477C63.1211 34.9492 63.3086 35.0924 63.457 35.2773C63.6081 35.4596 63.7201 35.6771 63.793 35.9297C63.8685 36.1823 63.9062 36.4609 63.9062 36.7656V37.168H60.6406V36.4922H62.9766V36.418C62.9714 36.2487 62.9375 36.0898 62.875 35.9414C62.8151 35.793 62.7227 35.6732 62.5977 35.582C62.4727 35.4909 62.306 35.4453 62.0977 35.4453C61.9414 35.4453 61.8021 35.4792 61.6797 35.5469C61.5599 35.612 61.4596 35.707 61.3789 35.832C61.2982 35.957 61.2357 36.1081 61.1914 36.2852C61.1497 36.4596 61.1289 36.6562 61.1289 36.875V37.0312C61.1289 37.2161 61.1536 37.388 61.2031 37.5469C61.2552 37.7031 61.3307 37.8398 61.4297 37.957C61.5286 38.0742 61.6484 38.1667 61.7891 38.2344C61.9297 38.2995 62.0898 38.332 62.2695 38.332C62.4961 38.332 62.6979 38.2865 62.875 38.1953C63.0521 38.1042 63.2057 37.9753 63.3359 37.8086L63.832 38.2891C63.7409 38.4219 63.6224 38.5495 63.4766 38.6719C63.3307 38.7917 63.1523 38.8893 62.9414 38.9648C62.7331 39.0404 62.4909 39.0781 62.2148 39.0781ZM69.0156 38.1523V36.1367C69.0156 35.9857 68.9883 35.8555 68.9336 35.7461C68.8789 35.6367 68.7956 35.5521 68.6836 35.4922C68.5742 35.4323 68.4362 35.4023 68.2695 35.4023C68.1159 35.4023 67.9831 35.4284 67.8711 35.4805C67.7591 35.5326 67.6719 35.6029 67.6094 35.6914C67.5469 35.7799 67.5156 35.8802 67.5156 35.9922H66.5781C66.5781 35.8255 66.6185 35.6641 66.6992 35.5078C66.7799 35.3516 66.8971 35.2122 67.0508 35.0898C67.2044 34.9674 67.388 34.8711 67.6016 34.8008C67.8151 34.7305 68.0547 34.6953 68.3203 34.6953C68.638 34.6953 68.9193 34.7487 69.1641 34.8555C69.4115 34.9622 69.6055 35.1237 69.7461 35.3398C69.8893 35.5534 69.9609 35.8216 69.9609 36.1445V38.0234C69.9609 38.2161 69.974 38.3893 70 38.543C70.0286 38.694 70.069 38.8255 70.1211 38.9375V39H69.1562C69.112 38.8984 69.0768 38.7695 69.0508 38.6133C69.0273 38.4544 69.0156 38.3008 69.0156 38.1523ZM69.1523 36.4297L69.1602 37.0117H68.4844C68.3099 37.0117 68.1562 37.0286 68.0234 37.0625C67.8906 37.0938 67.7799 37.1406 67.6914 37.2031C67.6029 37.2656 67.5365 37.3411 67.4922 37.4297C67.4479 37.5182 67.4258 37.6185 67.4258 37.7305C67.4258 37.8424 67.4518 37.9453 67.5039 38.0391C67.556 38.1302 67.6315 38.2018 67.7305 38.2539C67.832 38.306 67.9544 38.332 68.0977 38.332C68.2904 38.332 68.4583 38.293 68.6016 38.2148C68.7474 38.1341 68.862 38.0365 68.9453 37.9219C69.0286 37.8047 69.0729 37.694 69.0781 37.5898L69.3828 38.0078C69.3516 38.1146 69.2982 38.2292 69.2227 38.3516C69.1471 38.474 69.0482 38.5911 68.9258 38.7031C68.806 38.8125 68.6615 38.9023 68.4922 38.9727C68.3255 39.043 68.1328 39.0781 67.9141 39.0781C67.638 39.0781 67.3919 39.0234 67.1758 38.9141C66.9596 38.8021 66.7904 38.6523 66.668 38.4648C66.5456 38.2747 66.4844 38.0599 66.4844 37.8203C66.4844 37.5964 66.526 37.3984 66.6094 37.2266C66.6953 37.0521 66.8203 36.9062 66.9844 36.7891C67.151 36.6719 67.3542 36.5833 67.5938 36.5234C67.8333 36.4609 68.1068 36.4297 68.4141 36.4297H69.1523ZM74.2109 39H73.2695V34.3672C73.2695 34.0521 73.3281 33.7878 73.4453 33.5742C73.5651 33.3581 73.7357 33.1953 73.957 33.0859C74.1784 32.974 74.4401 32.918 74.7422 32.918C74.8359 32.918 74.9284 32.9245 75.0195 32.9375C75.1107 32.9479 75.1992 32.9648 75.2852 32.9883L75.2617 33.7148C75.2096 33.7018 75.1523 33.6927 75.0898 33.6875C75.0299 33.6823 74.9648 33.6797 74.8945 33.6797C74.7513 33.6797 74.6276 33.707 74.5234 33.7617C74.4219 33.8138 74.3438 33.8906 74.2891 33.9922C74.237 34.0938 74.2109 34.2188 74.2109 34.3672V39ZM75.082 34.7734V35.4609H72.6211V34.7734H75.082ZM75.5859 36.9336V36.8438C75.5859 36.5391 75.6302 36.2565 75.7188 35.9961C75.8073 35.7331 75.9349 35.5052 76.1016 35.3125C76.2708 35.1172 76.4766 34.9661 76.7188 34.8594C76.9635 34.75 77.2396 34.6953 77.5469 34.6953C77.8568 34.6953 78.1328 34.75 78.375 34.8594C78.6198 34.9661 78.8268 35.1172 78.9961 35.3125C79.1654 35.5052 79.2943 35.7331 79.3828 35.9961C79.4714 36.2565 79.5156 36.5391 79.5156 36.8438V36.9336C79.5156 37.2383 79.4714 37.5208 79.3828 37.7812C79.2943 38.0417 79.1654 38.2695 78.9961 38.4648C78.8268 38.6576 78.6211 38.8086 78.3789 38.918C78.1367 39.0247 77.862 39.0781 77.5547 39.0781C77.2448 39.0781 76.9674 39.0247 76.7227 38.918C76.4805 38.8086 76.2747 38.6576 76.1055 38.4648C75.9362 38.2695 75.8073 38.0417 75.7188 37.7812C75.6302 37.5208 75.5859 37.2383 75.5859 36.9336ZM76.5273 36.8438V36.9336C76.5273 37.1237 76.5469 37.3034 76.5859 37.4727C76.625 37.6419 76.6862 37.7904 76.7695 37.918C76.8529 38.0456 76.9596 38.1458 77.0898 38.2188C77.2201 38.2917 77.375 38.3281 77.5547 38.3281C77.7292 38.3281 77.8802 38.2917 78.0078 38.2188C78.138 38.1458 78.2448 38.0456 78.3281 37.918C78.4115 37.7904 78.4727 37.6419 78.5117 37.4727C78.5534 37.3034 78.5742 37.1237 78.5742 36.9336V36.8438C78.5742 36.6562 78.5534 36.4792 78.5117 36.3125C78.4727 36.1432 78.4102 35.9935 78.3242 35.8633C78.2409 35.7331 78.1341 35.6315 78.0039 35.5586C77.8763 35.4831 77.724 35.4453 77.5469 35.4453C77.3698 35.4453 77.2161 35.4831 77.0859 35.5586C76.9583 35.6315 76.8529 35.7331 76.7695 35.8633C76.6862 35.9935 76.625 36.1432 76.5859 36.3125C76.5469 36.4792 76.5273 36.6562 76.5273 36.8438ZM81.25 35.5781V39H80.3086V34.7734H81.207L81.25 35.5781ZM82.543 34.7461L82.5352 35.6211C82.4779 35.6107 82.4154 35.6029 82.3477 35.5977C82.2826 35.5924 82.2174 35.5898 82.1523 35.5898C81.9909 35.5898 81.849 35.6133 81.7266 35.6602C81.6042 35.7044 81.5013 35.7695 81.418 35.8555C81.3372 35.9388 81.2747 36.0404 81.2305 36.1602C81.1862 36.2799 81.1602 36.4141 81.1523 36.5625L80.9375 36.5781C80.9375 36.3125 80.9635 36.0664 81.0156 35.8398C81.0677 35.6133 81.1458 35.4141 81.25 35.2422C81.3568 35.0703 81.4896 34.9362 81.6484 34.8398C81.8099 34.7435 81.9961 34.6953 82.207 34.6953C82.2643 34.6953 82.3255 34.7005 82.3906 34.7109C82.4583 34.7214 82.5091 34.7331 82.543 34.7461ZM84.0742 35.6328V39H83.1328V34.7734H84.0195L84.0742 35.6328ZM83.9219 36.7305L83.6016 36.7266C83.6016 36.4349 83.638 36.1654 83.7109 35.918C83.7839 35.6706 83.8906 35.4557 84.0312 35.2734C84.1719 35.0885 84.3464 34.9466 84.5547 34.8477C84.7656 34.7461 85.0091 34.6953 85.2852 34.6953C85.4779 34.6953 85.6536 34.724 85.8125 34.7812C85.974 34.8359 86.1133 34.9232 86.2305 35.043C86.3503 35.1628 86.4414 35.3164 86.5039 35.5039C86.569 35.6914 86.6016 35.918 86.6016 36.1836V39H85.6602V36.2656C85.6602 36.0599 85.6289 35.8984 85.5664 35.7812C85.5065 35.6641 85.4193 35.5807 85.3047 35.5312C85.1927 35.4792 85.0586 35.4531 84.9023 35.4531C84.7253 35.4531 84.5742 35.487 84.4492 35.5547C84.3268 35.6224 84.2266 35.7148 84.1484 35.832C84.0703 35.9492 84.013 36.0846 83.9766 36.2383C83.9401 36.3919 83.9219 36.556 83.9219 36.7305ZM86.543 36.4805L86.1016 36.5781C86.1016 36.3229 86.1367 36.082 86.207 35.8555C86.2799 35.6263 86.3854 35.4258 86.5234 35.2539C86.6641 35.0794 86.8372 34.9427 87.043 34.8438C87.2487 34.7448 87.4844 34.6953 87.75 34.6953C87.9661 34.6953 88.1589 34.7253 88.3281 34.7852C88.5 34.8424 88.6458 34.9336 88.7656 35.0586C88.8854 35.1836 88.9766 35.3464 89.0391 35.5469C89.1016 35.7448 89.1328 35.9844 89.1328 36.2656V39H88.1875V36.2617C88.1875 36.0482 88.1562 35.8828 88.0938 35.7656C88.0339 35.6484 87.9479 35.5677 87.8359 35.5234C87.724 35.4766 87.5898 35.4531 87.4336 35.4531C87.2878 35.4531 87.1589 35.4805 87.0469 35.5352C86.9375 35.5872 86.8451 35.6615 86.7695 35.7578C86.694 35.8516 86.6367 35.9596 86.5977 36.082C86.5612 36.2044 86.543 36.3372 86.543 36.4805ZM94.0312 34.7734V35.4609H91.6484V34.7734H94.0312ZM92.3359 33.7383H93.2773V37.832C93.2773 37.9622 93.2956 38.0625 93.332 38.1328C93.3711 38.2005 93.4245 38.2461 93.4922 38.2695C93.5599 38.293 93.6393 38.3047 93.7305 38.3047C93.7956 38.3047 93.8581 38.3008 93.918 38.293C93.9779 38.2852 94.026 38.2773 94.0625 38.2695L94.0664 38.9883C93.9883 39.0117 93.8971 39.0326 93.793 39.0508C93.6914 39.069 93.5742 39.0781 93.4414 39.0781C93.2253 39.0781 93.0339 39.0404 92.8672 38.9648C92.7005 38.8867 92.5703 38.7604 92.4766 38.5859C92.3828 38.4115 92.3359 38.1797 92.3359 37.8906V33.7383ZM94.4844 36.9336V36.8438C94.4844 36.5391 94.5286 36.2565 94.6172 35.9961C94.7057 35.7331 94.8333 35.5052 95 35.3125C95.1693 35.1172 95.375 34.9661 95.6172 34.8594C95.862 34.75 96.138 34.6953 96.4453 34.6953C96.7552 34.6953 97.0312 34.75 97.2734 34.8594C97.5182 34.9661 97.7253 35.1172 97.8945 35.3125C98.0638 35.5052 98.1927 35.7331 98.2812 35.9961C98.3698 36.2565 98.4141 36.5391 98.4141 36.8438V36.9336C98.4141 37.2383 98.3698 37.5208 98.2812 37.7812C98.1927 38.0417 98.0638 38.2695 97.8945 38.4648C97.7253 38.6576 97.5195 38.8086 97.2773 38.918C97.0352 39.0247 96.7604 39.0781 96.4531 39.0781C96.1432 39.0781 95.8659 39.0247 95.6211 38.918C95.3789 38.8086 95.1732 38.6576 95.0039 38.4648C94.8346 38.2695 94.7057 38.0417 94.6172 37.7812C94.5286 37.5208 94.4844 37.2383 94.4844 36.9336ZM95.4258 36.8438V36.9336C95.4258 37.1237 95.4453 37.3034 95.4844 37.4727C95.5234 37.6419 95.5846 37.7904 95.668 37.918C95.7513 38.0456 95.8581 38.1458 95.9883 38.2188C96.1185 38.2917 96.2734 38.3281 96.4531 38.3281C96.6276 38.3281 96.7786 38.2917 96.9062 38.2188C97.0365 38.1458 97.1432 38.0456 97.2266 37.918C97.3099 37.7904 97.3711 37.6419 97.4102 37.4727C97.4518 37.3034 97.4727 37.1237 97.4727 36.9336V36.8438C97.4727 36.6562 97.4518 36.4792 97.4102 36.3125C97.3711 36.1432 97.3086 35.9935 97.2227 35.8633C97.1393 35.7331 97.0326 35.6315 96.9023 35.5586C96.7747 35.4831 96.6224 35.4453 96.4453 35.4453C96.2682 35.4453 96.1146 35.4831 95.9844 35.5586C95.8568 35.6315 95.7513 35.7331 95.668 35.8633C95.5846 35.9935 95.5234 36.1432 95.4844 36.3125C95.4453 36.4792 95.4258 36.6562 95.4258 36.8438ZM102.406 39H101.461V34.5C101.461 34.1589 101.529 33.8711 101.664 33.6367C101.802 33.4023 101.999 33.224 102.254 33.1016C102.512 32.9792 102.818 32.918 103.172 32.918C103.38 32.918 103.581 32.9401 103.773 32.9844C103.969 33.0286 104.171 33.0846 104.379 33.1523L104.234 33.918C104.102 33.8737 103.954 33.832 103.793 33.793C103.632 33.7513 103.445 33.7305 103.234 33.7305C102.951 33.7305 102.741 33.7956 102.605 33.9258C102.473 34.0534 102.406 34.2448 102.406 34.5V39ZM103.254 34.7734V35.4609H100.812V34.7734H103.254ZM104.824 34.7734V39H103.883V34.7734H104.824ZM106.883 33V39H105.938V33H106.883ZM108.922 33V39H107.977V33H108.922ZM111.766 36.9336V36.8438C111.766 36.5391 111.81 36.2565 111.898 35.9961C111.987 35.7331 112.115 35.5052 112.281 35.3125C112.451 35.1172 112.656 34.9661 112.898 34.8594C113.143 34.75 113.419 34.6953 113.727 34.6953C114.036 34.6953 114.312 34.75 114.555 34.8594C114.799 34.9661 115.007 35.1172 115.176 35.3125C115.345 35.5052 115.474 35.7331 115.562 35.9961C115.651 36.2565 115.695 36.5391 115.695 36.8438V36.9336C115.695 37.2383 115.651 37.5208 115.562 37.7812C115.474 38.0417 115.345 38.2695 115.176 38.4648C115.007 38.6576 114.801 38.8086 114.559 38.918C114.316 39.0247 114.042 39.0781 113.734 39.0781C113.424 39.0781 113.147 39.0247 112.902 38.918C112.66 38.8086 112.454 38.6576 112.285 38.4648C112.116 38.2695 111.987 38.0417 111.898 37.7812C111.81 37.5208 111.766 37.2383 111.766 36.9336ZM112.707 36.8438V36.9336C112.707 37.1237 112.727 37.3034 112.766 37.4727C112.805 37.6419 112.866 37.7904 112.949 37.918C113.033 38.0456 113.139 38.1458 113.27 38.2188C113.4 38.2917 113.555 38.3281 113.734 38.3281C113.909 38.3281 114.06 38.2917 114.188 38.2188C114.318 38.1458 114.424 38.0456 114.508 37.918C114.591 37.7904 114.652 37.6419 114.691 37.4727C114.733 37.3034 114.754 37.1237 114.754 36.9336V36.8438C114.754 36.6562 114.733 36.4792 114.691 36.3125C114.652 36.1432 114.59 35.9935 114.504 35.8633C114.421 35.7331 114.314 35.6315 114.184 35.5586C114.056 35.4831 113.904 35.4453 113.727 35.4453C113.549 35.4453 113.396 35.4831 113.266 35.5586C113.138 35.6315 113.033 35.7331 112.949 35.8633C112.866 35.9935 112.805 36.1432 112.766 36.3125C112.727 36.4792 112.707 36.6562 112.707 36.8438ZM119.027 38.0039V34.7734H119.973V39H119.082L119.027 38.0039ZM119.16 37.125L119.477 37.1172C119.477 37.401 119.445 37.6628 119.383 37.9023C119.32 38.1393 119.224 38.3464 119.094 38.5234C118.964 38.6979 118.797 38.8346 118.594 38.9336C118.391 39.0299 118.147 39.0781 117.863 39.0781C117.658 39.0781 117.469 39.0482 117.297 38.9883C117.125 38.9284 116.977 38.8359 116.852 38.7109C116.729 38.5859 116.634 38.4232 116.566 38.2227C116.499 38.0221 116.465 37.7826 116.465 37.5039V34.7734H117.406V37.5117C117.406 37.6654 117.424 37.7943 117.461 37.8984C117.497 38 117.547 38.082 117.609 38.1445C117.672 38.207 117.745 38.2513 117.828 38.2773C117.911 38.3034 118 38.3164 118.094 38.3164C118.362 38.3164 118.573 38.2643 118.727 38.1602C118.883 38.0534 118.993 37.9102 119.059 37.7305C119.126 37.5508 119.16 37.349 119.16 37.125ZM122.875 34.7734V35.4609H120.492V34.7734H122.875ZM121.18 33.7383H122.121V37.832C122.121 37.9622 122.139 38.0625 122.176 38.1328C122.215 38.2005 122.268 38.2461 122.336 38.2695C122.404 38.293 122.483 38.3047 122.574 38.3047C122.639 38.3047 122.702 38.3008 122.762 38.293C122.822 38.2852 122.87 38.2773 122.906 38.2695L122.91 38.9883C122.832 39.0117 122.741 39.0326 122.637 39.0508C122.535 39.069 122.418 39.0781 122.285 39.0781C122.069 39.0781 121.878 39.0404 121.711 38.9648C121.544 38.8867 121.414 38.7604 121.32 38.5859C121.227 38.4115 121.18 38.1797 121.18 37.8906V33.7383Z" fill="#949BA4" />
                    <path d="M35.7578 21.7695H34.2383V21.1562H35.7578C36.0521 21.1562 36.2904 21.1094 36.4727 21.0156C36.6549 20.9219 36.7878 20.7917 36.8711 20.625C36.957 20.4583 37 20.2682 37 20.0547C37 19.8594 36.957 19.6758 36.8711 19.5039C36.7878 19.332 36.6549 19.194 36.4727 19.0898C36.2904 18.9831 36.0521 18.9297 35.7578 18.9297H34.4141V24H33.6602V18.3125H35.7578C36.1875 18.3125 36.5508 18.3867 36.8477 18.5352C37.1445 18.6836 37.3698 18.8893 37.5234 19.1523C37.6771 19.4128 37.7539 19.7109 37.7539 20.0469C37.7539 20.4115 37.6771 20.7227 37.5234 20.9805C37.3698 21.2383 37.1445 21.4349 36.8477 21.5703C36.5508 21.7031 36.1875 21.7695 35.7578 21.7695ZM39.3828 18V24H38.6562V18H39.3828ZM42.2969 24.0781C42.0026 24.0781 41.7357 24.0286 41.4961 23.9297C41.2591 23.8281 41.0547 23.6862 40.8828 23.5039C40.7135 23.3216 40.5833 23.1055 40.4922 22.8555C40.401 22.6055 40.3555 22.332 40.3555 22.0352V21.8711C40.3555 21.5273 40.4062 21.2214 40.5078 20.9531C40.6094 20.6823 40.7474 20.4531 40.9219 20.2656C41.0964 20.0781 41.2943 19.9362 41.5156 19.8398C41.737 19.7435 41.9661 19.6953 42.2031 19.6953C42.5052 19.6953 42.7656 19.7474 42.9844 19.8516C43.2057 19.9557 43.3867 20.1016 43.5273 20.2891C43.668 20.474 43.7721 20.6927 43.8398 20.9453C43.9076 21.1953 43.9414 21.4688 43.9414 21.7656V22.0898H40.7852V21.5H43.2188V21.4453C43.2083 21.2578 43.1693 21.0755 43.1016 20.8984C43.0365 20.7214 42.9323 20.5755 42.7891 20.4609C42.6458 20.3464 42.4505 20.2891 42.2031 20.2891C42.0391 20.2891 41.888 20.3242 41.75 20.3945C41.612 20.4622 41.4935 20.5638 41.3945 20.6992C41.2956 20.8346 41.2188 21 41.1641 21.1953C41.1094 21.3906 41.082 21.6159 41.082 21.8711V22.0352C41.082 22.2357 41.1094 22.4245 41.1641 22.6016C41.2214 22.776 41.3034 22.9297 41.4102 23.0625C41.5195 23.1953 41.651 23.2995 41.8047 23.375C41.9609 23.4505 42.138 23.4883 42.3359 23.4883C42.5911 23.4883 42.8073 23.4362 42.9844 23.332C43.1615 23.2279 43.3164 23.0885 43.4492 22.9141L43.8867 23.2617C43.7956 23.3997 43.6797 23.5312 43.5391 23.6562C43.3984 23.7812 43.2253 23.8828 43.0195 23.9609C42.8164 24.0391 42.5755 24.0781 42.2969 24.0781ZM47.2773 23.2773V21.1016C47.2773 20.9349 47.2435 20.7904 47.1758 20.668C47.1107 20.543 47.0117 20.4466 46.8789 20.3789C46.7461 20.3112 46.582 20.2773 46.3867 20.2773C46.2044 20.2773 46.0443 20.3086 45.9062 20.3711C45.7708 20.4336 45.6641 20.5156 45.5859 20.6172C45.5104 20.7188 45.4727 20.8281 45.4727 20.9453H44.75C44.75 20.7943 44.7891 20.6445 44.8672 20.4961C44.9453 20.3477 45.0573 20.2135 45.2031 20.0938C45.3516 19.9714 45.5286 19.875 45.7344 19.8047C45.9427 19.7318 46.1745 19.6953 46.4297 19.6953C46.737 19.6953 47.0078 19.7474 47.2422 19.8516C47.4792 19.9557 47.6641 20.1133 47.7969 20.3242C47.9323 20.5326 48 20.7943 48 21.1094V23.0781C48 23.2188 48.0117 23.3685 48.0352 23.5273C48.0612 23.6862 48.099 23.8229 48.1484 23.9375V24H47.3945C47.3581 23.9167 47.3294 23.806 47.3086 23.668C47.2878 23.5273 47.2773 23.3971 47.2773 23.2773ZM47.4023 21.4375L47.4102 21.9453H46.6797C46.474 21.9453 46.2904 21.9622 46.1289 21.9961C45.9674 22.0273 45.832 22.0755 45.7227 22.1406C45.6133 22.2057 45.5299 22.2878 45.4727 22.3867C45.4154 22.4831 45.3867 22.5964 45.3867 22.7266C45.3867 22.8594 45.4167 22.9805 45.4766 23.0898C45.5365 23.1992 45.6263 23.2865 45.7461 23.3516C45.8685 23.4141 46.0182 23.4453 46.1953 23.4453C46.4167 23.4453 46.612 23.3984 46.7812 23.3047C46.9505 23.2109 47.0846 23.0964 47.1836 22.9609C47.2852 22.8255 47.3398 22.694 47.3477 22.5664L47.6562 22.9141C47.638 23.0234 47.5885 23.1445 47.5078 23.2773C47.4271 23.4102 47.319 23.5378 47.1836 23.6602C47.0508 23.7799 46.8919 23.8802 46.707 23.9609C46.5247 24.0391 46.319 24.0781 46.0898 24.0781C45.8034 24.0781 45.5521 24.0221 45.3359 23.9102C45.1224 23.7982 44.9557 23.6484 44.8359 23.4609C44.7188 23.2708 44.6602 23.0586 44.6602 22.8242C44.6602 22.5977 44.7044 22.3984 44.793 22.2266C44.8815 22.0521 45.0091 21.9076 45.1758 21.793C45.3424 21.6758 45.543 21.5872 45.7773 21.5273C46.0117 21.4674 46.2734 21.4375 46.5625 21.4375H47.4023ZM51.5977 22.8789C51.5977 22.7747 51.5742 22.6784 51.5273 22.5898C51.4831 22.4987 51.3906 22.4167 51.25 22.3438C51.112 22.2682 50.9036 22.2031 50.625 22.1484C50.3906 22.099 50.1784 22.0404 49.9883 21.9727C49.8008 21.9049 49.6406 21.8229 49.5078 21.7266C49.3776 21.6302 49.2773 21.5169 49.207 21.3867C49.1367 21.2565 49.1016 21.1042 49.1016 20.9297C49.1016 20.763 49.138 20.6055 49.2109 20.457C49.2865 20.3086 49.3919 20.1771 49.5273 20.0625C49.6654 19.9479 49.8307 19.8581 50.0234 19.793C50.2161 19.7279 50.431 19.6953 50.668 19.6953C51.0065 19.6953 51.2956 19.7552 51.5352 19.875C51.7747 19.9948 51.9583 20.1549 52.0859 20.3555C52.2135 20.5534 52.2773 20.7734 52.2773 21.0156H51.5547C51.5547 20.8984 51.5195 20.7852 51.4492 20.6758C51.3815 20.5638 51.2812 20.4714 51.1484 20.3984C51.0182 20.3255 50.8581 20.2891 50.668 20.2891C50.4674 20.2891 50.3047 20.3203 50.1797 20.3828C50.0573 20.4427 49.9674 20.5195 49.9102 20.6133C49.8555 20.707 49.8281 20.806 49.8281 20.9102C49.8281 20.9883 49.8411 21.0586 49.8672 21.1211C49.8958 21.181 49.9453 21.237 50.0156 21.2891C50.0859 21.3385 50.1849 21.3854 50.3125 21.4297C50.4401 21.474 50.6029 21.5182 50.8008 21.5625C51.1471 21.6406 51.4323 21.7344 51.6562 21.8438C51.8802 21.9531 52.0469 22.0872 52.1562 22.2461C52.2656 22.4049 52.3203 22.5977 52.3203 22.8242C52.3203 23.0091 52.2812 23.1784 52.2031 23.332C52.1276 23.4857 52.0169 23.6185 51.8711 23.7305C51.7279 23.8398 51.556 23.9258 51.3555 23.9883C51.1576 24.0482 50.9349 24.0781 50.6875 24.0781C50.3151 24.0781 50 24.0117 49.7422 23.8789C49.4844 23.7461 49.2891 23.5742 49.1562 23.3633C49.0234 23.1523 48.957 22.9297 48.957 22.6953H49.6836C49.694 22.8932 49.7513 23.0508 49.8555 23.168C49.9596 23.2826 50.0872 23.3646 50.2383 23.4141C50.3893 23.4609 50.5391 23.4844 50.6875 23.4844C50.8854 23.4844 51.0508 23.4583 51.1836 23.4062C51.319 23.3542 51.4219 23.2826 51.4922 23.1914C51.5625 23.1003 51.5977 22.9961 51.5977 22.8789ZM55.0234 24.0781C54.7292 24.0781 54.4622 24.0286 54.2227 23.9297C53.9857 23.8281 53.7812 23.6862 53.6094 23.5039C53.4401 23.3216 53.3099 23.1055 53.2188 22.8555C53.1276 22.6055 53.082 22.332 53.082 22.0352V21.8711C53.082 21.5273 53.1328 21.2214 53.2344 20.9531C53.3359 20.6823 53.474 20.4531 53.6484 20.2656C53.8229 20.0781 54.0208 19.9362 54.2422 19.8398C54.4635 19.7435 54.6927 19.6953 54.9297 19.6953C55.2318 19.6953 55.4922 19.7474 55.7109 19.8516C55.9323 19.9557 56.1133 20.1016 56.2539 20.2891C56.3945 20.474 56.4987 20.6927 56.5664 20.9453C56.6341 21.1953 56.668 21.4688 56.668 21.7656V22.0898H53.5117V21.5H55.9453V21.4453C55.9349 21.2578 55.8958 21.0755 55.8281 20.8984C55.763 20.7214 55.6589 20.5755 55.5156 20.4609C55.3724 20.3464 55.1771 20.2891 54.9297 20.2891C54.7656 20.2891 54.6146 20.3242 54.4766 20.3945C54.3385 20.4622 54.2201 20.5638 54.1211 20.6992C54.0221 20.8346 53.9453 21 53.8906 21.1953C53.8359 21.3906 53.8086 21.6159 53.8086 21.8711V22.0352C53.8086 22.2357 53.8359 22.4245 53.8906 22.6016C53.9479 22.776 54.0299 22.9297 54.1367 23.0625C54.2461 23.1953 54.3776 23.2995 54.5312 23.375C54.6875 23.4505 54.8646 23.4883 55.0625 23.4883C55.3177 23.4883 55.5339 23.4362 55.7109 23.332C55.888 23.2279 56.043 23.0885 56.1758 22.9141L56.6133 23.2617C56.5221 23.3997 56.4062 23.5312 56.2656 23.6562C56.125 23.7812 55.9518 23.8828 55.7461 23.9609C55.543 24.0391 55.3021 24.0781 55.0234 24.0781ZM60.4609 24H59.7383V19.4062C59.7383 19.0859 59.8008 18.8151 59.9258 18.5938C60.0508 18.3724 60.2292 18.2044 60.4609 18.0898C60.6927 17.9753 60.9674 17.918 61.2852 17.918C61.4727 17.918 61.6562 17.9414 61.8359 17.9883C62.0156 18.0326 62.2005 18.0885 62.3906 18.1562L62.2695 18.7656C62.1497 18.7188 62.0104 18.6745 61.8516 18.6328C61.6953 18.5885 61.5234 18.5664 61.3359 18.5664C61.026 18.5664 60.8021 18.6367 60.6641 18.7773C60.5286 18.9154 60.4609 19.125 60.4609 19.4062V24ZM61.3242 19.7734V20.3281H59.0703V19.7734H61.3242ZM62.7461 19.7734V24H62.0234V19.7734H62.7461ZM64.7188 18V24H63.9922V18H64.7188ZM66.6641 18V24H65.9375V18H66.6641ZM69.6172 21.9336V21.8438C69.6172 21.5391 69.6615 21.2565 69.75 20.9961C69.8385 20.7331 69.9661 20.5052 70.1328 20.3125C70.2995 20.1172 70.5013 19.9661 70.7383 19.8594C70.9753 19.75 71.2409 19.6953 71.5352 19.6953C71.832 19.6953 72.099 19.75 72.3359 19.8594C72.5755 19.9661 72.7786 20.1172 72.9453 20.3125C73.1146 20.5052 73.2435 20.7331 73.332 20.9961C73.4206 21.2565 73.4648 21.5391 73.4648 21.8438V21.9336C73.4648 22.2383 73.4206 22.5208 73.332 22.7812C73.2435 23.0417 73.1146 23.2695 72.9453 23.4648C72.7786 23.6576 72.5768 23.8086 72.3398 23.918C72.1055 24.0247 71.8398 24.0781 71.543 24.0781C71.2461 24.0781 70.9792 24.0247 70.7422 23.918C70.5052 23.8086 70.3021 23.6576 70.1328 23.4648C69.9661 23.2695 69.8385 23.0417 69.75 22.7812C69.6615 22.5208 69.6172 22.2383 69.6172 21.9336ZM70.3398 21.8438V21.9336C70.3398 22.1445 70.3646 22.3438 70.4141 22.5312C70.4635 22.7161 70.5378 22.8802 70.6367 23.0234C70.7383 23.1667 70.8646 23.2799 71.0156 23.3633C71.1667 23.444 71.3424 23.4844 71.543 23.4844C71.7409 23.4844 71.9141 23.444 72.0625 23.3633C72.2135 23.2799 72.3385 23.1667 72.4375 23.0234C72.5365 22.8802 72.6107 22.7161 72.6602 22.5312C72.7122 22.3438 72.7383 22.1445 72.7383 21.9336V21.8438C72.7383 21.6354 72.7122 21.4388 72.6602 21.2539C72.6107 21.0664 72.5352 20.901 72.4336 20.7578C72.3346 20.612 72.2096 20.4974 72.0586 20.4141C71.9102 20.3307 71.7357 20.2891 71.5352 20.2891C71.3372 20.2891 71.1628 20.3307 71.0117 20.4141C70.8633 20.4974 70.7383 20.612 70.6367 20.7578C70.5378 20.901 70.4635 21.0664 70.4141 21.2539C70.3646 21.4388 70.3398 21.6354 70.3398 21.8438ZM76.957 23.0234V19.7734H77.6836V24H76.9922L76.957 23.0234ZM77.0938 22.1328L77.3945 22.125C77.3945 22.4062 77.3646 22.6667 77.3047 22.9062C77.2474 23.1432 77.1536 23.349 77.0234 23.5234C76.8932 23.6979 76.7227 23.8346 76.5117 23.9336C76.3008 24.0299 76.0443 24.0781 75.7422 24.0781C75.5365 24.0781 75.3477 24.0482 75.1758 23.9883C75.0065 23.9284 74.8607 23.8359 74.7383 23.7109C74.6159 23.5859 74.5208 23.4232 74.4531 23.2227C74.388 23.0221 74.3555 22.7812 74.3555 22.5V19.7734H75.0781V22.5078C75.0781 22.6979 75.099 22.8555 75.1406 22.9805C75.1849 23.1029 75.2435 23.2005 75.3164 23.2734C75.3919 23.3438 75.4753 23.3932 75.5664 23.4219C75.6602 23.4505 75.7565 23.4648 75.8555 23.4648C76.1628 23.4648 76.4062 23.4062 76.5859 23.2891C76.7656 23.1693 76.8945 23.0091 76.9727 22.8086C77.0534 22.6055 77.0938 22.3802 77.0938 22.1328ZM80.5547 19.7734V20.3281H78.2695V19.7734H80.5547ZM79.043 18.7461H79.7656V22.9531C79.7656 23.0964 79.7878 23.2044 79.832 23.2773C79.8763 23.3503 79.9336 23.3984 80.0039 23.4219C80.0742 23.4453 80.1497 23.457 80.2305 23.457C80.2904 23.457 80.3529 23.4518 80.418 23.4414C80.4857 23.4284 80.5365 23.418 80.5703 23.4102L80.5742 24C80.5169 24.0182 80.4414 24.0352 80.3477 24.0508C80.2565 24.069 80.1458 24.0781 80.0156 24.0781C79.8385 24.0781 79.6758 24.043 79.5273 23.9727C79.3789 23.9023 79.2604 23.7852 79.1719 23.6211C79.0859 23.4544 79.043 23.2305 79.043 22.9492V18.7461ZM85.1562 19.7734V20.3281H82.8711V19.7734H85.1562ZM83.6445 18.7461H84.3672V22.9531C84.3672 23.0964 84.3893 23.2044 84.4336 23.2773C84.4779 23.3503 84.5352 23.3984 84.6055 23.4219C84.6758 23.4453 84.7513 23.457 84.832 23.457C84.8919 23.457 84.9544 23.4518 85.0195 23.4414C85.0872 23.4284 85.138 23.418 85.1719 23.4102L85.1758 24C85.1185 24.0182 85.043 24.0352 84.9492 24.0508C84.8581 24.069 84.7474 24.0781 84.6172 24.0781C84.4401 24.0781 84.2773 24.043 84.1289 23.9727C83.9805 23.9023 83.862 23.7852 83.7734 23.6211C83.6875 23.4544 83.6445 23.2305 83.6445 22.9492V18.7461ZM86.7266 18V24H86.0039V18H86.7266ZM86.5547 21.7266L86.2539 21.7148C86.2565 21.4258 86.2995 21.1589 86.3828 20.9141C86.4661 20.6667 86.5833 20.4518 86.7344 20.2695C86.8854 20.0872 87.0651 19.9466 87.2734 19.8477C87.4844 19.7461 87.7174 19.6953 87.9727 19.6953C88.181 19.6953 88.3685 19.724 88.5352 19.7812C88.7018 19.8359 88.8438 19.9245 88.9609 20.0469C89.0807 20.1693 89.1719 20.3281 89.2344 20.5234C89.2969 20.7161 89.3281 20.9518 89.3281 21.2305V24H88.6016V21.2227C88.6016 21.0013 88.569 20.8242 88.5039 20.6914C88.4388 20.556 88.3438 20.4583 88.2188 20.3984C88.0938 20.3359 87.9401 20.3047 87.7578 20.3047C87.5781 20.3047 87.4141 20.3424 87.2656 20.418C87.1198 20.4935 86.9935 20.5977 86.8867 20.7305C86.7826 20.8633 86.7005 21.0156 86.6406 21.1875C86.5833 21.3568 86.5547 21.5365 86.5547 21.7266ZM92.1641 24.0781C91.8698 24.0781 91.6029 24.0286 91.3633 23.9297C91.1263 23.8281 90.9219 23.6862 90.75 23.5039C90.5807 23.3216 90.4505 23.1055 90.3594 22.8555C90.2682 22.6055 90.2227 22.332 90.2227 22.0352V21.8711C90.2227 21.5273 90.2734 21.2214 90.375 20.9531C90.4766 20.6823 90.6146 20.4531 90.7891 20.2656C90.9635 20.0781 91.1615 19.9362 91.3828 19.8398C91.6042 19.7435 91.8333 19.6953 92.0703 19.6953C92.3724 19.6953 92.6328 19.7474 92.8516 19.8516C93.0729 19.9557 93.2539 20.1016 93.3945 20.2891C93.5352 20.474 93.6393 20.6927 93.707 20.9453C93.7747 21.1953 93.8086 21.4688 93.8086 21.7656V22.0898H90.6523V21.5H93.0859V21.4453C93.0755 21.2578 93.0365 21.0755 92.9688 20.8984C92.9036 20.7214 92.7995 20.5755 92.6562 20.4609C92.513 20.3464 92.3177 20.2891 92.0703 20.2891C91.9062 20.2891 91.7552 20.3242 91.6172 20.3945C91.4792 20.4622 91.3607 20.5638 91.2617 20.6992C91.1628 20.8346 91.0859 21 91.0312 21.1953C90.9766 21.3906 90.9492 21.6159 90.9492 21.8711V22.0352C90.9492 22.2357 90.9766 22.4245 91.0312 22.6016C91.0885 22.776 91.1706 22.9297 91.2773 23.0625C91.3867 23.1953 91.5182 23.2995 91.6719 23.375C91.8281 23.4505 92.0052 23.4883 92.2031 23.4883C92.4583 23.4883 92.6745 23.4362 92.8516 23.332C93.0286 23.2279 93.1836 23.0885 93.3164 22.9141L93.7539 23.2617C93.6628 23.3997 93.5469 23.5312 93.4062 23.6562C93.2656 23.7812 93.0924 23.8828 92.8867 23.9609C92.6836 24.0391 92.4427 24.0781 92.1641 24.0781ZM97.7148 24H96.9922V19.3281C96.9922 19.0234 97.0469 18.7669 97.1562 18.5586C97.2682 18.3477 97.4284 18.1888 97.6367 18.082C97.8451 17.9727 98.0924 17.918 98.3789 17.918C98.4622 17.918 98.5456 17.9232 98.6289 17.9336C98.7148 17.944 98.7982 17.9596 98.8789 17.9805L98.8398 18.5703C98.7852 18.5573 98.7227 18.5482 98.6523 18.543C98.5846 18.5378 98.5169 18.5352 98.4492 18.5352C98.2956 18.5352 98.1628 18.5664 98.0508 18.6289C97.9414 18.6888 97.8581 18.7773 97.8008 18.8945C97.7435 19.0117 97.7148 19.1562 97.7148 19.3281V24ZM98.6133 19.7734V20.3281H96.3242V19.7734H98.6133ZM99.2266 21.9336V21.8438C99.2266 21.5391 99.2708 21.2565 99.3594 20.9961C99.4479 20.7331 99.5755 20.5052 99.7422 20.3125C99.9089 20.1172 100.111 19.9661 100.348 19.8594C100.585 19.75 100.85 19.6953 101.145 19.6953C101.441 19.6953 101.708 19.75 101.945 19.8594C102.185 19.9661 102.388 20.1172 102.555 20.3125C102.724 20.5052 102.853 20.7331 102.941 20.9961C103.03 21.2565 103.074 21.5391 103.074 21.8438V21.9336C103.074 22.2383 103.03 22.5208 102.941 22.7812C102.853 23.0417 102.724 23.2695 102.555 23.4648C102.388 23.6576 102.186 23.8086 101.949 23.918C101.715 24.0247 101.449 24.0781 101.152 24.0781C100.855 24.0781 100.589 24.0247 100.352 23.918C100.115 23.8086 99.9115 23.6576 99.7422 23.4648C99.5755 23.2695 99.4479 23.0417 99.3594 22.7812C99.2708 22.5208 99.2266 22.2383 99.2266 21.9336ZM99.9492 21.8438V21.9336C99.9492 22.1445 99.974 22.3438 100.023 22.5312C100.073 22.7161 100.147 22.8802 100.246 23.0234C100.348 23.1667 100.474 23.2799 100.625 23.3633C100.776 23.444 100.952 23.4844 101.152 23.4844C101.35 23.4844 101.523 23.444 101.672 23.3633C101.823 23.2799 101.948 23.1667 102.047 23.0234C102.146 22.8802 102.22 22.7161 102.27 22.5312C102.322 22.3438 102.348 22.1445 102.348 21.9336V21.8438C102.348 21.6354 102.322 21.4388 102.27 21.2539C102.22 21.0664 102.145 20.901 102.043 20.7578C101.944 20.612 101.819 20.4974 101.668 20.4141C101.52 20.3307 101.345 20.2891 101.145 20.2891C100.947 20.2891 100.772 20.3307 100.621 20.4141C100.473 20.4974 100.348 20.612 100.246 20.7578C100.147 20.901 100.073 21.0664 100.023 21.2539C99.974 21.4388 99.9492 21.6354 99.9492 21.8438ZM104.703 20.4375V24H103.98V19.7734H104.684L104.703 20.4375ZM106.023 19.75L106.02 20.4219C105.96 20.4089 105.902 20.401 105.848 20.3984C105.796 20.3932 105.736 20.3906 105.668 20.3906C105.501 20.3906 105.354 20.4167 105.227 20.4688C105.099 20.5208 104.991 20.5938 104.902 20.6875C104.814 20.7812 104.743 20.8932 104.691 21.0234C104.642 21.151 104.609 21.2917 104.594 21.4453L104.391 21.5625C104.391 21.3073 104.415 21.0677 104.465 20.8438C104.517 20.6198 104.596 20.4219 104.703 20.25C104.81 20.0755 104.945 19.9401 105.109 19.8438C105.276 19.7448 105.474 19.6953 105.703 19.6953C105.755 19.6953 105.815 19.7018 105.883 19.7148C105.951 19.7253 105.997 19.737 106.023 19.75ZM107.41 20.6133V24H106.684V19.7734H107.371L107.41 20.6133ZM107.262 21.7266L106.926 21.7148C106.928 21.4258 106.966 21.1589 107.039 20.9141C107.112 20.6667 107.22 20.4518 107.363 20.2695C107.507 20.0872 107.685 19.9466 107.898 19.8477C108.112 19.7461 108.359 19.6953 108.641 19.6953C108.839 19.6953 109.021 19.724 109.188 19.7812C109.354 19.8359 109.499 19.9232 109.621 20.043C109.743 20.1628 109.839 20.3164 109.906 20.5039C109.974 20.6914 110.008 20.918 110.008 21.1836V24H109.285V21.2188C109.285 20.9974 109.247 20.8203 109.172 20.6875C109.099 20.5547 108.995 20.4583 108.859 20.3984C108.724 20.3359 108.565 20.3047 108.383 20.3047C108.169 20.3047 107.991 20.3424 107.848 20.418C107.704 20.4935 107.59 20.5977 107.504 20.7305C107.418 20.8633 107.355 21.0156 107.316 21.1875C107.28 21.3568 107.262 21.5365 107.262 21.7266ZM110 21.3281L109.516 21.4766C109.518 21.2448 109.556 21.0221 109.629 20.8086C109.704 20.5951 109.812 20.4049 109.953 20.2383C110.096 20.0716 110.272 19.9401 110.48 19.8438C110.689 19.7448 110.927 19.6953 111.195 19.6953C111.422 19.6953 111.622 19.7253 111.797 19.7852C111.974 19.8451 112.122 19.9375 112.242 20.0625C112.365 20.1849 112.457 20.3424 112.52 20.5352C112.582 20.7279 112.613 20.957 112.613 21.2227V24H111.887V21.2148C111.887 20.9779 111.849 20.7943 111.773 20.6641C111.701 20.5312 111.596 20.4388 111.461 20.3867C111.328 20.332 111.169 20.3047 110.984 20.3047C110.826 20.3047 110.685 20.332 110.562 20.3867C110.44 20.4414 110.337 20.5169 110.254 20.6133C110.171 20.707 110.107 20.8151 110.062 20.9375C110.021 21.0599 110 21.1901 110 21.3281ZM116.168 22.8789C116.168 22.7747 116.145 22.6784 116.098 22.5898C116.053 22.4987 115.961 22.4167 115.82 22.3438C115.682 22.2682 115.474 22.2031 115.195 22.1484C114.961 22.099 114.749 22.0404 114.559 21.9727C114.371 21.9049 114.211 21.8229 114.078 21.7266C113.948 21.6302 113.848 21.5169 113.777 21.3867C113.707 21.2565 113.672 21.1042 113.672 20.9297C113.672 20.763 113.708 20.6055 113.781 20.457C113.857 20.3086 113.962 20.1771 114.098 20.0625C114.236 19.9479 114.401 19.8581 114.594 19.793C114.786 19.7279 115.001 19.6953 115.238 19.6953C115.577 19.6953 115.866 19.7552 116.105 19.875C116.345 19.9948 116.529 20.1549 116.656 20.3555C116.784 20.5534 116.848 20.7734 116.848 21.0156H116.125C116.125 20.8984 116.09 20.7852 116.02 20.6758C115.952 20.5638 115.852 20.4714 115.719 20.3984C115.589 20.3255 115.428 20.2891 115.238 20.2891C115.038 20.2891 114.875 20.3203 114.75 20.3828C114.628 20.4427 114.538 20.5195 114.48 20.6133C114.426 20.707 114.398 20.806 114.398 20.9102C114.398 20.9883 114.411 21.0586 114.438 21.1211C114.466 21.181 114.516 21.237 114.586 21.2891C114.656 21.3385 114.755 21.3854 114.883 21.4297C115.01 21.474 115.173 21.5182 115.371 21.5625C115.717 21.6406 116.003 21.7344 116.227 21.8438C116.451 21.9531 116.617 22.0872 116.727 22.2461C116.836 22.4049 116.891 22.5977 116.891 22.8242C116.891 23.0091 116.852 23.1784 116.773 23.332C116.698 23.4857 116.587 23.6185 116.441 23.7305C116.298 23.8398 116.126 23.9258 115.926 23.9883C115.728 24.0482 115.505 24.0781 115.258 24.0781C114.885 24.0781 114.57 24.0117 114.312 23.8789C114.055 23.7461 113.859 23.5742 113.727 23.3633C113.594 23.1523 113.527 22.9297 113.527 22.6953H114.254C114.264 22.8932 114.322 23.0508 114.426 23.168C114.53 23.2826 114.658 23.3646 114.809 23.4141C114.96 23.4609 115.109 23.4844 115.258 23.4844C115.456 23.4844 115.621 23.4583 115.754 23.4062C115.889 23.3542 115.992 23.2826 116.062 23.1914C116.133 23.1003 116.168 22.9961 116.168 22.8789ZM119.82 18H120.547V23.1797L120.484 24H119.82V18ZM123.402 21.8516V21.9336C123.402 22.2409 123.366 22.526 123.293 22.7891C123.22 23.0495 123.113 23.276 122.973 23.4688C122.832 23.6615 122.66 23.8112 122.457 23.918C122.254 24.0247 122.021 24.0781 121.758 24.0781C121.49 24.0781 121.254 24.0326 121.051 23.9414C120.85 23.8477 120.681 23.7135 120.543 23.5391C120.405 23.3646 120.294 23.1536 120.211 22.9062C120.13 22.6589 120.074 22.3802 120.043 22.0703V21.7109C120.074 21.3984 120.13 21.1185 120.211 20.8711C120.294 20.6237 120.405 20.4128 120.543 20.2383C120.681 20.0612 120.85 19.9271 121.051 19.8359C121.251 19.7422 121.484 19.6953 121.75 19.6953C122.016 19.6953 122.251 19.7474 122.457 19.8516C122.663 19.9531 122.835 20.099 122.973 20.2891C123.113 20.4792 123.22 20.707 123.293 20.9727C123.366 21.2357 123.402 21.5286 123.402 21.8516ZM122.676 21.9336V21.8516C122.676 21.6406 122.656 21.4427 122.617 21.2578C122.578 21.0703 122.516 20.9062 122.43 20.7656C122.344 20.6224 122.23 20.5104 122.09 20.4297C121.949 20.3464 121.776 20.3047 121.57 20.3047C121.388 20.3047 121.229 20.3359 121.094 20.3984C120.961 20.4609 120.848 20.5456 120.754 20.6523C120.66 20.7565 120.583 20.8763 120.523 21.0117C120.466 21.1445 120.423 21.2826 120.395 21.4258V22.3672C120.436 22.5495 120.504 22.7253 120.598 22.8945C120.694 23.0612 120.822 23.1979 120.98 23.3047C121.142 23.4115 121.341 23.4648 121.578 23.4648C121.773 23.4648 121.94 23.4258 122.078 23.3477C122.219 23.2669 122.332 23.1562 122.418 23.0156C122.507 22.875 122.572 22.7122 122.613 22.5273C122.655 22.3424 122.676 22.1445 122.676 21.9336ZM126.07 24.0781C125.776 24.0781 125.509 24.0286 125.27 23.9297C125.033 23.8281 124.828 23.6862 124.656 23.5039C124.487 23.3216 124.357 23.1055 124.266 22.8555C124.174 22.6055 124.129 22.332 124.129 22.0352V21.8711C124.129 21.5273 124.18 21.2214 124.281 20.9531C124.383 20.6823 124.521 20.4531 124.695 20.2656C124.87 20.0781 125.068 19.9362 125.289 19.8398C125.51 19.7435 125.74 19.6953 125.977 19.6953C126.279 19.6953 126.539 19.7474 126.758 19.8516C126.979 19.9557 127.16 20.1016 127.301 20.2891C127.441 20.474 127.546 20.6927 127.613 20.9453C127.681 21.1953 127.715 21.4688 127.715 21.7656V22.0898H124.559V21.5H126.992V21.4453C126.982 21.2578 126.943 21.0755 126.875 20.8984C126.81 20.7214 126.706 20.5755 126.562 20.4609C126.419 20.3464 126.224 20.2891 125.977 20.2891C125.812 20.2891 125.661 20.3242 125.523 20.3945C125.385 20.4622 125.267 20.5638 125.168 20.6992C125.069 20.8346 124.992 21 124.938 21.1953C124.883 21.3906 124.855 21.6159 124.855 21.8711V22.0352C124.855 22.2357 124.883 22.4245 124.938 22.6016C124.995 22.776 125.077 22.9297 125.184 23.0625C125.293 23.1953 125.424 23.2995 125.578 23.375C125.734 23.4505 125.911 23.4883 126.109 23.4883C126.365 23.4883 126.581 23.4362 126.758 23.332C126.935 23.2279 127.09 23.0885 127.223 22.9141L127.66 23.2617C127.569 23.3997 127.453 23.5312 127.312 23.6562C127.172 23.7812 126.999 23.8828 126.793 23.9609C126.59 24.0391 126.349 24.0781 126.07 24.0781ZM129.344 18V24H128.617V18H129.344ZM130.312 21.9336V21.8438C130.312 21.5391 130.357 21.2565 130.445 20.9961C130.534 20.7331 130.661 20.5052 130.828 20.3125C130.995 20.1172 131.197 19.9661 131.434 19.8594C131.671 19.75 131.936 19.6953 132.23 19.6953C132.527 19.6953 132.794 19.75 133.031 19.8594C133.271 19.9661 133.474 20.1172 133.641 20.3125C133.81 20.5052 133.939 20.7331 134.027 20.9961C134.116 21.2565 134.16 21.5391 134.16 21.8438V21.9336C134.16 22.2383 134.116 22.5208 134.027 22.7812C133.939 23.0417 133.81 23.2695 133.641 23.4648C133.474 23.6576 133.272 23.8086 133.035 23.918C132.801 24.0247 132.535 24.0781 132.238 24.0781C131.941 24.0781 131.674 24.0247 131.438 23.918C131.201 23.8086 130.997 23.6576 130.828 23.4648C130.661 23.2695 130.534 23.0417 130.445 22.7812C130.357 22.5208 130.312 22.2383 130.312 21.9336ZM131.035 21.8438V21.9336C131.035 22.1445 131.06 22.3438 131.109 22.5312C131.159 22.7161 131.233 22.8802 131.332 23.0234C131.434 23.1667 131.56 23.2799 131.711 23.3633C131.862 23.444 132.038 23.4844 132.238 23.4844C132.436 23.4844 132.609 23.444 132.758 23.3633C132.909 23.2799 133.034 23.1667 133.133 23.0234C133.232 22.8802 133.306 22.7161 133.355 22.5312C133.408 22.3438 133.434 22.1445 133.434 21.9336V21.8438C133.434 21.6354 133.408 21.4388 133.355 21.2539C133.306 21.0664 133.23 20.901 133.129 20.7578C133.03 20.612 132.905 20.4974 132.754 20.4141C132.605 20.3307 132.431 20.2891 132.23 20.2891C132.033 20.2891 131.858 20.3307 131.707 20.4141C131.559 20.4974 131.434 20.612 131.332 20.7578C131.233 20.901 131.159 21.0664 131.109 21.2539C131.06 21.4388 131.035 21.6354 131.035 21.8438ZM136.137 23.25L137.223 19.7734H137.699L137.605 20.4648L136.5 24H136.035L136.137 23.25ZM135.406 19.7734L136.332 23.2891L136.398 24H135.91L134.684 19.7734H135.406ZM138.738 23.2617L139.621 19.7734H140.34L139.113 24H138.629L138.738 23.2617ZM137.805 19.7734L138.867 23.1914L138.988 24H138.527L137.391 20.457L137.297 19.7734H137.805ZM141.941 18.3125L141.891 22.3945H141.238L141.184 18.3125H141.941ZM141.16 23.6367C141.16 23.5195 141.195 23.4206 141.266 23.3398C141.339 23.2591 141.445 23.2188 141.586 23.2188C141.724 23.2188 141.829 23.2591 141.902 23.3398C141.978 23.4206 142.016 23.5195 142.016 23.6367C142.016 23.7487 141.978 23.8451 141.902 23.9258C141.829 24.0065 141.724 24.0469 141.586 24.0469C141.445 24.0469 141.339 24.0065 141.266 23.9258C141.195 23.8451 141.16 23.7487 141.16 23.6367Z" fill="#DBDEE1" fill-opacity="0.8" />
                  </svg>

                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports up to 25 different forms per message.</Text>
              </Box>
              <FormLabel fontSize={18}>Slash Command</FormLabel>
              <Box>
                <Box transition='background 0.2s' _hover={{ cursor: 'pointer', background: '#1E1F22' }} onClick={() => {
                  if (openFormType === 'application_command') setStage('applicationCommand')
                  setOpenFormType('application_command')
                }} border={openFormType === 'application_command' ? '2px solid #5865F2' : 'none'} background='#2B2D31' width='250px' height='105px' borderRadius='10px' display='flex' alignItems='center' justifyContent='center'>
                  <svg width="225" height="100" viewBox="0 0 151 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="151" height="54" rx="4" fill="#36393F" />
                    <path d="M46.6963 18.8906L43.9277 26.6104H43.0049L45.7783 18.8906H46.6963ZM50.4756 24.5693C50.4756 24.4521 50.4463 24.3464 50.3877 24.252C50.3291 24.1543 50.2168 24.0664 50.0508 23.9883C49.888 23.9102 49.6471 23.8385 49.3281 23.7734C49.0482 23.7116 48.791 23.6383 48.5566 23.5537C48.3255 23.4658 48.127 23.36 47.9609 23.2363C47.7949 23.1126 47.6663 22.9661 47.5752 22.7969C47.484 22.6276 47.4385 22.4323 47.4385 22.2109C47.4385 21.9961 47.4857 21.7926 47.5801 21.6006C47.6745 21.4085 47.8096 21.2393 47.9854 21.0928C48.1611 20.9463 48.3743 20.8307 48.625 20.7461C48.8789 20.6615 49.1621 20.6191 49.4746 20.6191C49.9173 20.6191 50.2965 20.694 50.6123 20.8438C50.9313 20.9902 51.1755 21.1904 51.3447 21.4443C51.514 21.695 51.5986 21.9782 51.5986 22.2939H50.4219C50.4219 22.154 50.3861 22.0238 50.3145 21.9033C50.2461 21.7796 50.1419 21.6803 50.002 21.6055C49.862 21.5273 49.6862 21.4883 49.4746 21.4883C49.2728 21.4883 49.1051 21.5208 48.9717 21.5859C48.8415 21.6478 48.7438 21.7292 48.6787 21.8301C48.6169 21.931 48.5859 22.0417 48.5859 22.1621C48.5859 22.25 48.6022 22.3298 48.6348 22.4014C48.6706 22.4697 48.7292 22.5332 48.8105 22.5918C48.8919 22.6471 49.0026 22.6992 49.1426 22.748C49.2858 22.7969 49.4648 22.8441 49.6797 22.8896C50.0833 22.9743 50.43 23.0833 50.7197 23.2168C51.0127 23.347 51.2373 23.5163 51.3936 23.7246C51.5498 23.9297 51.6279 24.1901 51.6279 24.5059C51.6279 24.7402 51.5775 24.9551 51.4766 25.1504C51.3789 25.3424 51.2357 25.5101 51.0469 25.6533C50.8581 25.7933 50.6318 25.9023 50.3682 25.9805C50.1077 26.0586 49.8148 26.0977 49.4893 26.0977C49.0107 26.0977 48.6055 26.013 48.2734 25.8438C47.9414 25.6712 47.6891 25.4515 47.5166 25.1846C47.3473 24.9144 47.2627 24.6344 47.2627 24.3447H48.4004C48.4134 24.5628 48.4736 24.737 48.5811 24.8672C48.6917 24.9941 48.8285 25.0869 48.9912 25.1455C49.1572 25.2008 49.3281 25.2285 49.5039 25.2285C49.7155 25.2285 49.8929 25.2008 50.0361 25.1455C50.1794 25.0869 50.2884 25.0088 50.3633 24.9111C50.4382 24.8102 50.4756 24.6963 50.4756 24.5693ZM55.8369 24.7549V20.7168H57.0186V26H55.9053L55.8369 24.7549ZM56.0029 23.6562L56.3984 23.6465C56.3984 24.0013 56.3594 24.3285 56.2812 24.6279C56.2031 24.9242 56.0827 25.1829 55.9199 25.4043C55.7572 25.6224 55.5488 25.7933 55.2949 25.917C55.041 26.0374 54.7367 26.0977 54.3818 26.0977C54.1247 26.0977 53.8887 26.0602 53.6738 25.9854C53.459 25.9105 53.2734 25.7949 53.1172 25.6387C52.9642 25.4824 52.8454 25.279 52.7607 25.0283C52.6761 24.7777 52.6338 24.4782 52.6338 24.1299V20.7168H53.8105V24.1396C53.8105 24.3317 53.8333 24.4928 53.8789 24.623C53.9245 24.75 53.9863 24.8525 54.0645 24.9307C54.1426 25.0088 54.2337 25.0641 54.3379 25.0967C54.4421 25.1292 54.5527 25.1455 54.6699 25.1455C55.0052 25.1455 55.2689 25.0804 55.4609 24.9502C55.6562 24.8167 55.7946 24.6377 55.876 24.4131C55.9606 24.1885 56.0029 23.9362 56.0029 23.6562ZM61.6084 20.7168H62.6777V25.8535C62.6777 26.3288 62.5768 26.7324 62.375 27.0645C62.1732 27.3965 61.8916 27.6488 61.5303 27.8213C61.1689 27.9971 60.7507 28.085 60.2754 28.085C60.0736 28.085 59.849 28.0557 59.6016 27.9971C59.3574 27.9385 59.1198 27.8441 58.8887 27.7139C58.6608 27.5869 58.4704 27.4193 58.3174 27.2109L58.8691 26.5176C59.0579 26.7422 59.2663 26.9066 59.4941 27.0107C59.722 27.1149 59.9613 27.167 60.2119 27.167C60.4821 27.167 60.7116 27.1165 60.9004 27.0156C61.0924 26.918 61.2406 26.7731 61.3447 26.5811C61.4489 26.389 61.501 26.1546 61.501 25.8779V21.9131L61.6084 20.7168ZM58.0195 23.417V23.3145C58.0195 22.9141 58.0684 22.5495 58.166 22.2207C58.2637 21.8887 58.4036 21.6038 58.5859 21.3662C58.7682 21.1253 58.9896 20.9414 59.25 20.8145C59.5104 20.6842 59.805 20.6191 60.1338 20.6191C60.4756 20.6191 60.7669 20.681 61.0078 20.8047C61.252 20.9284 61.4554 21.1058 61.6182 21.3369C61.7809 21.5648 61.9079 21.8382 61.999 22.1572C62.0934 22.473 62.1634 22.8245 62.209 23.2119V23.5391C62.1667 23.9167 62.0951 24.2617 61.9941 24.5742C61.8932 24.8867 61.7598 25.1569 61.5938 25.3848C61.4277 25.6126 61.2227 25.7884 60.9785 25.9121C60.7376 26.0358 60.4528 26.0977 60.124 26.0977C59.8018 26.0977 59.5104 26.0309 59.25 25.8975C58.9928 25.764 58.7715 25.5768 58.5859 25.3359C58.4036 25.0951 58.2637 24.8118 58.166 24.4863C58.0684 24.1576 58.0195 23.8011 58.0195 23.417ZM59.1963 23.3145V23.417C59.1963 23.6579 59.2191 23.8825 59.2646 24.0908C59.3135 24.2992 59.3867 24.4831 59.4844 24.6426C59.5853 24.7988 59.7122 24.9225 59.8652 25.0137C60.0215 25.1016 60.2054 25.1455 60.417 25.1455C60.6937 25.1455 60.9199 25.0869 61.0957 24.9697C61.2747 24.8525 61.4115 24.6947 61.5059 24.4961C61.6035 24.2943 61.6719 24.0697 61.7109 23.8223V22.9385C61.6914 22.7464 61.6507 22.5674 61.5889 22.4014C61.5303 22.2354 61.4505 22.0905 61.3496 21.9668C61.2487 21.8398 61.1217 21.7422 60.9688 21.6738C60.8158 21.6022 60.6351 21.5664 60.4268 21.5664C60.2152 21.5664 60.0312 21.612 59.875 21.7031C59.7188 21.7943 59.5902 21.9196 59.4893 22.0791C59.3916 22.2386 59.3184 22.4242 59.2695 22.6357C59.2207 22.8473 59.1963 23.0736 59.1963 23.3145ZM67.2822 20.7168H68.3516V25.8535C68.3516 26.3288 68.2507 26.7324 68.0488 27.0645C67.847 27.3965 67.5654 27.6488 67.2041 27.8213C66.8428 27.9971 66.4245 28.085 65.9492 28.085C65.7474 28.085 65.5228 28.0557 65.2754 27.9971C65.0312 27.9385 64.7936 27.8441 64.5625 27.7139C64.3346 27.5869 64.1442 27.4193 63.9912 27.2109L64.543 26.5176C64.7318 26.7422 64.9401 26.9066 65.168 27.0107C65.3958 27.1149 65.6351 27.167 65.8857 27.167C66.1559 27.167 66.3854 27.1165 66.5742 27.0156C66.7663 26.918 66.9144 26.7731 67.0186 26.5811C67.1227 26.389 67.1748 26.1546 67.1748 25.8779V21.9131L67.2822 20.7168ZM63.6934 23.417V23.3145C63.6934 22.9141 63.7422 22.5495 63.8398 22.2207C63.9375 21.8887 64.0775 21.6038 64.2598 21.3662C64.4421 21.1253 64.6634 20.9414 64.9238 20.8145C65.1842 20.6842 65.4788 20.6191 65.8076 20.6191C66.1494 20.6191 66.4408 20.681 66.6816 20.8047C66.9258 20.9284 67.1292 21.1058 67.292 21.3369C67.4548 21.5648 67.5817 21.8382 67.6729 22.1572C67.7673 22.473 67.8372 22.8245 67.8828 23.2119V23.5391C67.8405 23.9167 67.7689 24.2617 67.668 24.5742C67.5671 24.8867 67.4336 25.1569 67.2676 25.3848C67.1016 25.6126 66.8965 25.7884 66.6523 25.9121C66.4115 26.0358 66.1266 26.0977 65.7979 26.0977C65.4756 26.0977 65.1842 26.0309 64.9238 25.8975C64.6667 25.764 64.4453 25.5768 64.2598 25.3359C64.0775 25.0951 63.9375 24.8118 63.8398 24.4863C63.7422 24.1576 63.6934 23.8011 63.6934 23.417ZM64.8701 23.3145V23.417C64.8701 23.6579 64.8929 23.8825 64.9385 24.0908C64.9873 24.2992 65.0605 24.4831 65.1582 24.6426C65.2591 24.7988 65.3861 24.9225 65.5391 25.0137C65.6953 25.1016 65.8792 25.1455 66.0908 25.1455C66.3675 25.1455 66.5938 25.0869 66.7695 24.9697C66.9486 24.8525 67.0853 24.6947 67.1797 24.4961C67.2773 24.2943 67.3457 24.0697 67.3848 23.8223V22.9385C67.3652 22.7464 67.3245 22.5674 67.2627 22.4014C67.2041 22.2354 67.1243 22.0905 67.0234 21.9668C66.9225 21.8398 66.7956 21.7422 66.6426 21.6738C66.4896 21.6022 66.3089 21.5664 66.1006 21.5664C65.889 21.5664 65.7051 21.612 65.5488 21.7031C65.3926 21.7943 65.264 21.9196 65.1631 22.0791C65.0654 22.2386 64.9922 22.4242 64.9434 22.6357C64.8945 22.8473 64.8701 23.0736 64.8701 23.3145ZM71.9014 26.0977C71.5107 26.0977 71.1576 26.0342 70.8418 25.9072C70.5293 25.777 70.2624 25.5964 70.041 25.3652C69.8229 25.1341 69.6553 24.8623 69.5381 24.5498C69.4209 24.2373 69.3623 23.9004 69.3623 23.5391V23.3438C69.3623 22.9303 69.4225 22.556 69.543 22.2207C69.6634 21.8854 69.8311 21.599 70.0459 21.3613C70.2607 21.1204 70.5146 20.9365 70.8076 20.8096C71.1006 20.6826 71.418 20.6191 71.7598 20.6191C72.1374 20.6191 72.4678 20.6826 72.751 20.8096C73.0342 20.9365 73.2686 21.1156 73.4541 21.3467C73.6429 21.5745 73.7829 21.8464 73.874 22.1621C73.9684 22.4779 74.0156 22.8262 74.0156 23.207V23.71H69.9336V22.8652H72.8535V22.7725C72.847 22.5609 72.8047 22.3623 72.7266 22.1768C72.6517 21.9912 72.5361 21.8415 72.3799 21.7275C72.2236 21.6136 72.0153 21.5566 71.7549 21.5566C71.5596 21.5566 71.3854 21.599 71.2324 21.6836C71.0827 21.765 70.9574 21.8838 70.8564 22.04C70.7555 22.1963 70.6774 22.3851 70.6221 22.6064C70.57 22.8245 70.5439 23.0703 70.5439 23.3438V23.5391C70.5439 23.7702 70.5749 23.985 70.6367 24.1836C70.7018 24.3789 70.7962 24.5498 70.9199 24.6963C71.0436 24.8428 71.1934 24.9583 71.3691 25.043C71.5449 25.1243 71.7451 25.165 71.9697 25.165C72.2529 25.165 72.5052 25.1081 72.7266 24.9941C72.9479 24.8802 73.14 24.7191 73.3027 24.5107L73.9229 25.1113C73.8089 25.2773 73.6608 25.4368 73.4785 25.5898C73.2962 25.7396 73.0732 25.8617 72.8096 25.9561C72.5492 26.0505 72.2464 26.0977 71.9014 26.0977ZM77.8975 24.5693C77.8975 24.4521 77.8682 24.3464 77.8096 24.252C77.751 24.1543 77.6387 24.0664 77.4727 23.9883C77.3099 23.9102 77.069 23.8385 76.75 23.7734C76.4701 23.7116 76.2129 23.6383 75.9785 23.5537C75.7474 23.4658 75.5488 23.36 75.3828 23.2363C75.2168 23.1126 75.0882 22.9661 74.9971 22.7969C74.9059 22.6276 74.8604 22.4323 74.8604 22.2109C74.8604 21.9961 74.9076 21.7926 75.002 21.6006C75.0964 21.4085 75.2314 21.2393 75.4072 21.0928C75.583 20.9463 75.7962 20.8307 76.0469 20.7461C76.3008 20.6615 76.584 20.6191 76.8965 20.6191C77.3392 20.6191 77.7184 20.694 78.0342 20.8438C78.3532 20.9902 78.5973 21.1904 78.7666 21.4443C78.9359 21.695 79.0205 21.9782 79.0205 22.2939H77.8438C77.8438 22.154 77.8079 22.0238 77.7363 21.9033C77.668 21.7796 77.5638 21.6803 77.4238 21.6055C77.2839 21.5273 77.1081 21.4883 76.8965 21.4883C76.6947 21.4883 76.527 21.5208 76.3936 21.5859C76.2633 21.6478 76.1657 21.7292 76.1006 21.8301C76.0387 21.931 76.0078 22.0417 76.0078 22.1621C76.0078 22.25 76.0241 22.3298 76.0566 22.4014C76.0924 22.4697 76.151 22.5332 76.2324 22.5918C76.3138 22.6471 76.4245 22.6992 76.5645 22.748C76.7077 22.7969 76.8867 22.8441 77.1016 22.8896C77.5052 22.9743 77.8519 23.0833 78.1416 23.2168C78.4346 23.347 78.6592 23.5163 78.8154 23.7246C78.9717 23.9297 79.0498 24.1901 79.0498 24.5059C79.0498 24.7402 78.9993 24.9551 78.8984 25.1504C78.8008 25.3424 78.6576 25.5101 78.4688 25.6533C78.2799 25.7933 78.0537 25.9023 77.79 25.9805C77.5296 26.0586 77.2367 26.0977 76.9111 26.0977C76.4326 26.0977 76.0273 26.013 75.6953 25.8438C75.3633 25.6712 75.111 25.4515 74.9385 25.1846C74.7692 24.9144 74.6846 24.6344 74.6846 24.3447H75.8223C75.8353 24.5628 75.8955 24.737 76.0029 24.8672C76.1136 24.9941 76.2503 25.0869 76.4131 25.1455C76.5791 25.2008 76.75 25.2285 76.9258 25.2285C77.1374 25.2285 77.3148 25.2008 77.458 25.1455C77.6012 25.0869 77.7103 25.0088 77.7852 24.9111C77.86 24.8102 77.8975 24.6963 77.8975 24.5693ZM82.502 20.7168V21.5762H79.5234V20.7168H82.502ZM80.3828 19.4229H81.5596V24.54C81.5596 24.7028 81.5824 24.8281 81.6279 24.916C81.6768 25.0007 81.7435 25.0576 81.8281 25.0869C81.9128 25.1162 82.012 25.1309 82.126 25.1309C82.2074 25.1309 82.2855 25.126 82.3604 25.1162C82.4352 25.1064 82.4954 25.0967 82.541 25.0869L82.5459 25.9854C82.4482 26.0146 82.3343 26.0407 82.2041 26.0635C82.0771 26.0863 81.9307 26.0977 81.7646 26.0977C81.4945 26.0977 81.2552 26.0505 81.0469 25.9561C80.8385 25.8584 80.6758 25.7005 80.5586 25.4824C80.4414 25.2643 80.3828 24.9746 80.3828 24.6133V19.4229Z" fill="white" />
                    <path d="M43.6738 31.7344H44.2217L45.6191 35.2119L47.0137 31.7344H47.5645L45.8301 36H45.4023L43.6738 31.7344ZM43.4951 31.7344H43.9785L44.0576 34.3359V36H43.4951V31.7344ZM47.2568 31.7344H47.7402V36H47.1777V34.3359L47.2568 31.7344ZM50.5205 35.458V33.8262C50.5205 33.7012 50.4951 33.5928 50.4443 33.501C50.3955 33.4072 50.3213 33.335 50.2217 33.2842C50.1221 33.2334 49.999 33.208 49.8525 33.208C49.7158 33.208 49.5957 33.2314 49.4922 33.2783C49.3906 33.3252 49.3105 33.3867 49.252 33.4629C49.1953 33.5391 49.167 33.6211 49.167 33.709H48.625C48.625 33.5957 48.6543 33.4834 48.7129 33.3721C48.7715 33.2607 48.8555 33.1602 48.9648 33.0703C49.0762 32.9785 49.209 32.9062 49.3633 32.8535C49.5195 32.7988 49.6934 32.7715 49.8848 32.7715C50.1152 32.7715 50.3184 32.8105 50.4941 32.8887C50.6719 32.9668 50.8105 33.085 50.9102 33.2432C51.0117 33.3994 51.0625 33.5957 51.0625 33.832V35.3086C51.0625 35.4141 51.0713 35.5264 51.0889 35.6455C51.1084 35.7646 51.1367 35.8672 51.1738 35.9531V36H50.6084C50.5811 35.9375 50.5596 35.8545 50.5439 35.751C50.5283 35.6455 50.5205 35.5479 50.5205 35.458ZM50.6143 34.0781L50.6201 34.459H50.0723C49.918 34.459 49.7803 34.4717 49.6592 34.4971C49.5381 34.5205 49.4365 34.5566 49.3545 34.6055C49.2725 34.6543 49.21 34.7158 49.167 34.79C49.124 34.8623 49.1025 34.9473 49.1025 35.0449C49.1025 35.1445 49.125 35.2354 49.1699 35.3174C49.2148 35.3994 49.2822 35.4648 49.3721 35.5137C49.4639 35.5605 49.5762 35.584 49.709 35.584C49.875 35.584 50.0215 35.5488 50.1484 35.4785C50.2754 35.4082 50.376 35.3223 50.4502 35.2207C50.5264 35.1191 50.5674 35.0205 50.5732 34.9248L50.8047 35.1855C50.791 35.2676 50.7539 35.3584 50.6934 35.458C50.6328 35.5576 50.5518 35.6533 50.4502 35.7451C50.3506 35.835 50.2314 35.9102 50.0928 35.9707C49.9561 36.0293 49.8018 36.0586 49.6299 36.0586C49.415 36.0586 49.2266 36.0166 49.0645 35.9326C48.9043 35.8486 48.7793 35.7363 48.6895 35.5957C48.6016 35.4531 48.5576 35.2939 48.5576 35.1182C48.5576 34.9482 48.5908 34.7988 48.6572 34.6699C48.7236 34.5391 48.8193 34.4307 48.9443 34.3447C49.0693 34.2568 49.2197 34.1904 49.3955 34.1455C49.5713 34.1006 49.7676 34.0781 49.9844 34.0781H50.6143ZM52.46 31.5V36H51.915V31.5H52.46ZM54.3965 32.8301L53.0137 34.3096L52.2402 35.1123L52.1963 34.5352L52.75 33.873L53.7344 32.8301H54.3965ZM53.9014 36L52.7705 34.4883L53.0518 34.0049L54.54 36H53.9014ZM56.2129 36.0586C55.9922 36.0586 55.792 36.0215 55.6123 35.9473C55.4346 35.8711 55.2812 35.7646 55.1523 35.6279C55.0254 35.4912 54.9277 35.3291 54.8594 35.1416C54.791 34.9541 54.7568 34.749 54.7568 34.5264V34.4033C54.7568 34.1455 54.7949 33.916 54.8711 33.7148C54.9473 33.5117 55.0508 33.3398 55.1816 33.1992C55.3125 33.0586 55.4609 32.9521 55.627 32.8799C55.793 32.8076 55.9648 32.7715 56.1426 32.7715C56.3691 32.7715 56.5645 32.8105 56.7285 32.8887C56.8945 32.9668 57.0303 33.0762 57.1357 33.2168C57.2412 33.3555 57.3193 33.5195 57.3701 33.709C57.4209 33.8965 57.4463 34.1016 57.4463 34.3242V34.5674H55.0791V34.125H56.9043V34.084C56.8965 33.9434 56.8672 33.8066 56.8164 33.6738C56.7676 33.541 56.6895 33.4316 56.582 33.3457C56.4746 33.2598 56.3281 33.2168 56.1426 33.2168C56.0195 33.2168 55.9062 33.2432 55.8027 33.2959C55.6992 33.3467 55.6104 33.4229 55.5361 33.5244C55.4619 33.626 55.4043 33.75 55.3633 33.8965C55.3223 34.043 55.3018 34.2119 55.3018 34.4033V34.5264C55.3018 34.6768 55.3223 34.8184 55.3633 34.9512C55.4062 35.082 55.4678 35.1973 55.5479 35.2969C55.6299 35.3965 55.7285 35.4746 55.8438 35.5312C55.9609 35.5879 56.0938 35.6162 56.2422 35.6162C56.4336 35.6162 56.5957 35.5771 56.7285 35.499C56.8613 35.4209 56.9775 35.3164 57.0771 35.1855L57.4053 35.4463C57.3369 35.5498 57.25 35.6484 57.1445 35.7422C57.0391 35.8359 56.9092 35.9121 56.7549 35.9707C56.6025 36.0293 56.4219 36.0586 56.2129 36.0586ZM61.4365 35.458V33.8262C61.4365 33.7012 61.4111 33.5928 61.3604 33.501C61.3115 33.4072 61.2373 33.335 61.1377 33.2842C61.0381 33.2334 60.915 33.208 60.7686 33.208C60.6318 33.208 60.5117 33.2314 60.4082 33.2783C60.3066 33.3252 60.2266 33.3867 60.168 33.4629C60.1113 33.5391 60.083 33.6211 60.083 33.709H59.541C59.541 33.5957 59.5703 33.4834 59.6289 33.3721C59.6875 33.2607 59.7715 33.1602 59.8809 33.0703C59.9922 32.9785 60.125 32.9062 60.2793 32.8535C60.4355 32.7988 60.6094 32.7715 60.8008 32.7715C61.0312 32.7715 61.2344 32.8105 61.4102 32.8887C61.5879 32.9668 61.7266 33.085 61.8262 33.2432C61.9277 33.3994 61.9785 33.5957 61.9785 33.832V35.3086C61.9785 35.4141 61.9873 35.5264 62.0049 35.6455C62.0244 35.7646 62.0527 35.8672 62.0898 35.9531V36H61.5244C61.4971 35.9375 61.4756 35.8545 61.46 35.751C61.4443 35.6455 61.4365 35.5479 61.4365 35.458ZM61.5303 34.0781L61.5361 34.459H60.9883C60.834 34.459 60.6963 34.4717 60.5752 34.4971C60.4541 34.5205 60.3525 34.5566 60.2705 34.6055C60.1885 34.6543 60.126 34.7158 60.083 34.79C60.04 34.8623 60.0186 34.9473 60.0186 35.0449C60.0186 35.1445 60.041 35.2354 60.0859 35.3174C60.1309 35.3994 60.1982 35.4648 60.2881 35.5137C60.3799 35.5605 60.4922 35.584 60.625 35.584C60.791 35.584 60.9375 35.5488 61.0645 35.4785C61.1914 35.4082 61.292 35.3223 61.3662 35.2207C61.4424 35.1191 61.4834 35.0205 61.4893 34.9248L61.7207 35.1855C61.707 35.2676 61.6699 35.3584 61.6094 35.458C61.5488 35.5576 61.4678 35.6533 61.3662 35.7451C61.2666 35.835 61.1475 35.9102 61.0088 35.9707C60.8721 36.0293 60.7178 36.0586 60.5459 36.0586C60.3311 36.0586 60.1426 36.0166 59.9805 35.9326C59.8203 35.8486 59.6953 35.7363 59.6055 35.5957C59.5176 35.4531 59.4736 35.2939 59.4736 35.1182C59.4736 34.9482 59.5068 34.7988 59.5732 34.6699C59.6396 34.5391 59.7354 34.4307 59.8604 34.3447C59.9854 34.2568 60.1357 34.1904 60.3115 34.1455C60.4873 34.1006 60.6836 34.0781 60.9004 34.0781H61.5303ZM66.165 35.1592C66.165 35.0811 66.1475 35.0088 66.1123 34.9424C66.0791 34.874 66.0098 34.8125 65.9043 34.7578C65.8008 34.7012 65.6445 34.6523 65.4355 34.6113C65.2598 34.5742 65.1006 34.5303 64.958 34.4795C64.8174 34.4287 64.6973 34.3672 64.5977 34.2949C64.5 34.2227 64.4248 34.1377 64.3721 34.04C64.3193 33.9424 64.293 33.8281 64.293 33.6973C64.293 33.5723 64.3203 33.4541 64.375 33.3428C64.4316 33.2314 64.5107 33.1328 64.6123 33.0469C64.7158 32.9609 64.8398 32.8936 64.9844 32.8447C65.1289 32.7959 65.29 32.7715 65.4678 32.7715C65.7217 32.7715 65.9385 32.8164 66.1182 32.9062C66.2979 32.9961 66.4355 33.1162 66.5312 33.2666C66.627 33.415 66.6748 33.5801 66.6748 33.7617H66.1328C66.1328 33.6738 66.1064 33.5889 66.0537 33.5068C66.0029 33.4229 65.9277 33.3535 65.8281 33.2988C65.7305 33.2441 65.6104 33.2168 65.4678 33.2168C65.3174 33.2168 65.1953 33.2402 65.1016 33.2871C65.0098 33.332 64.9424 33.3896 64.8994 33.46C64.8584 33.5303 64.8379 33.6045 64.8379 33.6826C64.8379 33.7412 64.8477 33.7939 64.8672 33.8408C64.8887 33.8857 64.9258 33.9277 64.9785 33.9668C65.0312 34.0039 65.1055 34.0391 65.2012 34.0723C65.2969 34.1055 65.4189 34.1387 65.5674 34.1719C65.8271 34.2305 66.041 34.3008 66.209 34.3828C66.377 34.4648 66.502 34.5654 66.584 34.6846C66.666 34.8037 66.707 34.9482 66.707 35.1182C66.707 35.2568 66.6777 35.3838 66.6191 35.499C66.5625 35.6143 66.4795 35.7139 66.3701 35.7979C66.2627 35.8799 66.1338 35.9443 65.9834 35.9912C65.835 36.0361 65.668 36.0586 65.4824 36.0586C65.2031 36.0586 64.9668 36.0088 64.7734 35.9092C64.5801 35.8096 64.4336 35.6807 64.334 35.5225C64.2344 35.3643 64.1846 35.1973 64.1846 35.0215H64.7295C64.7373 35.1699 64.7803 35.2881 64.8584 35.376C64.9365 35.4619 65.0322 35.5234 65.1455 35.5605C65.2588 35.5957 65.3711 35.6133 65.4824 35.6133C65.6309 35.6133 65.7549 35.5938 65.8545 35.5547C65.9561 35.5156 66.0332 35.4619 66.0859 35.3936C66.1387 35.3252 66.165 35.2471 66.165 35.1592ZM68.7344 36.0586C68.5137 36.0586 68.3135 36.0215 68.1338 35.9473C67.9561 35.8711 67.8027 35.7646 67.6738 35.6279C67.5469 35.4912 67.4492 35.3291 67.3809 35.1416C67.3125 34.9541 67.2783 34.749 67.2783 34.5264V34.4033C67.2783 34.1455 67.3164 33.916 67.3926 33.7148C67.4688 33.5117 67.5723 33.3398 67.7031 33.1992C67.834 33.0586 67.9824 32.9521 68.1484 32.8799C68.3145 32.8076 68.4863 32.7715 68.6641 32.7715C68.8906 32.7715 69.0859 32.8105 69.25 32.8887C69.416 32.9668 69.5518 33.0762 69.6572 33.2168C69.7627 33.3555 69.8408 33.5195 69.8916 33.709C69.9424 33.8965 69.9678 34.1016 69.9678 34.3242V34.5674H67.6006V34.125H69.4258V34.084C69.418 33.9434 69.3887 33.8066 69.3379 33.6738C69.2891 33.541 69.2109 33.4316 69.1035 33.3457C68.9961 33.2598 68.8496 33.2168 68.6641 33.2168C68.541 33.2168 68.4277 33.2432 68.3242 33.2959C68.2207 33.3467 68.1318 33.4229 68.0576 33.5244C67.9834 33.626 67.9258 33.75 67.8848 33.8965C67.8438 34.043 67.8232 34.2119 67.8232 34.4033V34.5264C67.8232 34.6768 67.8438 34.8184 67.8848 34.9512C67.9277 35.082 67.9893 35.1973 68.0693 35.2969C68.1514 35.3965 68.25 35.4746 68.3652 35.5312C68.4824 35.5879 68.6152 35.6162 68.7637 35.6162C68.9551 35.6162 69.1172 35.5771 69.25 35.499C69.3828 35.4209 69.499 35.3164 69.5986 35.1855L69.9268 35.4463C69.8584 35.5498 69.7715 35.6484 69.666 35.7422C69.5605 35.8359 69.4307 35.9121 69.2764 35.9707C69.124 36.0293 68.9434 36.0586 68.7344 36.0586ZM71.1426 33.3281V36H70.6006V32.8301H71.1279L71.1426 33.3281ZM72.1328 32.8125L72.1299 33.3164C72.085 33.3066 72.042 33.3008 72.001 33.2988C71.9619 33.2949 71.917 33.293 71.8662 33.293C71.7412 33.293 71.6309 33.3125 71.5352 33.3516C71.4395 33.3906 71.3584 33.4453 71.292 33.5156C71.2256 33.5859 71.1729 33.6699 71.1338 33.7676C71.0967 33.8633 71.0723 33.9688 71.0605 34.084L70.9082 34.1719C70.9082 33.9805 70.9268 33.8008 70.9639 33.6328C71.0029 33.4648 71.0625 33.3164 71.1426 33.1875C71.2227 33.0566 71.3242 32.9551 71.4473 32.8828C71.5723 32.8086 71.7207 32.7715 71.8926 32.7715C71.9316 32.7715 71.9766 32.7764 72.0273 32.7861C72.0781 32.7939 72.1133 32.8027 72.1328 32.8125ZM73.6504 35.5107L74.5176 32.8301H75.0713L73.9316 36H73.5684L73.6504 35.5107ZM72.9268 32.8301L73.8203 35.5254L73.8818 36H73.5186L72.3701 32.8301H72.9268ZM76.8672 36.0586C76.6465 36.0586 76.4463 36.0215 76.2666 35.9473C76.0889 35.8711 75.9355 35.7646 75.8066 35.6279C75.6797 35.4912 75.582 35.3291 75.5137 35.1416C75.4453 34.9541 75.4111 34.749 75.4111 34.5264V34.4033C75.4111 34.1455 75.4492 33.916 75.5254 33.7148C75.6016 33.5117 75.7051 33.3398 75.8359 33.1992C75.9668 33.0586 76.1152 32.9521 76.2812 32.8799C76.4473 32.8076 76.6191 32.7715 76.7969 32.7715C77.0234 32.7715 77.2188 32.8105 77.3828 32.8887C77.5488 32.9668 77.6846 33.0762 77.79 33.2168C77.8955 33.3555 77.9736 33.5195 78.0244 33.709C78.0752 33.8965 78.1006 34.1016 78.1006 34.3242V34.5674H75.7334V34.125H77.5586V34.084C77.5508 33.9434 77.5215 33.8066 77.4707 33.6738C77.4219 33.541 77.3438 33.4316 77.2363 33.3457C77.1289 33.2598 76.9824 33.2168 76.7969 33.2168C76.6738 33.2168 76.5605 33.2432 76.457 33.2959C76.3535 33.3467 76.2646 33.4229 76.1904 33.5244C76.1162 33.626 76.0586 33.75 76.0176 33.8965C75.9766 34.043 75.9561 34.2119 75.9561 34.4033V34.5264C75.9561 34.6768 75.9766 34.8184 76.0176 34.9512C76.0605 35.082 76.1221 35.1973 76.2021 35.2969C76.2842 35.3965 76.3828 35.4746 76.498 35.5312C76.6152 35.5879 76.748 35.6162 76.8965 35.6162C77.0879 35.6162 77.25 35.5771 77.3828 35.499C77.5156 35.4209 77.6318 35.3164 77.7314 35.1855L78.0596 35.4463C77.9912 35.5498 77.9043 35.6484 77.7988 35.7422C77.6934 35.8359 77.5635 35.9121 77.4092 35.9707C77.2568 36.0293 77.0762 36.0586 76.8672 36.0586ZM79.2754 33.3281V36H78.7334V32.8301H79.2607L79.2754 33.3281ZM80.2656 32.8125L80.2627 33.3164C80.2178 33.3066 80.1748 33.3008 80.1338 33.2988C80.0947 33.2949 80.0498 33.293 79.999 33.293C79.874 33.293 79.7637 33.3125 79.668 33.3516C79.5723 33.3906 79.4912 33.4453 79.4248 33.5156C79.3584 33.5859 79.3057 33.6699 79.2666 33.7676C79.2295 33.8633 79.2051 33.9688 79.1934 34.084L79.041 34.1719C79.041 33.9805 79.0596 33.8008 79.0967 33.6328C79.1357 33.4648 79.1953 33.3164 79.2754 33.1875C79.3555 33.0566 79.457 32.9551 79.5801 32.8828C79.7051 32.8086 79.8535 32.7715 80.0254 32.7715C80.0645 32.7715 80.1094 32.7764 80.1602 32.7861C80.2109 32.7939 80.2461 32.8027 80.2656 32.8125ZM84.1006 35.1592C84.1006 35.0811 84.083 35.0088 84.0479 34.9424C84.0146 34.874 83.9453 34.8125 83.8398 34.7578C83.7363 34.7012 83.5801 34.6523 83.3711 34.6113C83.1953 34.5742 83.0361 34.5303 82.8936 34.4795C82.7529 34.4287 82.6328 34.3672 82.5332 34.2949C82.4355 34.2227 82.3604 34.1377 82.3076 34.04C82.2549 33.9424 82.2285 33.8281 82.2285 33.6973C82.2285 33.5723 82.2559 33.4541 82.3105 33.3428C82.3672 33.2314 82.4463 33.1328 82.5479 33.0469C82.6514 32.9609 82.7754 32.8936 82.9199 32.8447C83.0645 32.7959 83.2256 32.7715 83.4033 32.7715C83.6572 32.7715 83.874 32.8164 84.0537 32.9062C84.2334 32.9961 84.3711 33.1162 84.4668 33.2666C84.5625 33.415 84.6104 33.5801 84.6104 33.7617H84.0684C84.0684 33.6738 84.042 33.5889 83.9893 33.5068C83.9385 33.4229 83.8633 33.3535 83.7637 33.2988C83.666 33.2441 83.5459 33.2168 83.4033 33.2168C83.2529 33.2168 83.1309 33.2402 83.0371 33.2871C82.9453 33.332 82.8779 33.3896 82.835 33.46C82.7939 33.5303 82.7734 33.6045 82.7734 33.6826C82.7734 33.7412 82.7832 33.7939 82.8027 33.8408C82.8242 33.8857 82.8613 33.9277 82.9141 33.9668C82.9668 34.0039 83.041 34.0391 83.1367 34.0723C83.2324 34.1055 83.3545 34.1387 83.5029 34.1719C83.7627 34.2305 83.9766 34.3008 84.1445 34.3828C84.3125 34.4648 84.4375 34.5654 84.5195 34.6846C84.6016 34.8037 84.6426 34.9482 84.6426 35.1182C84.6426 35.2568 84.6133 35.3838 84.5547 35.499C84.498 35.6143 84.415 35.7139 84.3057 35.7979C84.1982 35.8799 84.0693 35.9443 83.9189 35.9912C83.7705 36.0361 83.6035 36.0586 83.418 36.0586C83.1387 36.0586 82.9023 36.0088 82.709 35.9092C82.5156 35.8096 82.3691 35.6807 82.2695 35.5225C82.1699 35.3643 82.1201 35.1973 82.1201 35.0215H82.665C82.6729 35.1699 82.7158 35.2881 82.7939 35.376C82.8721 35.4619 82.9678 35.5234 83.0811 35.5605C83.1943 35.5957 83.3066 35.6133 83.418 35.6133C83.5664 35.6133 83.6904 35.5938 83.79 35.5547C83.8916 35.5156 83.9688 35.4619 84.0215 35.3936C84.0742 35.3252 84.1006 35.2471 84.1006 35.1592ZM87.2939 35.2676V32.8301H87.8389V36H87.3203L87.2939 35.2676ZM87.3965 34.5996L87.6221 34.5938C87.6221 34.8047 87.5996 35 87.5547 35.1797C87.5117 35.3574 87.4414 35.5117 87.3438 35.6426C87.2461 35.7734 87.1182 35.876 86.96 35.9502C86.8018 36.0225 86.6094 36.0586 86.3828 36.0586C86.2285 36.0586 86.0869 36.0361 85.958 35.9912C85.8311 35.9463 85.7217 35.877 85.6299 35.7832C85.5381 35.6895 85.4668 35.5674 85.416 35.417C85.3672 35.2666 85.3428 35.0859 85.3428 34.875V32.8301H85.8848V34.8809C85.8848 35.0234 85.9004 35.1416 85.9316 35.2354C85.9648 35.3271 86.0088 35.4004 86.0635 35.4551C86.1201 35.5078 86.1826 35.5449 86.251 35.5664C86.3213 35.5879 86.3936 35.5986 86.4678 35.5986C86.6982 35.5986 86.8809 35.5547 87.0156 35.4668C87.1504 35.377 87.2471 35.2568 87.3057 35.1064C87.3662 34.9541 87.3965 34.7852 87.3965 34.5996ZM90.7188 32.8301H91.2109V35.9326C91.2109 36.2119 91.1543 36.4502 91.041 36.6475C90.9277 36.8447 90.7695 36.9941 90.5664 37.0957C90.3652 37.1992 90.1328 37.251 89.8691 37.251C89.7598 37.251 89.6309 37.2334 89.4824 37.1982C89.3359 37.165 89.1914 37.1074 89.0488 37.0254C88.9082 36.9453 88.79 36.8369 88.6943 36.7002L88.9785 36.3779C89.1113 36.5381 89.25 36.6494 89.3945 36.7119C89.541 36.7744 89.6855 36.8057 89.8281 36.8057C90 36.8057 90.1484 36.7734 90.2734 36.709C90.3984 36.6445 90.4951 36.5488 90.5635 36.4219C90.6338 36.2969 90.6689 36.1426 90.6689 35.959V33.5273L90.7188 32.8301ZM88.5361 34.4502V34.3887C88.5361 34.1465 88.5645 33.9268 88.6211 33.7295C88.6797 33.5303 88.7627 33.3594 88.8701 33.2168C88.9795 33.0742 89.1113 32.9648 89.2656 32.8887C89.4199 32.8105 89.5938 32.7715 89.7871 32.7715C89.9863 32.7715 90.1602 32.8066 90.3086 32.877C90.459 32.9453 90.5859 33.0459 90.6895 33.1787C90.7949 33.3096 90.8779 33.4678 90.9385 33.6533C90.999 33.8389 91.041 34.0488 91.0645 34.2832V34.5527C91.043 34.7852 91.001 34.9941 90.9385 35.1797C90.8779 35.3652 90.7949 35.5234 90.6895 35.6543C90.5859 35.7852 90.459 35.8857 90.3086 35.9561C90.1582 36.0244 89.9824 36.0586 89.7812 36.0586C89.5918 36.0586 89.4199 36.0186 89.2656 35.9385C89.1133 35.8584 88.9824 35.7461 88.873 35.6016C88.7637 35.457 88.6797 35.2871 88.6211 35.0918C88.5645 34.8945 88.5361 34.6807 88.5361 34.4502ZM89.0781 34.3887V34.4502C89.0781 34.6084 89.0938 34.7568 89.125 34.8955C89.1582 35.0342 89.208 35.1562 89.2744 35.2617C89.3428 35.3672 89.4297 35.4502 89.5352 35.5107C89.6406 35.5693 89.7666 35.5986 89.9131 35.5986C90.0928 35.5986 90.2412 35.5605 90.3584 35.4844C90.4756 35.4082 90.5684 35.3076 90.6367 35.1826C90.707 35.0576 90.7617 34.9219 90.8008 34.7754V34.0693C90.7793 33.9619 90.7461 33.8584 90.7012 33.7588C90.6582 33.6572 90.6016 33.5674 90.5312 33.4893C90.4629 33.4092 90.3779 33.3457 90.2764 33.2988C90.1748 33.252 90.0557 33.2285 89.9189 33.2285C89.7705 33.2285 89.6426 33.2598 89.5352 33.3223C89.4297 33.3828 89.3428 33.4668 89.2744 33.5742C89.208 33.6797 89.1582 33.8027 89.125 33.9434C89.0938 34.082 89.0781 34.2305 89.0781 34.3887ZM94.0879 32.8301H94.5801V35.9326C94.5801 36.2119 94.5234 36.4502 94.4102 36.6475C94.2969 36.8447 94.1387 36.9941 93.9355 37.0957C93.7344 37.1992 93.502 37.251 93.2383 37.251C93.1289 37.251 93 37.2334 92.8516 37.1982C92.7051 37.165 92.5605 37.1074 92.418 37.0254C92.2773 36.9453 92.1592 36.8369 92.0635 36.7002L92.3477 36.3779C92.4805 36.5381 92.6191 36.6494 92.7637 36.7119C92.9102 36.7744 93.0547 36.8057 93.1973 36.8057C93.3691 36.8057 93.5176 36.7734 93.6426 36.709C93.7676 36.6445 93.8643 36.5488 93.9326 36.4219C94.0029 36.2969 94.0381 36.1426 94.0381 35.959V33.5273L94.0879 32.8301ZM91.9053 34.4502V34.3887C91.9053 34.1465 91.9336 33.9268 91.9902 33.7295C92.0488 33.5303 92.1318 33.3594 92.2393 33.2168C92.3486 33.0742 92.4805 32.9648 92.6348 32.8887C92.7891 32.8105 92.9629 32.7715 93.1562 32.7715C93.3555 32.7715 93.5293 32.8066 93.6777 32.877C93.8281 32.9453 93.9551 33.0459 94.0586 33.1787C94.1641 33.3096 94.2471 33.4678 94.3076 33.6533C94.3682 33.8389 94.4102 34.0488 94.4336 34.2832V34.5527C94.4121 34.7852 94.3701 34.9941 94.3076 35.1797C94.2471 35.3652 94.1641 35.5234 94.0586 35.6543C93.9551 35.7852 93.8281 35.8857 93.6777 35.9561C93.5273 36.0244 93.3516 36.0586 93.1504 36.0586C92.9609 36.0586 92.7891 36.0186 92.6348 35.9385C92.4824 35.8584 92.3516 35.7461 92.2422 35.6016C92.1328 35.457 92.0488 35.2871 91.9902 35.0918C91.9336 34.8945 91.9053 34.6807 91.9053 34.4502ZM92.4473 34.3887V34.4502C92.4473 34.6084 92.4629 34.7568 92.4941 34.8955C92.5273 35.0342 92.5771 35.1562 92.6436 35.2617C92.7119 35.3672 92.7988 35.4502 92.9043 35.5107C93.0098 35.5693 93.1357 35.5986 93.2822 35.5986C93.4619 35.5986 93.6104 35.5605 93.7275 35.4844C93.8447 35.4082 93.9375 35.3076 94.0059 35.1826C94.0762 35.0576 94.1309 34.9219 94.1699 34.7754V34.0693C94.1484 33.9619 94.1152 33.8584 94.0703 33.7588C94.0273 33.6572 93.9707 33.5674 93.9004 33.4893C93.832 33.4092 93.7471 33.3457 93.6455 33.2988C93.5439 33.252 93.4248 33.2285 93.2881 33.2285C93.1396 33.2285 93.0117 33.2598 92.9043 33.3223C92.7988 33.3828 92.7119 33.4668 92.6436 33.5742C92.5771 33.6797 92.5273 33.8027 92.4941 33.9434C92.4629 34.082 92.4473 34.2305 92.4473 34.3887ZM96.7188 36.0586C96.498 36.0586 96.2979 36.0215 96.1182 35.9473C95.9404 35.8711 95.7871 35.7646 95.6582 35.6279C95.5312 35.4912 95.4336 35.3291 95.3652 35.1416C95.2969 34.9541 95.2627 34.749 95.2627 34.5264V34.4033C95.2627 34.1455 95.3008 33.916 95.377 33.7148C95.4531 33.5117 95.5566 33.3398 95.6875 33.1992C95.8184 33.0586 95.9668 32.9521 96.1328 32.8799C96.2988 32.8076 96.4707 32.7715 96.6484 32.7715C96.875 32.7715 97.0703 32.8105 97.2344 32.8887C97.4004 32.9668 97.5361 33.0762 97.6416 33.2168C97.7471 33.3555 97.8252 33.5195 97.876 33.709C97.9268 33.8965 97.9521 34.1016 97.9521 34.3242V34.5674H95.585V34.125H97.4102V34.084C97.4023 33.9434 97.373 33.8066 97.3223 33.6738C97.2734 33.541 97.1953 33.4316 97.0879 33.3457C96.9805 33.2598 96.834 33.2168 96.6484 33.2168C96.5254 33.2168 96.4121 33.2432 96.3086 33.2959C96.2051 33.3467 96.1162 33.4229 96.042 33.5244C95.9678 33.626 95.9102 33.75 95.8691 33.8965C95.8281 34.043 95.8076 34.2119 95.8076 34.4033V34.5264C95.8076 34.6768 95.8281 34.8184 95.8691 34.9512C95.9121 35.082 95.9736 35.1973 96.0537 35.2969C96.1357 35.3965 96.2344 35.4746 96.3496 35.5312C96.4668 35.5879 96.5996 35.6162 96.748 35.6162C96.9395 35.6162 97.1016 35.5771 97.2344 35.499C97.3672 35.4209 97.4834 35.3164 97.583 35.1855L97.9111 35.4463C97.8428 35.5498 97.7559 35.6484 97.6504 35.7422C97.5449 35.8359 97.415 35.9121 97.2607 35.9707C97.1084 36.0293 96.9277 36.0586 96.7188 36.0586ZM100.431 35.1592C100.431 35.0811 100.413 35.0088 100.378 34.9424C100.345 34.874 100.275 34.8125 100.17 34.7578C100.066 34.7012 99.9102 34.6523 99.7012 34.6113C99.5254 34.5742 99.3662 34.5303 99.2236 34.4795C99.083 34.4287 98.9629 34.3672 98.8633 34.2949C98.7656 34.2227 98.6904 34.1377 98.6377 34.04C98.585 33.9424 98.5586 33.8281 98.5586 33.6973C98.5586 33.5723 98.5859 33.4541 98.6406 33.3428C98.6973 33.2314 98.7764 33.1328 98.8779 33.0469C98.9814 32.9609 99.1055 32.8936 99.25 32.8447C99.3945 32.7959 99.5557 32.7715 99.7334 32.7715C99.9873 32.7715 100.204 32.8164 100.384 32.9062C100.563 32.9961 100.701 33.1162 100.797 33.2666C100.893 33.415 100.94 33.5801 100.94 33.7617H100.398C100.398 33.6738 100.372 33.5889 100.319 33.5068C100.269 33.4229 100.193 33.3535 100.094 33.2988C99.9961 33.2441 99.876 33.2168 99.7334 33.2168C99.583 33.2168 99.4609 33.2402 99.3672 33.2871C99.2754 33.332 99.208 33.3896 99.165 33.46C99.124 33.5303 99.1035 33.6045 99.1035 33.6826C99.1035 33.7412 99.1133 33.7939 99.1328 33.8408C99.1543 33.8857 99.1914 33.9277 99.2441 33.9668C99.2969 34.0039 99.3711 34.0391 99.4668 34.0723C99.5625 34.1055 99.6846 34.1387 99.833 34.1719C100.093 34.2305 100.307 34.3008 100.475 34.3828C100.643 34.4648 100.768 34.5654 100.85 34.6846C100.932 34.8037 100.973 34.9482 100.973 35.1182C100.973 35.2568 100.943 35.3838 100.885 35.499C100.828 35.6143 100.745 35.7139 100.636 35.7979C100.528 35.8799 100.399 35.9443 100.249 35.9912C100.101 36.0361 99.9336 36.0586 99.748 36.0586C99.4688 36.0586 99.2324 36.0088 99.0391 35.9092C98.8457 35.8096 98.6992 35.6807 98.5996 35.5225C98.5 35.3643 98.4502 35.1973 98.4502 35.0215H98.9951C99.0029 35.1699 99.0459 35.2881 99.124 35.376C99.2021 35.4619 99.2979 35.5234 99.4111 35.5605C99.5244 35.5957 99.6367 35.6133 99.748 35.6133C99.8965 35.6133 100.021 35.5938 100.12 35.5547C100.222 35.5156 100.299 35.4619 100.352 35.3936C100.404 35.3252 100.431 35.2471 100.431 35.1592ZM103.012 32.8301V33.2461H101.298V32.8301H103.012ZM101.878 32.0596H102.42V35.2148C102.42 35.3223 102.437 35.4033 102.47 35.458C102.503 35.5127 102.546 35.5488 102.599 35.5664C102.651 35.584 102.708 35.5928 102.769 35.5928C102.813 35.5928 102.86 35.5889 102.909 35.5811C102.96 35.5713 102.998 35.5635 103.023 35.5576L103.026 36C102.983 36.0137 102.927 36.0264 102.856 36.0381C102.788 36.0518 102.705 36.0586 102.607 36.0586C102.475 36.0586 102.353 36.0322 102.241 35.9795C102.13 35.9268 102.041 35.8389 101.975 35.7158C101.91 35.5908 101.878 35.4229 101.878 35.2119V32.0596ZM104.236 32.8301V36H103.691V32.8301H104.236ZM103.65 31.9893C103.65 31.9014 103.677 31.8271 103.729 31.7666C103.784 31.7061 103.864 31.6758 103.97 31.6758C104.073 31.6758 104.152 31.7061 104.207 31.7666C104.264 31.8271 104.292 31.9014 104.292 31.9893C104.292 32.0732 104.264 32.1455 104.207 32.2061C104.152 32.2646 104.073 32.2939 103.97 32.2939C103.864 32.2939 103.784 32.2646 103.729 32.2061C103.677 32.1455 103.65 32.0732 103.65 31.9893ZM104.963 34.4502V34.3828C104.963 34.1543 104.996 33.9424 105.062 33.7471C105.129 33.5498 105.225 33.3789 105.35 33.2344C105.475 33.0879 105.626 32.9746 105.804 32.8945C105.981 32.8125 106.181 32.7715 106.401 32.7715C106.624 32.7715 106.824 32.8125 107.002 32.8945C107.182 32.9746 107.334 33.0879 107.459 33.2344C107.586 33.3789 107.683 33.5498 107.749 33.7471C107.815 33.9424 107.849 34.1543 107.849 34.3828V34.4502C107.849 34.6787 107.815 34.8906 107.749 35.0859C107.683 35.2812 107.586 35.4521 107.459 35.5986C107.334 35.7432 107.183 35.8564 107.005 35.9385C106.829 36.0186 106.63 36.0586 106.407 36.0586C106.185 36.0586 105.984 36.0186 105.807 35.9385C105.629 35.8564 105.477 35.7432 105.35 35.5986C105.225 35.4521 105.129 35.2812 105.062 35.0859C104.996 34.8906 104.963 34.6787 104.963 34.4502ZM105.505 34.3828V34.4502C105.505 34.6084 105.523 34.7578 105.561 34.8984C105.598 35.0371 105.653 35.1602 105.728 35.2676C105.804 35.375 105.898 35.46 106.012 35.5225C106.125 35.583 106.257 35.6133 106.407 35.6133C106.556 35.6133 106.686 35.583 106.797 35.5225C106.91 35.46 107.004 35.375 107.078 35.2676C107.152 35.1602 107.208 35.0371 107.245 34.8984C107.284 34.7578 107.304 34.6084 107.304 34.4502V34.3828C107.304 34.2266 107.284 34.0791 107.245 33.9404C107.208 33.7998 107.151 33.6758 107.075 33.5684C107.001 33.459 106.907 33.373 106.794 33.3105C106.683 33.248 106.552 33.2168 106.401 33.2168C106.253 33.2168 106.122 33.248 106.009 33.3105C105.897 33.373 105.804 33.459 105.728 33.5684C105.653 33.6758 105.598 33.7998 105.561 33.9404C105.523 34.0791 105.505 34.2266 105.505 34.3828ZM109.07 33.5068V36H108.528V32.8301H109.041L109.07 33.5068ZM108.941 34.2949L108.716 34.2861C108.718 34.0693 108.75 33.8691 108.812 33.6855C108.875 33.5 108.963 33.3389 109.076 33.2021C109.189 33.0654 109.324 32.96 109.48 32.8857C109.639 32.8096 109.813 32.7715 110.005 32.7715C110.161 32.7715 110.302 32.793 110.427 32.8359C110.552 32.877 110.658 32.9434 110.746 33.0352C110.836 33.127 110.904 33.2461 110.951 33.3926C110.998 33.5371 111.021 33.7139 111.021 33.9229V36H110.477V33.917C110.477 33.751 110.452 33.6182 110.403 33.5186C110.354 33.417 110.283 33.3438 110.189 33.2988C110.096 33.252 109.98 33.2285 109.844 33.2285C109.709 33.2285 109.586 33.2568 109.475 33.3135C109.365 33.3701 109.271 33.4482 109.19 33.5479C109.112 33.6475 109.051 33.7617 109.006 33.8906C108.963 34.0176 108.941 34.1523 108.941 34.2949ZM112.489 31.7344L112.451 34.7959H111.962L111.921 31.7344H112.489ZM111.903 35.7275C111.903 35.6396 111.93 35.5654 111.982 35.5049C112.037 35.4443 112.117 35.4141 112.223 35.4141C112.326 35.4141 112.405 35.4443 112.46 35.5049C112.517 35.5654 112.545 35.6396 112.545 35.7275C112.545 35.8115 112.517 35.8838 112.46 35.9443C112.405 36.0049 112.326 36.0352 112.223 36.0352C112.117 36.0352 112.037 36.0049 111.982 35.9443C111.93 35.8838 111.903 35.8115 111.903 35.7275Z" fill="#B5BAC1" />
                    <path d="M127.061 24.7344V29H126.495V24.7344H127.061ZM128.848 26.6533V27.1162H126.938V26.6533H128.848ZM129.138 24.7344V25.1973H126.938V24.7344H129.138ZM129.521 27.4502V27.3828C129.521 27.1543 129.555 26.9424 129.621 26.7471C129.688 26.5498 129.783 26.3789 129.908 26.2344C130.033 26.0879 130.185 25.9746 130.362 25.8945C130.54 25.8125 130.739 25.7715 130.96 25.7715C131.183 25.7715 131.383 25.8125 131.561 25.8945C131.74 25.9746 131.893 26.0879 132.018 26.2344C132.145 26.3789 132.241 26.5498 132.308 26.7471C132.374 26.9424 132.407 27.1543 132.407 27.3828V27.4502C132.407 27.6787 132.374 27.8906 132.308 28.0859C132.241 28.2812 132.145 28.4521 132.018 28.5986C131.893 28.7432 131.741 28.8564 131.563 28.9385C131.388 29.0186 131.188 29.0586 130.966 29.0586C130.743 29.0586 130.543 29.0186 130.365 28.9385C130.188 28.8564 130.035 28.7432 129.908 28.5986C129.783 28.4521 129.688 28.2812 129.621 28.0859C129.555 27.8906 129.521 27.6787 129.521 27.4502ZM130.063 27.3828V27.4502C130.063 27.6084 130.082 27.7578 130.119 27.8984C130.156 28.0371 130.212 28.1602 130.286 28.2676C130.362 28.375 130.457 28.46 130.57 28.5225C130.684 28.583 130.815 28.6133 130.966 28.6133C131.114 28.6133 131.244 28.583 131.355 28.5225C131.469 28.46 131.562 28.375 131.637 28.2676C131.711 28.1602 131.767 28.0371 131.804 27.8984C131.843 27.7578 131.862 27.6084 131.862 27.4502V27.3828C131.862 27.2266 131.843 27.0791 131.804 26.9404C131.767 26.7998 131.71 26.6758 131.634 26.5684C131.56 26.459 131.466 26.373 131.353 26.3105C131.241 26.248 131.11 26.2168 130.96 26.2168C130.812 26.2168 130.681 26.248 130.567 26.3105C130.456 26.373 130.362 26.459 130.286 26.5684C130.212 26.6758 130.156 26.7998 130.119 26.9404C130.082 27.0791 130.063 27.2266 130.063 27.3828ZM133.629 26.3281V29H133.087V25.8301H133.614L133.629 26.3281ZM134.619 25.8125L134.616 26.3164C134.571 26.3066 134.528 26.3008 134.487 26.2988C134.448 26.2949 134.403 26.293 134.353 26.293C134.228 26.293 134.117 26.3125 134.021 26.3516C133.926 26.3906 133.845 26.4453 133.778 26.5156C133.712 26.5859 133.659 26.6699 133.62 26.7676C133.583 26.8633 133.559 26.9688 133.547 27.084L133.395 27.1719C133.395 26.9805 133.413 26.8008 133.45 26.6328C133.489 26.4648 133.549 26.3164 133.629 26.1875C133.709 26.0566 133.811 25.9551 133.934 25.8828C134.059 25.8086 134.207 25.7715 134.379 25.7715C134.418 25.7715 134.463 25.7764 134.514 25.7861C134.564 25.7939 134.6 25.8027 134.619 25.8125ZM135.659 26.46V29H135.114V25.8301H135.63L135.659 26.46ZM135.548 27.2949L135.296 27.2861C135.298 27.0693 135.326 26.8691 135.381 26.6855C135.436 26.5 135.517 26.3389 135.624 26.2021C135.731 26.0654 135.865 25.96 136.025 25.8857C136.186 25.8096 136.371 25.7715 136.582 25.7715C136.73 25.7715 136.867 25.793 136.992 25.8359C137.117 25.877 137.226 25.9424 137.317 26.0322C137.409 26.1221 137.48 26.2373 137.531 26.3779C137.582 26.5186 137.607 26.6885 137.607 26.8877V29H137.065V26.9141C137.065 26.748 137.037 26.6152 136.98 26.5156C136.926 26.416 136.848 26.3438 136.746 26.2988C136.645 26.252 136.525 26.2285 136.389 26.2285C136.229 26.2285 136.095 26.2568 135.987 26.3135C135.88 26.3701 135.794 26.4482 135.729 26.5479C135.665 26.6475 135.618 26.7617 135.589 26.8906C135.562 27.0176 135.548 27.1523 135.548 27.2949ZM137.602 26.9961L137.238 27.1074C137.24 26.9336 137.269 26.7666 137.323 26.6064C137.38 26.4463 137.461 26.3037 137.566 26.1787C137.674 26.0537 137.806 25.9551 137.962 25.8828C138.118 25.8086 138.297 25.7715 138.498 25.7715C138.668 25.7715 138.818 25.7939 138.949 25.8389C139.082 25.8838 139.193 25.9531 139.283 26.0469C139.375 26.1387 139.444 26.2568 139.491 26.4014C139.538 26.5459 139.562 26.7178 139.562 26.917V29H139.017V26.9111C139.017 26.7334 138.988 26.5957 138.932 26.498C138.877 26.3984 138.799 26.3291 138.697 26.29C138.598 26.249 138.479 26.2285 138.34 26.2285C138.221 26.2285 138.115 26.249 138.023 26.29C137.932 26.3311 137.854 26.3877 137.792 26.46C137.729 26.5303 137.682 26.6113 137.648 26.7031C137.617 26.7949 137.602 26.8926 137.602 26.9961ZM142.228 28.1592C142.228 28.0811 142.21 28.0088 142.175 27.9424C142.142 27.874 142.072 27.8125 141.967 27.7578C141.863 27.7012 141.707 27.6523 141.498 27.6113C141.322 27.5742 141.163 27.5303 141.021 27.4795C140.88 27.4287 140.76 27.3672 140.66 27.2949C140.562 27.2227 140.487 27.1377 140.435 27.04C140.382 26.9424 140.355 26.8281 140.355 26.6973C140.355 26.5723 140.383 26.4541 140.438 26.3428C140.494 26.2314 140.573 26.1328 140.675 26.0469C140.778 25.9609 140.902 25.8936 141.047 25.8447C141.191 25.7959 141.353 25.7715 141.53 25.7715C141.784 25.7715 142.001 25.8164 142.181 25.9062C142.36 25.9961 142.498 26.1162 142.594 26.2666C142.689 26.415 142.737 26.5801 142.737 26.7617H142.195C142.195 26.6738 142.169 26.5889 142.116 26.5068C142.065 26.4229 141.99 26.3535 141.891 26.2988C141.793 26.2441 141.673 26.2168 141.53 26.2168C141.38 26.2168 141.258 26.2402 141.164 26.2871C141.072 26.332 141.005 26.3896 140.962 26.46C140.921 26.5303 140.9 26.6045 140.9 26.6826C140.9 26.7412 140.91 26.7939 140.93 26.8408C140.951 26.8857 140.988 26.9277 141.041 26.9668C141.094 27.0039 141.168 27.0391 141.264 27.0723C141.359 27.1055 141.481 27.1387 141.63 27.1719C141.89 27.2305 142.104 27.3008 142.271 27.3828C142.439 27.4648 142.564 27.5654 142.646 27.6846C142.729 27.8037 142.77 27.9482 142.77 28.1182C142.77 28.2568 142.74 28.3838 142.682 28.499C142.625 28.6143 142.542 28.7139 142.433 28.7979C142.325 28.8799 142.196 28.9443 142.046 28.9912C141.897 29.0361 141.73 29.0586 141.545 29.0586C141.266 29.0586 141.029 29.0088 140.836 28.9092C140.643 28.8096 140.496 28.6807 140.396 28.5225C140.297 28.3643 140.247 28.1973 140.247 28.0215H140.792C140.8 28.1699 140.843 28.2881 140.921 28.376C140.999 28.4619 141.095 28.5234 141.208 28.5605C141.321 28.5957 141.434 28.6133 141.545 28.6133C141.693 28.6133 141.817 28.5938 141.917 28.5547C142.019 28.5156 142.096 28.4619 142.148 28.3936C142.201 28.3252 142.228 28.2471 142.228 28.1592Z" fill="#B5BAC1" />
                    <rect x="8" y="18" width="22" height="22" rx="11" fill="#616AF2" />
                    <circle cx="14.1117" cy="25.9856" r="1.05369" fill="white" />
                    <circle cx="14.1117" cy="32.3077" r="1.05369" fill="white" />
                    <circle cx="14.1117" cy="29.1467" r="1.05369" fill="white" />
                    <rect x="16.219" y="25.1953" width="8.16612" height="1.58054" rx="0.79027" fill="white" />
                    <rect x="16.219" y="28.3564" width="7.63927" height="1.58054" rx="0.79027" fill="white" />
                    <rect x="16.219" y="31.5175" width="8.42954" height="1.58054" rx="0.79027" fill="white" />
                  </svg>









                </Box>
                <Text fontSize={12} color='#DBDEE1'>Supports 1 form per command.</Text>
              </Box>
            </VStack>
            <HStack>
              <Button variant='secondary' onClick={() => {
                _setSubmissionChannel(['existing'])
                setValue('forms.0.submit_channel_id', undefined)
                setValue('forms.0.submit_channel', undefined)
                setValue('forms.0.submit_thread', undefined)
                setValue('forms.0.submit_components', undefined)
                setPremium(false)
                setStage('welcome')
              }}>Go back</Button>
              <Button variant='primary' onClick={() => {
                switch (openFormType) {
                  case 'application_command': setStage('applicationCommand'); break;
                  case 'button': case 'select_menu': setStage('form'); break;
                }
              }}>Continue</Button>
            </HStack>
          </VStack></>}
        {stage === 'applicationCommand' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>Setup slash command</Text>
          <VStack align='center' mt={5} width='100%' gap={5}>
            <Box width='100%' maxWidth='350px'>
              <ApplicationCommandBuilder register={register} getValues={getValues} errors={formState.errors} />
            </Box>
            <HStack>
              <Button variant='secondary' onClick={() => setStage('openFormType')}>Go back</Button>
              <Button variant='primary' isDisabled={(getValues('application_command')?.name ? (formState.errors.application_command?.name ? true : false) : true) || formState.errors.application_command?.description ? true : false} onClick={() => setStage('form')}>Continue</Button>
            </HStack>
          </VStack></>}
        {stage === 'form' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>Setup form</Text>
          <VStack align='center' mt={5} width='100%' gap={5}>
            <Box width='100%' maxWidth='500px'>
              <FormTitleInput index={0} pageIndex={0} register={register} getValues={getValues} fixMessage={fixMessage} errors={formState.errors} />
              <TextInputBuilder compact id={`forms.0.pages.0.modal.components`} nestIndex={0} pageIndex={0} {...{ control, register, formState, watch, setValue, resetField, fixMessage }} />
            </Box>
            <HStack>
              <Button variant='secondary' onClick={() => setStage('openFormType')}>Go back</Button>
              <Button variant='primary' isDisabled={!getValues('forms.0')?.pages?.[0]?.modal?.title || (getValues('forms.0')?.pages?.[0]?.modal?.components[0] ? !getValues('forms.0')?.pages?.[0]?.modal?.components[0].components?.[0]?.label : false) || (getValues('forms.0')?.pages?.[0]?.modal?.components[1] ? !getValues('forms.0')?.pages?.[0]?.modal?.components[1].components?.[0]?.label : false) || (getValues('forms.0')?.pages?.[0]?.modal?.components[2] ? !getValues('forms.0')?.pages?.[0]?.modal?.components[2].components?.[0]?.label : false) || (getValues('forms.0')?.pages?.[0]?.modal?.components[3] ? !getValues('forms.0')?.pages?.[0]?.modal?.components[3].components?.[0]?.label : false) || (getValues('forms.0')?.pages?.[0]?.modal?.components[4] ? !getValues('forms.0')?.pages?.[0]?.modal?.components[4].components?.[0]?.label : false) || formState.errors.forms?.[0]?.pages?.[0]?.modal ? true : false} onClick={() => setStage('submissions')}>Continue</Button>
            </HStack>
          </VStack></>}
        {stage === 'submissions' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>Where should submissions be sent?</Text>
          <VStack align='center' mt={5} width='100%' gap={5}>
            <Box width='100%' maxWidth='500px'>
              {/* Create a webhook in the channel you want submissions to be sent to.<br /><br />
              <WebhookURLInput index={0} register={register} webhookUrlFocused={webhookUrlFocused} webhookUrlSetFocused={webhookUrlSetFocused} errors={formState.errors} fixMessage={fixMessage} />
              <Text fontSize={12}>Channel Settings –&gt; Integrations –&gt; Webhooks –&gt; New Webhook –&gt; Copy Webhook URL<br /><br /></Text>
              In the webhooks settings you can customise the name and avatar of your submissions. */}
              {getValues('forms.0.submit_channel') ? <>
                <FormLabel htmlFor={`forms.0.submit_channel.parent_id`}>Category ID</FormLabel>
                <input
                  //@ts-expect-error
                  {...register(`forms.0.submit_channel.parent_id`, { pattern: /^\d{10,20}$/, onChange: () => fixSubmitChannel(0) })}
                  id={`forms.0.submit_channel.parent_id`}
                />
                {/* @ts-expect-error */}
                <ErrorMessage error={formState.errors.forms?.[0]?.submit_channel?.parent_id} />
                <Text fontSize={12}>User Settings –&gt; Advanced –&gt; Enable Developer Mode<br /> Then create a category for submissions in your server –&gt; Right Click –&gt; Copy Channel ID<br /><br /></Text>
              </> : <><SubmissionChannelIDInput index={0} register={register} errors={formState.errors} watch={watch} fixMessage={fixMessage} />
                <Text fontSize={12}>User Settings –&gt; Advanced –&gt; Enable Developer Mode<br /> Then go to the Submission Channel –&gt; Right Click –&gt; Copy Channel ID<br /><br /></Text></>}
            </Box>
            <HStack>
              <Button variant='secondary' onClick={() => setStage('form')}>Go back</Button>
              {/* @ts-expect-error */}
              <Button variant='primary' isDisabled={(!getValues('forms.0.submit_channel.parent_id') && !getValues('forms.0')?.submit_channel_id) || formState.errors.forms ? true : false} onClick={() => {
                //@ts-expect-error
                if (submissionChannel[0] === 'new' && getValues('forms.0.submit_channel.parent_id') === '') setValue('forms.0.submit_channel.parent_id', undefined)
                setStage('finishOrContinue')
                //@ts-expect-error
              }}>{getValues('forms.0.submit_channel') ? (getValues('forms.0.submit_channel.parent_id') ? 'Continue' : 'Continue') : 'Continue'}</Button>
            </HStack>
          </VStack></>}
        {stage === 'finishOrContinue' && <><Text mt={5} align='center' width='100%' fontSize={25} fontFamily='Whitney Bold'>Done</Text>
          <VStack align='center' mt={5} width='100%' gap={5}>
            <Box width='100%' maxWidth='500px'>
              <Text fontSize={20} fontFamily='Whitney Bold'>Continue to advanced customisation</Text>
              <Text mb={2}>Add more forms, edit the message, add placeholders and more!</Text>
              <Button mb={5} variant='primary' onClick={() => setStage('editor')}>Open Editor</Button>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Divider bg='grey' />
                <Text mx={4} fontSize={18}>or</Text>
                <Divider bg='grey' />
              </Box>
              <Text fontSize={20} fontFamily='Whitney Bold'>Finish</Text>
              <Text mb={2}>On the forms bot run <SlashCommand>form create</SlashCommand> and upload the JSON configuration file.</Text>
              <HStack alignItems="flex-start">
                <HStack>
                  <Button
                    variant="success"
                    disabled={!formState.isValid}
                    onClick={() => {
                      handleLoad();
                      downloadForm();
                    }}
                    width={225}
                  >
                    {!loading && "Download Configuration File"}
                    {loading && <Spinner size="sm" />}
                  </Button>
                  <Link href='https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=805309456&scope=bot+applications.commands' target='_blank' rel='noopener noreferrer'><Button variant='success-outline'>Invite Bot</Button></Link>
                </HStack>
              </HStack>
            </Box>
            <HStack>
              <Button variant='secondary' onClick={() => setStage('submissions')}>Go back</Button>
            </HStack>
          </VStack></>}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='grey.dark'>
          <ModalHeader>How to get your Submission Channel ID</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5}>
            <Text fontFamily='Whitney Bold'>1. Enable Developer Mode</Text> Go to your User Settings in discord and in the advanced section enable "Developer Mode".<br /><br />
            <Text fontFamily='Whitney Bold'>2. Copy the Channel ID</Text> Go to the discord channel where you'd like to have submissions posted to, right click it and click "Copy Channel ID".
          </ModalBody>

          <ModalFooter>
            <Button variant='primary' onClick={onClose}>Okay</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenPremium} onClose={onClosePremium}>
        <ModalOverlay />
        <ModalContent bg='grey.dark'>
          <ModalHeader>You've discovered a premium feature!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5} fontSize='18px' fontWeight='600'>
            <VStack gap={4} align='flex-start'>
              <Text fontWeight='400'>Premium Features</Text>
              <HStack>
                <Box width='32px'><svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_733_18)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M37.4903 37.4903C61.495 13.4857 94.0523 0 128 0C161.948 0 194.505 13.4857 218.51 37.4903C242.514 61.495 256 94.0523 256 128C256 148.416 251.122 168.33 242.013 186.181L239.044 192H192C162.545 192 138.667 215.878 138.667 245.333V256H128C94.0523 256 61.495 242.514 37.4903 218.51C13.4857 194.505 0 161.948 0 128C0 94.0523 13.4857 61.495 37.4903 37.4903ZM94.6725 88.944C104.98 88.9377 113.333 80.5802 113.333 70.2715C113.333 59.9589 104.973 51.5989 94.6608 51.5989C84.3536 51.6053 76 59.9642 76 70.2727C76 80.5854 84.36 88.944 94.6725 88.944ZM161.339 88.944C171.646 88.9377 180 80.5802 180 70.2715C180 59.9589 171.641 51.5989 161.328 51.5989C151.021 51.6053 142.667 59.9642 142.667 70.2727C142.667 80.5854 151.026 88.944 161.339 88.944ZM213.355 128.005C213.355 138.315 205.001 146.672 194.693 146.678C184.381 146.678 176.021 138.32 176.021 128.007C176.021 117.698 184.374 109.34 194.682 109.333C204.994 109.333 213.355 117.693 213.355 128.005ZM61.36 146.678C71.6672 146.672 80.0208 138.315 80.0208 128.005C80.0208 117.693 71.6609 109.333 61.3483 109.333C51.0412 109.34 42.6875 117.698 42.6875 128.007C42.6875 138.32 51.0475 146.678 61.36 146.678Z" fill="url(#paint0_linear_733_18)" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_733_18" x1="0" y1="128" x2="256" y2="128" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                    <clipPath id="clip0_733_18">
                      <rect width="256" height="256" fill="white" />
                    </clipPath>
                  </defs>
                </svg></Box>
                <Text className={premiumFeatureTarget === 'custom_branding' ? 'highlighted-feature' : ''}>Custom Branding</Text>
              </HStack>
              <HStack>
                <Box width='32px'><svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M138.064 4.36718C141.624 9.15221 140.61 15.9022 135.8 19.4437L44.2921 86.8176C43.0392 88.0845 42.6897 89.6412 42.6709 91.3679V204.8C42.6709 210.754 37.8196 215.579 31.8354 215.579C25.8512 215.579 21 210.754 21 204.8L21.0221 90.1566C21.0429 89.4959 21.085 88.572 21.1717 87.5409C21.2566 86.534 21.3961 85.2772 21.6397 83.9922C21.8513 82.8751 22.2755 80.9746 23.2263 79.0933C24.9323 75.7176 27.6236 72.2699 30.7476 69.9698L122.908 2.11556C127.718 -1.42594 134.503 -0.417853 138.064 4.36718ZM227.232 47.4214C222.83 45.2743 218.043 45.2743 213.641 47.4214C213.252 47.6108 212.881 47.8306 212.527 48.0788L120.35 112.899C118.004 114.468 114.863 117.066 112.917 120.863C111.292 124.034 110.392 127.637 110.392 131.071V241.996C110.392 246.786 112.896 251.92 118.16 254.487C118.501 254.654 118.853 254.795 119.212 254.913C121.169 255.549 123.835 256.239 126.775 255.919C129.795 255.592 132.315 254.306 134.373 252.479L225.114 188.96C225.238 188.872 225.362 188.781 225.481 188.686C227.451 187.135 230.443 184.725 232.389 180.926C233.879 178.021 235 174.528 235 170.837V59.9124C235 55.1226 232.496 49.9886 227.232 47.4214ZM179.142 41.0019C183.952 37.4604 184.966 30.7104 181.406 25.9254C177.845 21.1403 171.06 20.1323 166.25 23.6738L74.0893 91.528C70.9654 93.828 68.2741 97.2758 66.568 100.652C65.6173 102.533 65.1931 104.433 64.9815 105.55C64.7379 106.835 64.5984 108.092 64.5135 109.1C64.4267 110.13 64.3847 111.054 64.3639 111.715L64.3418 226.358C64.3418 232.311 69.193 237.137 75.1772 237.137C81.1614 237.137 86.0127 232.311 86.0127 226.358V112.926C86.0315 111.199 86.381 109.643 87.6339 108.375L179.142 41.0019Z" fill="url(#paint0_linear_788_15)" />
                  <defs>
                    <linearGradient id="paint0_linear_788_15" x1="21" y1="128" x2="235" y2="128" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                  </defs>
                </svg>
                </Box>
                <Text className={premiumFeatureTarget === 'multiple_pages' ? 'highlighted-feature' : ''}>Multiple Pages</Text>
              </HStack>
              <HStack>
                <Box width='32px'><svg viewBox="0 0 256 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M157.595 0H27.6488C12.3788 0 0 12.379 0 27.6489V64.4883C0 68.6791 2.82737 72.3422 6.88144 73.404C18.878 76.5456 27.7181 87.4704 27.7181 100.437C27.7181 113.403 18.8779 124.328 6.88144 127.47C2.82737 128.531 0 132.194 0 136.385V173.224C0 188.494 12.3789 200.873 27.6488 200.873H157.595V169.261C157.595 162.898 162.753 157.741 169.116 157.741C175.478 157.741 180.636 162.898 180.636 169.261V200.873H228.351C243.623 200.873 256 188.494 256 173.224V136.303C256 132.142 253.213 128.497 249.197 127.408C237.317 124.187 228.591 113.319 228.591 100.437C228.591 87.5545 237.317 76.6866 249.197 73.4655C253.213 72.3765 256 68.7317 256 64.5705V27.6489C256 12.3788 243.623 0 228.351 0H180.636V31.7649C180.636 38.1273 175.478 43.2853 169.116 43.2853C162.753 43.2853 157.595 38.1273 157.595 31.7649V0ZM169.116 70.3233C175.478 70.3233 180.636 75.4811 180.636 81.8437V119.005C180.636 125.367 175.478 130.525 169.116 130.525C162.753 130.525 157.595 125.367 157.595 119.005V81.8437C157.595 75.4811 162.753 70.3233 169.116 70.3233Z" fill="url(#paint0_linear_845_3)" />
                  <defs>
                    <linearGradient id="paint0_linear_845_3" x1="0" y1="100.436" x2="256" y2="100.436" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                  </defs>
                </svg>
                </Box>
                <Text className={premiumFeatureTarget === 'tickets' ? 'highlighted-feature' : ''}>Ticket System</Text>
              </HStack>
              <HStack>
                <Box width='32px'><svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_764_24" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
                    <path d="M116.361 115.2V91.1045C102.802 86.3123 93.088 73.3815 93.088 58.1819C93.088 38.9021 108.717 23.2727 127.997 23.2727C147.277 23.2727 162.906 38.9021 162.906 58.1819H186.179C186.179 26.0489 160.129 0 127.997 0C95.8642 0 69.8154 26.0489 69.8154 58.1819C69.8154 79.069 80.8218 97.3855 97.3512 107.648L61.6107 174.797C60.4909 174.632 59.345 174.546 58.1791 174.546C45.3259 174.546 34.9064 184.965 34.9064 197.818C34.9064 210.672 45.3259 221.091 58.1791 221.091C67.7222 221.091 75.9239 215.347 79.5152 207.127H176.479C180.07 215.347 188.272 221.091 197.815 221.091C210.668 221.091 221.088 210.672 221.088 197.818C221.088 184.965 210.668 174.546 197.815 174.546C188.272 174.546 180.07 180.289 176.479 188.509H79.5153C79.4554 188.372 79.3942 188.236 79.3317 188.1L116.361 115.2Z" fill="url(#paint0_linear_764_24)" />
                    <path d="M128 81.4545C115.147 81.4545 104.727 71.035 104.727 58.1818C104.727 45.3286 115.147 34.9091 128 34.9091C140.854 34.9091 151.273 45.3286 151.273 58.1818C151.273 63.247 149.654 67.9342 146.907 71.7548L197.818 139.636C229.951 139.636 256 165.686 256 197.818C256 229.951 229.951 256 197.818 256C173.96 256 153.456 241.64 144.477 221.091H171.798C178.19 228.233 187.479 232.727 197.818 232.727C217.097 232.727 232.727 217.098 232.727 197.818C232.727 178.538 217.097 162.909 197.818 162.909H186.182L128 81.4545Z" fill="url(#paint1_linear_764_24)" />
                    <path d="M111.522 221.09C102.544 241.638 82.0397 255.999 58.1816 255.999C26.0488 255.999 0 229.95 0 197.817C0 165.684 26.0488 139.635 58.1816 139.635V162.908C38.9019 162.908 23.2726 178.537 23.2726 197.817C23.2726 217.097 38.9019 232.726 58.1816 232.726C68.5204 232.726 77.8096 228.232 84.2016 221.09H111.522Z" fill="url(#paint2_linear_764_24)" />
                  </mask>
                  <g mask="url(#mask0_764_24)">
                    <rect x="-61.6441" y="-92.16" width="410.961" height="419.84" fill="url(#paint3_linear_764_24)" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_764_24" x1="34.9064" y1="110.546" x2="221.088" y2="110.546" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_764_24" x1="104.727" y1="145.455" x2="256" y2="145.455" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_764_24" x1="0" y1="197.817" x2="111.522" y2="197.817" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_764_24" x1="-61.6441" y1="117.76" x2="349.317" y2="117.76" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                  </defs>
                </svg>
                </Box>
                <Text className={premiumFeatureTarget === 'webhook_submissions' ? 'highlighted-feature' : ''}>Webhook Submissions</Text>
              </HStack>
              <HStack>
                <Box width='32px'><svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M128 256C148.717 256.001 169.013 250.166 186.551 239.167C204.09 228.169 218.157 212.453 227.135 193.831C236.113 175.208 239.635 154.435 237.297 133.903C234.959 113.371 226.855 93.9152 213.919 77.7752L222.229 69.6076C224.531 67.3121 225.824 64.1987 225.824 60.9524C225.824 57.706 224.531 54.5927 222.229 52.2971C219.928 50.0016 216.807 48.712 213.552 48.712C210.297 48.712 207.176 50.0016 204.875 52.2971L196.686 60.5867C180.474 47.5954 160.889 39.477 140.222 37.181V24.381H164.665C167.906 24.381 171.015 23.0966 173.307 20.8104C175.599 18.5243 176.887 15.4236 176.887 12.1905C176.887 8.95736 175.599 5.85667 173.307 3.57051C171.015 1.28435 167.906 0 164.665 0H91.3349C88.0935 0 84.9848 1.28435 82.6928 3.57051C80.4008 5.85667 79.1132 8.95736 79.1132 12.1905C79.1132 15.4236 80.4008 18.5243 82.6928 20.8104C84.9848 23.0966 88.0935 24.381 91.3349 24.381H115.778V37.181C94.5125 39.619 75.2022 47.9086 59.314 60.5867L51.1255 52.2971C48.8241 50.0016 45.7027 48.712 42.4481 48.712C39.1934 48.712 36.0721 50.0016 33.7707 52.2971C31.4693 54.5927 30.1764 57.706 30.1764 60.9524C30.1764 64.1987 31.4693 67.3121 33.7707 69.6076L42.0814 77.7752C29.1449 93.9152 21.0411 113.371 18.7029 133.903C16.3647 154.435 19.8872 175.208 28.8649 193.831C37.8426 212.453 51.9104 228.169 69.4488 239.167C86.9872 250.166 107.283 256.001 128 256ZM173.22 118.248C174.985 115.9 175.842 112.996 175.634 110.069C175.425 107.142 174.165 104.388 172.085 102.313C170.005 100.238 167.244 98.9816 164.309 98.7735C161.375 98.5655 158.463 99.4203 156.11 101.181L119.445 137.752C117.68 140.1 116.823 143.004 117.031 145.931C117.24 148.858 118.5 151.612 120.58 153.687C122.66 155.762 125.421 157.018 128.356 157.226C131.29 157.434 134.202 156.58 136.555 154.819L173.22 118.248Z" fill="url(#paint0_linear_739_4)" />
                  <defs>
                    <linearGradient id="paint0_linear_739_4" x1="18" y1="128" x2="238" y2="128" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#3442D9" />
                      <stop offset="1" stop-color="#0176A4" />
                    </linearGradient>
                  </defs>
                </svg>
                </Box>
                <Text className={premiumFeatureTarget === 'submission_cooldown' ? 'highlighted-feature' : ''}>Submission Cooldown</Text>
              </HStack>
              <HStack>
                <Box width='32px'>
                  <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M192.8 64V96C210.032 96 224 109.969 224 127.2V224C224 241.673 209.674 256 192 256H64C46.3265 256 32 241.673 32 224V128C32 110.327 46.3265 96 64 96V64C64 28.16 94.4 0 128 0C161.6 0 192.8 28.16 192.8 64ZM96.0001 96H160V64C160 45.7142 145.066 32 128 32C110.934 32 96.0001 45.7142 96.0001 64V96Z" fill="url(#paint0_linear_754_3)" />
                    <defs>
                      <linearGradient id="paint0_linear_754_3" x1="32" y1="128" x2="224" y2="128" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text className={premiumFeatureTarget === 'require_permissions' ? 'highlighted-feature' : ''}>Require permissions to use buttons</Text>
              </HStack>
              <Text fontWeight='400'>Unlock all premium features for €4.99/month</Text>
            </VStack>

          </ModalBody>

          <ModalFooter display='flex' justifyContent='space-between'>
            <Button variant='link' onClick={() => {
              setPremium(true)
              onClosePremium()
            }}>I already have premium</Button>
            <HStack>
              <Button variant='secondary' onClick={onClosePremium}>Not now</Button>
              <Link href="https://forms.lemonsqueezy.com/buy/6c238e6d-28f7-44ea-b965-b2f8c9e2512b" target='_blank'><Button variant='success'>Upgrade</Button></Link>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
