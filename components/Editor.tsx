/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Control, FieldValues, FormState, useForm, UseFormGetValues, UseFormRegister, UseFormReset, UseFormResetField, UseFormSetValue, UseFormWatch } from "react-hook-form";
import FormBuilder from "../components/FormBuilder";
import {
  Box,
  VStack,
  Button,
  Heading,
  useToast,
  HStack,
  Input,
  cssVar,
  Spinner,
  Text
} from '@chakra-ui/react';
import JSONViewer, { DOWNLOAD_SPINNER_TIME } from '../components/JSONViewer';
import ErrorMessage from '../components/ErrorMessage';
import MessageBuilder from './MessageBuilder';
import { SlashCommand, UserMention } from '../components/Mention';
import _ClearedValues from '../ClearedValues.json';
import { Footer } from '../components/Footer';
import { ButtonBuilder, FormAndMessageBuilder, ToastStyles } from "../util/types";
import { createName } from '../util/form';
import { useScreenWidth } from '../util/width';

const ClearedValues = _ClearedValues as FormAndMessageBuilder;

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
  resetField
}: EditorProps<FormAndMessageBuilder>) {
  const toast = useToast();

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


  const [fileInput, setFileInput] = useState<HTMLInputElement>();

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
      const json = JSON.parse(e.target.result) as FormAndMessageBuilder;

      // Log for debugging purposes
      console.log(json)

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

      if(json.forms[0].button) {
        setOpenFormType('button')
      } else if (json.forms[0].select_menu_option) {
        setOpenFormType('select_menu')
      }
        else if (json.application_command) {
        setOpenFormType('application_command')
      }

      if(!json.application_command) {
        // Check the number of button components and menu components
        // incase of a button modal and a select menu modal
        let buttons = 0;
        let menus = 0;
        json.forms.forEach(form => {
          if (form.select_menu_option != null) menus++;
          if (form.button != null) buttons++;
        });
  
        if (buttons < menus) {
          setOpenFormType('select_menu')
          json.forms.forEach((form, i) => {
            if (form.select_menu_option == null) {
              setValue(`forms.${i}.select_menu_option`, {
                label: "Select Menu Option",
                description: ""
              });
            }
  
            if (form.button != null) resetField(`forms.${i}.button`);
          });
        } else {
          setOpenFormType('button')
          json.forms.forEach((form, i) => {
            if (form.button == null) setValue(`forms.${i}.button`, {
              style: 1,
              label: "Open Form"
            });
  
            if (form.select_menu_option != null) resetField(`forms.${i}.select_menu_option`);
          });
        }
  
        // Add the json.message object to the form hook
        setValue("message", json.message);
      }


      // Send a toast the the user notifying that the form has
      // been uploaded
      postToast({
        title: 'Form Uploaded',
        style: ToastStyles.Success
      });
    };

    reader.readAsText(file);
    return;
  }

  const downloadForm = () => {
    setTimeout(() => {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(watch(), null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = createName({ getValues }) + ".json";
      link.click();
    }, 500)
  }

  const [loading, setLoading] = useState(false);
  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
  }

  const isSmallScreen = !useScreenWidth(500);

  const [openFormType, _setOpenFormType] = useState('button')

  //@ts-expect-error
  const setOpenFormType = (type) => {
    _setOpenFormType(type)
    switch(type) {
        case 'button':
            resetField('application_command');
            resetField('select_menu_placeholder');
            resetField('message')
            setTimeout(() => setValue('message', { content: 'Fill out the form below' }), 0.0001)

            getValues("forms").forEach((form, i) => {
                resetField(`forms.${i}.select_menu_option`)
                setValue(`forms.${i}.button`, {
                    label: '',
                    style: 1
                });
            });
            break;
        case 'select_menu':
            resetField('application_command');
            resetField('message')
            setTimeout(() => setValue('message', { content: 'Fill out the form below' }), 0.0001)
            getValues("forms").forEach((form, i) => {
                resetField(`forms.${i}.button`)
                setValue(`forms.${i}.select_menu_option`, {
                    label: form.modal.title,
                    description: ''
                });
            });
            break;
        case 'application_command':     
            resetField('message')
            getValues("forms").forEach((form, i) => {
                resetField(`forms.${i}.select_menu_option`)
                resetField(`forms.${i}.button`)
                setValue('application_command', {
                    name: ''
                })
            });
            break;
    }
  }

  return (
    <VStack align='flex-start' overflowY='scroll' p='16px' height='calc(100vh - 48px);' display={displaySection ? 'flex' : 'none'}>
      <HStack>
        <Button onClick={() => {
          if (fileInput == null) {
            return postToast({
              title: "Something didn't go right.",
              style: ToastStyles.Error
            });
          } else fileInput.click()
        }} variant="primary">Upload JSON</Button>
        <Input id="json" type="file" accept=".json" display="none" onChange={ReadFile} ref={(input) => {
          if (input != null) {
            setFileInput(input);
          }
        }} />
        <Button variant="secondary" onClick={() => reset(ClearedValues)}>Clear All</Button>
      </HStack>
      <MessageBuilder
        {...{ Defaults, getValues, resetField, control, formState, register, setValue, openFormType, setOpenFormType }}
      />
      <FormBuilder
        {...{ control, register, getValues, setValue, resetField, formState, watch, displayForm, setDisplayForm }}
      />
      <VStack width='100%' align='flex-start'>
        <Heading size='sm' marginBottom='5px'>Form Configuration File</Heading>
        <Box>
          This is the configuration file you'll need to give to the <UserMention isFormsBot>Forms</UserMention> bot to create your form. The <UserMention isFormsBot>Forms</UserMention> bot needs to be in your server.
        </Box>
        <JSONViewer {...{ downloadForm, getValues }}>{JSON.stringify(watch(), null, 2)}</JSONViewer>
        <VStack alignItems='flex-start'>
          <HStack alignItems='flex-start'>
            <Button
              variant='success'
              isDisabled={(!formState.isValid || watch('forms').length > (watch('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5) ))}
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
          </HStack>
          {(!formState.isValid || watch('forms').length > (watch('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5))) && <ErrorMessage>Fill out the fields correctly before downloading the configuration file.</ErrorMessage>}
        </VStack>
        <Box>
          Upload the configuration file using the <SlashCommand>form create</SlashCommand> command on the <UserMention isFormsBot>Forms</UserMention> bot.
        </Box>
      </VStack>
      {!isSmallScreen && <Footer />}
    </VStack>
  )
}
