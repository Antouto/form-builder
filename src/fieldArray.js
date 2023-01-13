import { Box, Button, CloseButton, FormLabel, HStack, Select, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import NestedArray from "./nestedFieldArray";
import ErrorMessage from "./ErrorMessage";

export default function Fields({ control, register, setValue, getValues, formState, formState: { errors }, watch, displayForm, setDisplayForm }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms"
  });

  const [webhookUrlFocused, webhookUrlSetFocused] = React.useState(false)

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <Collapsible name={`Form ${index + 1}${getValues('forms')[index]?.modal.title && getValues('forms')[index]?.modal.title.match(/\S/) ? ` – ${getValues('forms')[index]?.modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => {
              remove(index)
              setDisplayForm(displayForm - 1)
            }} /> : null} key={item.id}>
              <FormLabel htmlFor={`forms[${index}].webhook_url`} display='flex' alignItems='center'>
                <Text marginRight='5px' _after={{ content: '" *"', color: '#ff7a6b' }}>Webhook URL</Text>
                <Tooltip hasArrow label={
                  <Box>
                    The webhook url to post submissions to. Keep this secret! You can create the webhook in channel settings, integrations tab for the channel you want to post the submission to.
                  </Box>
                } placement='right' shouldWrapChildren bg="#18191c" borderRadius={6} padding='4px 2px 4px 12px'>
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                </Tooltip>
              </FormLabel>
              <input
                {...register(`forms[${index}].webhook_url`, { required: true, pattern: /^https:\/\/((canary|ptb).)?discord(app)?.com\/api(\/v\d+)?\/webhooks\/\d{5,30}\/.+$/ })}
                id={`forms[${index}].webhook_url`}
                onFocus={() => webhookUrlSetFocused(true)}
                onBlur={() => webhookUrlSetFocused(false)}
                type={webhookUrlFocused ? 'text' : 'password'}
                placeholder='https://discord.com/api/webhooks/ ...'
                style={{ marginBottom: '8px' }}
              />
              <ErrorMessage>{(errors.forms?.[index]?.webhook_url?.type === 'required' && 'The Webhook URL is required') || (errors.forms?.[index]?.webhook_url?.type === 'pattern' && 'Invalid Webhook URL')}</ErrorMessage>
              <HStack marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: '#ff7a6b' }}>Button Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms')[index].button?.label?.length > 80 ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{getValues('forms')[index].button?.label?.length}/80</span></FormLabel>
                  <input
                    {...register(`forms[${index}].button.label`, { required: true, maxLength: 80 })}
                    id={`forms[${index}].button.label`}
                    placeholder='Open Form'
                  />
                  <ErrorMessage>{(errors.forms?.[index]?.button?.label?.type === 'required' && 'The Button Label is required') || (errors.forms?.[index]?.button?.label?.type === 'maxLength' && 'The Button Label is too long')}</ErrorMessage>
                </Box>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${index}].button.style`}>Button Style</FormLabel>
                  <Select {...register(`forms[${index}].button.style`)} id={`forms[${index}].button.style`} variant='unstyled'>
                    <option value="1">Blurple | Primary (CTA)</option>
                    <option value="2">Grey | Secondary</option>
                    <option value="3">Green | Primary (Success)</option>
                    <option value="4">Red | Danger/Destructive</option>
                  </Select>
                </Box>
              </HStack>

              <FormLabel htmlFor={`forms[${index}].modal.title`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: '#ff7a6b' }}>Title</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms')[index].modal.title?.length > 45 ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{getValues('forms')[index]?.modal.title?.length}/45</span></FormLabel>
              <input
                {...register(`forms[${index}].modal.title`, { required: true, maxLength: 45 })}
                id={`forms[${index}].modal.title`}
                style={{ marginBottom: '8px' }}
              />
              <ErrorMessage>{(errors.forms?.[index]?.modal?.title?.type === 'required' && 'The Title is required') || (errors.forms?.[index]?.modal?.title?.type === 'maxLength' && 'The Title is too long')}</ErrorMessage>
              <FormLabel marginTop='8px' htmlFor={`forms[${index}].modal.components`} >Text Inputs</FormLabel>
              <NestedArray id={`forms[${index}].modal.components`} nestIndex={index} {...{ control, register, formState, watch }} />
            </Collapsible>
          );
        })}
      </ul>

      <section>
        <Button
          variant='primary'
          disabled={getValues('forms').length >= 5 ? true : false}
          onClick={() => {
            setDisplayForm(fields.length)
            append({
              webhook_url: '',
              button: {
                label: '',
                style: '1'
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
                        style: '1',
                        placeholder: '',
                        min_length: '0',
                        max_length: '1024',
                        value: '',
                        required: true
                      }
                    ]
                  }
                ]
              }
            })
          }}
        >
          Add Form
        </Button>
      </section>
    </>
  );
}
