/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import FormBuilder from "../components/FormBuilder";
import {
  Box,
  VStack,
  Grid,
  Text,
  Button,
  Heading,
  useToast,
  HStack,
  Input,
  Link,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  cssVar,
  Spinner
} from '@chakra-ui/react';
import Image from "next/image";
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import JSONViewer, { DOWNLOAD_SPINNER_TIME } from '../components/JSONViewer';
import ErrorMessage from '../components/ErrorMessage';
import Preview from '../components/Preview';
import MessageBuilder, { MessageType } from '../components/messageBuilder';
import { SlashCommand, UserMention } from '../components/Mention';
import _DefaultValues from '../DefaultValues.json';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { Footer } from '../components/Footer';
import { FormAndMessageBuilder } from "../util/types";
import { useSettings } from '../util/settings';
import { bindToInput } from '../util/bind';
import { Switches, Toggle, useToggle } from '../components/Toggle';
import { useAutorun } from '../util/useAutorun';
import { Navigation } from '../components/Navigation';

const DefaultValues = _DefaultValues as FormAndMessageBuilder;
const ClearedValues = _ClearedValues as FormAndMessageBuilder;
const $SwitchBackground = cssVar("switch-bg");

const Defaults = {
  Embed: {
    color: 5793266,
    title: "Example Form",
    description: "Fill out the form below!",
    author: {
      name: "",
      url: "",
      icon_url: ""
    },
    footer: {
      text: "",
      icon_url: ""
    }
  },
  Message: 'Fill out the form below!'
};

const defaultValues = DefaultValues as FormAndMessageBuilder;

export default function App() {
  const {
    control,
    register,
    watch,
    getValues,
    reset,
    setValue,
    formState,
    formState: { errors }
  } = useForm<FormAndMessageBuilder>({
    mode: 'onChange',
    defaultValues
  });

  const toast = useToast();

  enum ToastStyles {
    Success = "success",
    Info = "info",
    Warning = "wraning",
    Error = "error",
    Loading = "loading"
  }

  function postToast({ title, description, style }: {
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
        borderRadius: "0.3rem"
      },
      position: "bottom",
      duration: 3000,
      isClosable: true,
    });
  }

  const fixForm = (toast = true) => {
    getValues("forms").forEach((form, i) => {
      setValue(`forms.${i}.button.style`, Number(form.button.style));
      form.modal.components.forEach((actionRow) => {
        actionRow.components.forEach((e, index) => {
          console.log(e)
          Object.entries(e).map(([k, v]) => {
            console.log(k, v)
            if (v === null) return { key: k, value: v };
            //@ts-expect-error
            // eslint-disable-next-line eqeqeq
            if (v == '') e[k] = null;
            //@ts-expect-error
            else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
            return { key: k, value: v };
          });
          setValue(`forms.${i}.modal.components.${index}.components.${index}`, e);
        })
      })
    });

    const Message = getValues("message");

    if (Message?.embeds != null && Message.embeds.length > 0) {
      console.log("fixing...")
      Message.embeds.forEach((embed, i) => {
        Object.entries(embed).forEach(([k, v]) => {
          if (typeof v == "string") {
            //@ts-expect-error
            if (v == null || v === "") setValue(`message.embeds.${i}.${k}`, null);
          } else if (typeof v == "object") {
            Object.entries(v).forEach(([k2, v2], i2) => {
              //@ts-expect-error
              if (v2 == null || v2 === "") setValue(`message.embeds.${i}.${k}.${k2}`, null);
            })
          }
        })
      });
    }

    if (
      Message?.embeds == null && (Message.content === "" || Message.content == null)
    ) {
      setValue("message", {
        content: null,
        embeds: []
      });
    }

    if (toast) postToast({
      title: 'Form Fixed',
      style: ToastStyles.Success
    });
  }

  const [displayForm, setDisplayForm] = useState(0);
  const [messageType, setMessageType] = useState("content");
  const [fileInput, setFileInput] = useState<HTMLInputElement>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const ReadFile = (targetFile: React.ChangeEvent<HTMLInputElement>) => {
    function CannotRead() {
      return postToast({
        style: ToastStyles.Error,
        title: "Cannot read form"
      });
    }

    if (targetFile.target.files == null) return CannotRead();

    const file = targetFile.target.files[0];
    console.log(file, targetFile.target.files)
    const fileType = file.type;
    function makeError() {
      return postToast({
        title: "Invalid JSON File",
        style: ToastStyles.Error
      });
    }

    if (fileType !== 'application/json') {
      makeError();
      //@ts-expect-error
      targetFile.target.value = null
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result != "string") return CannotRead();
      const json = JSON.parse(e.target.result);

      // Log for debugging purposes
      console.log(json)

      if (
        json?.forms == null ||
        !Array.isArray(json?.forms) ||
        json?.message == null ||
        typeof json?.message != "object"
      ) {
        return makeError();
      }

      setValue("forms", json.forms);
      const isEmbed = json.message?.embeds != null && json?.message?.embeds?.length >= 1;
      const isMessage = json.message?.content != null
      if (isEmbed && isMessage) setMessageType(MessageType.ContentAndEmbed);
      else if (isMessage) setMessageType(MessageType.Content);
      else if (isEmbed) setMessageType(MessageType.Embed);
      setValue("message", json.message);
      postToast({
        title: 'Form Uploaded',
        style: ToastStyles.Success
      });
    };

    reader.readAsText(file);
    return;
  }

  const downloadForm = () => {
    fixForm(false);
    setTimeout(() => {
      console.log("downloading...")
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(watch(), null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = getValues("forms")[0].modal.title.split(" ").map(e => e.toLowerCase()).join("_") + ".json";
      link.click();
    }, 500)
  }

  const ShowFixFormButton = useToggle();
  const [loading, setLoading] = useState(false);
  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
  }

  // useAutorun(() => {
  //   const json = JSON.stringify({
  //     forms: getValues("forms").map(form => {
  //       form.webhook_url = "hidden";
  //       return form;
  //     }),
  //     message: getValues("message")
  //   })
  //   const base64 = Buffer.from(json, 'binary');

  //   history.replaceState({ __N: false }, "", `/?data=${base64}`)
  // })

  return (
    <>
      <Meta>Home</Meta>
      <Navigation />
      <Grid gridTemplateColumns='1fr 1fr'>
        <VStack alignItems='flex-start' overflowY='scroll' p='16px' height='calc(100vh - 48px);'>
          <HStack>
            <Button onClick={() => {
              if (fileInput == null) {
                console.log("FILE_INPUT_NULLISH");
                return postToast({
                  title: "Something didn't go right.",
                  style: ToastStyles.Error
                });
              } else fileInput.click()
            }} variant="primary">Upload JSON</Button>
            <Input id="json" type="file" accept=".json" display="none" onChange={ReadFile} ref={(input) => {
              if (input == null) {
                console.log("SETTING_FILE_INPUT_NULLISH");
                return;
              } else setFileInput(input);
            }} />
            <Button variant="secondary" onClick={() => reset(ClearedValues)}>Clear All</Button>
            <Button onClick={onOpen}>Options</Button>
          </HStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor="#36393f">
              <ModalHeader _after={{
                borderBottom: "none"
              }} paddingBottom="3.5">Configuration</ModalHeader>
              <ModalCloseButton />
              <ModalBody paddingY={6}>
                <Box paddingBottom={5}>
                  <Heading size="sm" fontWeight="bold" paddingBottom={2}>Appearance</Heading>
                  {/* <Switch defaultChecked={useGetSetting("fix_form")} onChange={() => useSetSetting("fix_form", !useGetSetting("fix_form"))}>Show Fix Form Button</Switch> */}
                  <Toggle itemName='Show Fix Form Button' switchName={Switches.FixFormButton} {...ShowFixFormButton.toJSON()} />
                </Box>
                <Heading size="sm" fontWeight="bold" paddingBottom={2}>Developer Settings</Heading>
                {/* <Switch {...bindToInput(Settings, "ShowFixFormButton")}> Show Fix Form Button</Switch> */}
              </ModalBody>

              <ModalFooter backgroundColor="#2f3136" borderBottomRadius={5}>
                <Button variant="primary" mr={-2} onClick={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <MessageBuilder
            {...{ Defaults, formState, messageType, register, setMessageType, setValue }}
          />
          <FormBuilder
            {...{ control, register, defaultValues, getValues, setValue, formState, watch, displayForm, setDisplayForm }}
          />
          <VStack width='100%' align='flex-start'>
            <Heading size='sm' marginBottom='5px'>Form Configuration File</Heading>
            <Box>
              This is the configuration file you'll need to give to the <UserMention isFormsBot>Forms</UserMention> bot to create your form. The <UserMention isFormsBot>Forms</UserMention> bot needs to be in your server.
            </Box>
            <JSONViewer {...{ downloadForm }}>{JSON.stringify(watch(), null, 2)}</JSONViewer>
            <VStack alignItems='flex-start'>
              <HStack alignItems='flex-start'>
                <Button
                  variant='success'
                  disabled={!formState.isValid}
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
                {ShowFixFormButton.currentState && <Button onClick={() => fixForm()}>Fix Form</Button>}
              </HStack>
              {!formState.isValid && <ErrorMessage>Fill out the fields correctly before downloading the configuration file.</ErrorMessage>}
            </VStack>
            <Box>
              Upload the configuration file using the <SlashCommand>form create</SlashCommand> command on the <UserMention isFormsBot>Forms</UserMention> bot.
            </Box>
          </VStack>
          <Footer />
        </VStack>
        <Preview type={messageType} message={watch('message')} forms={watch('forms')} displayForm={displayForm} setDisplayForm={setDisplayForm} />
      </Grid>
    </>
  );
}
