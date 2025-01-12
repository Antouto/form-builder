import {
  Button,
  CloseButton,
  FormLabel,
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  Switch,
  HStack,
  Image,
  VStack,
  useColorMode,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderThumb,
  RangeSliderFilledTrack,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  Control,
  UseFormRegister,
  FieldValues,
  FormState,
  UseFormWatch,
  UseFormSetValue,
  UseFormResetField
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import { FormAndOpenFormTypeBuilder, ModalComponentBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import Counter from "./Counter";
import { getValue } from "@testing-library/user-event/dist/utils";

export interface TextInputBuilderProperties<T extends FieldValues> {
  nestIndex: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  resetField: UseFormResetField<T>;
  id?: string;
  compact?: boolean;
  pageIndex: number;
  textInputMaxLength: number;
}


export default function TextInputBuilder({
  nestIndex,
  control,
  register,
  formState: { errors },
  watch,
  setValue,
  resetField,
  //@ts-expect-error
  fixMessage,
  id,
  compact,
  pageIndex,
  //@ts-expect-error
  updateTextInputMaxLength,
  textInputMaxLength
}: TextInputBuilderProperties<FormAndOpenFormTypeBuilder>) {
  const { fields, remove, append, move, insert } = useFieldArray({
    control,
    name: `forms.${nestIndex}.pages.${pageIndex}.modal.components`
  });
  const [textInputStyle, setTextInputStyle] = React.useState([1, 1, 1, 1, 1])
  const isSmallScreen = !useScreenWidth(500);
  const isTinyScreen = !useScreenWidth(450);

  const colorMode = useColorMode().colorMode

  useEffect(() => fixMessage('message'), [])

  //@ts-expect-error
  function appendTextInput(data, k) {
    if (data) {
      insert(k + 1, data)
    } else {
      append({
        type: 1,
        components: [
          {
            type: 4,
            label: '',
            style: 1,
            max_length: 1024
          }
        ]
      });
    }
    setTimeout(() => {
      if (updateTextInputMaxLength !== undefined) updateTextInputMaxLength();
      fixMessage('message');
    }, 0);
  }

  if (true || compact) {
    return <VStack align='flex-start' id={id}>
      {fields.map((item, k) => {
        let textInput = watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0`) as ModalComponentBuilder;
        //@ts-expect-error
        let minimumLength = parseInt(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components[0].min_length`));
        //@ts-expect-error
        let maximumLength = parseInt(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components[0].max_length`));
        return (
          <Box key={item.id} width='100%'>
            <HStack gap={3} alignItems='flex-start'>
              <Box width='100%' >
                <ErrorMessage small error={errors?.forms?.[nestIndex]?.pages?.[pageIndex]?.modal?.components?.[k]?.components?.[0]?.label} />
                <Collapsible onlyToggleWithArrow name={<HStack width='100%'>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.label`, { required: true, maxLength: 45, onChange: () => fixMessage('message') })}
                      id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.label`}
                      defaultValue={textInput.label}
                      maxLength={45}
                      style={{ paddingRight: '40px', color: 'white', fontFamily: 'Whitney' }}
                    />
                    <Text style={{
                      fontFamily: 'Whitney',
                      fontSize: '12px',
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#bcbcbc',
                      pointerEvents: 'none'
                    }}>
                      {/* @ts-expect-error */}
                      {45 - watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.label`)?.length}
                    </Text>
                  </div>
                  <Tooltip
                    hasArrow
                    label={<Box>Move up</Box>}
                    placement="top"
                    bg="#181414"
                  >
                    <svg onClick={() => {
                      if (k !== 0) {
                        move(k, k - 1)
                      }
                    }} style={{ marginRight: '8px', cursor: k === 0 ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', transform: `rotate(0deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 10L8 6L4 10"
                        stroke={k === 0 ? '#666' : "#bcbcbc"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={<Box>Move down</Box>}
                    placement="top"
                    bg="#181414"
                  >
                    <svg onClick={() => {
                      if (k !== fields.length - 1) {
                        move(k, k + 1)
                      }
                    }} style={{ marginRight: '8px', cursor: k === fields.length - 1 ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', transform: `rotate(180deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 10L8 6L4 10"
                        stroke={k === fields.length - 1 ? '#666' : "#bcbcbc"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={<Box>Duplicate</Box>}
                    placement="top"
                    bg="#181414"
                  >

                    <svg style={{ marginRight: '8px' }} onClick={() => {
                      if (fields.length < 5) {
                        appendTextInput(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}`), k)
                      }
                    }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 10H2.5C1.67157 10 1 9.32845 1 8.50002L1 2.5C1 1.67157 1.67158 1 2.50001 1L8.5 1.00002C9.32843 1.00002 10 1.67159 10 2.50002V3.00002M13.4999 6.00008L7.49994 6.00006C6.67151 6.00006 5.99994 6.67164 5.99994 7.50006L5.99993 13.5001C5.99993 14.3285 6.67151 15.0001 7.49993 15.0001H13.4999C14.3284 15.0001 14.9999 14.3285 14.9999 13.5001V7.50008C14.9999 6.67165 14.3284 6.00008 13.4999 6.00008Z" stroke={fields.length === 5 ? '#666' : "#bcbcbc"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={<Box>Remove</Box>}
                    placement="top"
                    bg="#181414"
                  >
                    <svg onClick={() => {
                      if (fields.length !== 1) { remove(k) }
                    }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 3L3 13M3 3L13 13" stroke={fields.length === 1 ? '#666' : "#bcbcbc"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </Tooltip>

                </HStack>}>
                  <HStack mb='8px'  wrap="wrap">
                  <Box>
                        <FormLabel>Min</FormLabel>
                        <input
                          {...register(
                            `forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`,
                            {
                              valueAsNumber: true
                            }
                          )}
                          min="1"
                          max="1024"
                          onBlur={(event) => {
                            if(isNaN(parseInt(event.target.value)) || parseInt(event.target.value) < 1) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, undefined)
                            } else if (parseInt(event.target.value) > 1024) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, 1024)
                            }
                          }}
                          id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`}
                          type="number"
                          style={{ width: '60px' }}
                          inputMode="numeric"
                        />
                      </Box>
                      <Box>
                        <FormLabel>Max</FormLabel>
                        <input
                          {...register(
                            `forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`,
                            {
                              valueAsNumber: true
                            }
                          )}
                          min="0"
                          max="1024"
                          onBlur={(event) => {
                            if (isNaN(parseInt(event.target.value)) || parseInt(event.target.value) > 1024) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1024)
                            } else if (parseInt(event.target.value) < 1) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1)
                            }
                          }}
                          id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`}
                          type="number"
                          style={{ width: '60px' }}
                          inputMode="numeric"
                        />
                      </Box>
                      { watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`) && watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`) && (watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`) > watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`)) && <Box width="100%"><ErrorMessage>Min must be less than max</ErrorMessage></Box> }
                    <Box height='60px'>
                      <FormLabel margin={0}>Multiline</FormLabel>
                      <Controller
                        control={control}
                        name={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.style`}
                        render={({ field }) => (
                          <Switch
                            mt='7px'
                            onChange={event => {
                              console.log(event.target.checked)
                              field.onChange(event.target.checked ? 2 : 1);
                              console.log(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.style`))
                              // setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.style`, event.target.checked ? 2 : 1)
                              console.log(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.style`))

                              console.log('a', field.value, field.value === 1 ? false : true)


                              let newTextInputStyle = textInputStyle
                              newTextInputStyle[k] = event.target.checked ? 2 : 1
                              setTextInputStyle(newTextInputStyle)
                              fixMessage('message');
                            }}
                            isChecked={field.value === 1 ? false : true}
                            colorScheme='blurple'
                          />
                        )}
                      />
                    </Box>
                    <Box height='60px'>
                      <FormLabel margin={0}>Required</FormLabel>
                      <Controller
                        control={control}
                        name={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.required`}
                        render={({ field }) => (
                          <Switch
                            mt='7px'
                            onChange={event => { field.onChange(event); fixMessage('message') }}
                            colorScheme='blurple'
                            isChecked={field.value === false ? false : true}
                          />
                        )}
                      />
                    </Box>
                  </HStack>
                  <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`} display='flex' alignItems='center'><Text>Placeholder</Text>
                    <Counter count={textInput?.placeholder?.length || 0} max={100} />
                  </FormLabel>



                  <input
                    {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.placeholder`, { maxLength: 100, onChange: () => fixMessage('message') })}
                    id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.placeholder`}
                    style={{ marginRight: "25px", marginBottom: '8px' }}
                  />

                  <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].value`} display='flex' alignItems='center'>
                    <Text>Preset Value</Text>
                    <span
                      style={{
                        display: 'inline',
                        marginLeft: '7px',
                        fontSize: '13px',
                        //@ts-expect-error
                        color: (textInput?.value?.length !== 0 && (textInput?.value?.length < (Number.isNaN(minimumLength) ? 1 : minimumLength) || textInput?.value?.length > maximumLength)) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'),
                        fontFamily: 'Whitney Bold Italic'
                      }}
                    >
                      {!Number.isNaN(minimumLength) && minimumLength === maximumLength ? `Must be ${minimumLength} characters` : `Must be betweeen ${(Number.isNaN(minimumLength) ? 1 : minimumLength)} and ${maximumLength}`}
                    </span>
                  </FormLabel>
                  <Box
                    as={textInputStyle[k] === 1 ? 'input' : 'textarea'}
                    {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.value`, { minLength: minimumLength, maxLength: maximumLength, onChange: () => fixMessage('message') })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].value`}
                    style={{ marginRight: "25px", marginBottom: '8px' }}
                  />


                  <VStack width='100%' alignItems='flex-start' gap={8}>
                    {/* <HStack>
                    <Box>
                        <FormLabel>Minimum Characters</FormLabel>
                        <input
                          {...register(
                            `forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`,
                            {
                              valueAsNumber: true
                            }
                          )}
                          min="1"
                          max="1024"
                          onBlur={(event) => {
                            if(isNaN(parseInt(event.target.value)) || parseInt(event.target.value) < 1) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, undefined)
                            } else if (parseInt(event.target.value) > 1024) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, 1024)
                            }
                          }}
                          id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`}
                          type="number"
                          inputMode="numeric"
                        />
                      </Box>
                      <Box>
                        <FormLabel>Maximum Characters</FormLabel>
                        <input
                          {...register(
                            `forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`,
                            {
                              valueAsNumber: true
                            }
                          )}
                          min="0"
                          max="1024"
                          onBlur={(event) => {
                            if (isNaN(parseInt(event.target.value)) || parseInt(event.target.value) > 1024) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1024)
                            } else if (parseInt(event.target.value) < 1) {
                              //@ts-expect-error
                              setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1)
                            }
                          }}
                          id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`}
                          type="number"
                          inputMode="numeric"
                        />
                      </Box>
                    </HStack> */}

                    {/* <RangeSlider

                      width='99%' ml='.5%' defaultValue={[1, textInputMaxLength]} min={1} max={textInputMaxLength} onChange={(value) => {
                        //@ts-expect-error
                        setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, value[0])
                        if (value[0] === 1) resetField(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`)
                        //@ts-expect-error
                        value[1] ? setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, value[1]) : setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1)
                        fixMessage('message')
                      }}>
                      <RangeSliderTrack height='8px'>
                        <RangeSliderFilledTrack bg='blurple' />
                      </RangeSliderTrack>
                      <RangeSliderThumb {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, { min: 1, max: textInputMaxLength })} border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={0}><Text mb={14}>{watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`) || '1'}</Text></RangeSliderThumb>
                      <RangeSliderThumb border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={1}><Text mb={14}>{watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`)}</Text></RangeSliderThumb>
                    </RangeSlider> */}
                  </VStack>

                </Collapsible>

              </Box>

            </HStack>
          </Box>

        );
      })}
      <Button variant="primary" isDisabled={fields.length >= 5} onClick={() => {
        //@ts-expect-error
        appendTextInput()
      }}>Add Text Input</Button>
    </VStack>
  }

  return (
    <VStack align='flex-start' pl={3} pt={1} id={id}>
      {fields.map((item, k) => {
        let textInput = watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0`) as ModalComponentBuilder;
        //@ts-expect-error
        let minimumLength = parseInt(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components[0].min_length`));
        //@ts-expect-error
        let maximumLength = parseInt(watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components[0].max_length`));
        return (
          <Box key={item.id} width='100%'>
            <Collapsible name={`Text Input ${k + 1}${textInput?.label && textInput?.label?.match(/\S/) ? ` – ${textInput?.label}` : ''}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => {
              remove(k)
              updateTextInputMaxLength()
            }} /> : null} style={{ padding: 0 }}>
              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`} display='flex' alignItems='center'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: textInput?.label?.length > 45 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{textInput?.label?.length || 0}/45</span></FormLabel>
              <input
                {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.label`, { required: true, maxLength: 45, onChange: () => fixMessage('message') })}
                id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.label`}
                defaultValue={textInput.label}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <ErrorMessage error={errors?.forms?.[nestIndex]?.pages?.[pageIndex]?.modal?.components?.[k]?.components?.[0]?.label} />

              <HStack marginBottom='8px' gap={isTinyScreen ? 0 : 20} justifyContent={isTinyScreen ? 'space-between' : 'flex-start'}>
                <HStack>
                  <FormLabel margin={0}>Multiline</FormLabel>
                  <Controller
                    control={control}
                    name={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.style`}
                    render={({ field }) => (
                      <Switch
                        onChange={event => {
                          field.onChange(event.target.checked ? 2 : 1);
                          let newTextInputStyle = textInputStyle
                          newTextInputStyle[k] = event.target.checked ? 2 : 1
                          setTextInputStyle(newTextInputStyle)
                          fixMessage('message');
                        }}
                        isChecked={field.value === 1 ? false : true}
                        colorScheme='blurple'
                      />
                    )}
                  />
                </HStack>
                <HStack>
                  <FormLabel margin={0}>Required</FormLabel>
                  <Controller
                    control={control}
                    name={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.required`}
                    render={({ field }) => (
                      <Switch
                        onChange={event => { field.onChange(event); fixMessage('message') }}
                        colorScheme='blurple'
                        isChecked={field.value === false ? false : true}
                      />
                    )}
                  />
                </HStack>
              </HStack>

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`} display='flex' alignItems='center'><Text>Placeholder</Text>
                <Counter count={textInput?.placeholder?.length || 0} max={100} />
              </FormLabel>
              <input
                {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.placeholder`, { maxLength: 100, onChange: () => fixMessage('message') })}
                id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.placeholder`}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].value`} display='flex' alignItems='center'>
                <Text>Preset Value</Text>
                <span
                  style={{
                    display: 'inline',
                    marginLeft: '7px',
                    fontSize: '13px',
                    //@ts-expect-error
                    color: (textInput?.value?.length !== 0 && (textInput?.value?.length < (Number.isNaN(minimumLength) ? 1 : minimumLength) || textInput?.value?.length > maximumLength)) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'),
                    fontFamily: 'Whitney Bold Italic'
                  }}
                >
                  {!Number.isNaN(minimumLength) && minimumLength === maximumLength ? `Must be ${minimumLength} characters` : `Must be betweeen ${(Number.isNaN(minimumLength) ? 1 : minimumLength)} and ${maximumLength}`}
                </span>
              </FormLabel>
              <Box
                as={textInputStyle[k] === 1 ? 'input' : 'textarea'}
                {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.value`, { minLength: minimumLength, maxLength: maximumLength, onChange: () => fixMessage('message') })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].value`}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <HStack marginBottom='8px' alignItems='flex-start'>
                {/* <Box width='100%'>
                  <FormLabel display='flex' alignItems='center'><Text>Minimum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (minimumLength > maximumLength || minimumLength < 0 || minimumLength > 1024) ? (colorMode === 'dark' ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>Must be betweeen 1 and {maximumLength > 1024 ? 1024 : (maximumLength < 1 ? 0 : maximumLength || 1024)}</span></FormLabel>
                  <input
                    {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, { min: 0, max: 1024 })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].min_length`}
                    defaultValue={textInput.min_length}
                    //@ts-expect-error
                    onChange={(event) => event.target.valueAsNumber ? setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, event.target.valueAsNumber) : resetField(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`)}
                    type='number'
                    inputmode="numeric"
                    style={{ marginRight: "25px" }}
                  />
                </Box>
                <Box width='100%'>
                  <FormLabel display='flex' alignItems='center'><Text>Maximum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (maximumLength > 1024 || maximumLength < minimumLength || maximumLength < 1) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>Must be betweeen {minimumLength > 1024 ? 1024 : (minimumLength < 0 ? 1 : minimumLength || 1)} and 1024</span></FormLabel>
                  <input
                    {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, { min: 1, max: 1024 })}
                    id={`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`}
                    defaultValue={textInput.max_length}
                    //@ts-expect-error
                    onChange={(event) => setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, event.target.valueAsNumber || null)}
                    type='number'
                    inputmode="numeric"
                    style={{ marginRight: "25px" }}
                  />
                </Box> */}
                <VStack width='100%' alignItems='flex-start' gap={8}>
                  <FormLabel>Minimum to Maximum Character Range</FormLabel>
                  <RangeSlider

                    width='99%' ml='.5%' defaultValue={[1, textInputMaxLength]} min={1} max={textInputMaxLength} onChange={(value) => {
                      //@ts-expect-error
                      setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, value[0])
                      if (value[0] === 1) resetField(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`)
                      //@ts-expect-error
                      value[1] ? setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, value[1]) : setValue(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`, 1)
                      fixMessage('message')
                    }}>
                    <RangeSliderTrack height='8px'>
                      <RangeSliderFilledTrack bg='blurple' />
                    </RangeSliderTrack>
                    <RangeSliderThumb {...register(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`, { min: 1, max: textInputMaxLength })} border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={0}><Text mb={14}>{watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.min_length`) || '1'}</Text></RangeSliderThumb>
                    <RangeSliderThumb border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={1}><Text mb={14}>{watch(`forms.${nestIndex}.pages.${pageIndex}.modal.components.${k}.components.0.max_length`)}</Text></RangeSliderThumb>
                  </RangeSlider>
                </VStack>

              </HStack>
            </Collapsible>
          </Box>

        );
      })}
      <Button variant="primary" isDisabled={fields.length >= 5} onClick={() => {
        append({
          type: 1,
          components: [
            {
              type: 4,
              label: '',
              style: 1,
              max_length: 1024
            }
          ]
        });
        setTimeout(() => {
          updateTextInputMaxLength();
          fixMessage('message');
        }, 0);
      }}>Add Text Input</Button>
    </VStack>
  );
};
