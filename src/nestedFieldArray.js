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
  Image
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";

export default function useNestedFieldArray({ nestIndex, control, register, formState, formState: { errors }, watch }) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms[${nestIndex}].modal.components`
  });
  const [textInputStyle, setTextInputStyle] = React.useState(['1', '1', '1', '1', '1'])

  return (
    <div>
      {fields.map((item, k) => {
        let textInput = watch(`forms[${nestIndex}].modal.components[${k}].components[0]`)
        let minimumLength = parseInt(watch(`forms[${nestIndex}].modal.components[${k}].components[0].min_length`));
        let maximumLength = parseInt(watch(`forms[${nestIndex}].modal.components[${k}].components[0].max_length`));
        return (
          <Box key={item.id}>
            <Collapsible name={`Text Input ${k + 1}${textInput?.label && textInput?.label.match(/\S/) ? ` – ${textInput?.label}` : ''}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => remove(k)} /> : null} style={{ marginLeft: 20 }}>
              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: '#ff7a6b' }}>Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.label?.length > 45 || textInput?.label?.length < 1) ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{textInput?.label?.length || 0}/45</span></FormLabel>
              <input
                {...register(`forms[${nestIndex}].modal.components[${k}].components[0].label`, { required: true, maxLength: 45 })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].label`}
                defaultValue={item.label}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

              <HStack marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].style`} display='flex' alignItems='center'>
                    <Text>Style</Text>
                    <Tooltip hasArrow label={
                      <Box>
                        <Image src='https://cdn.discordapp.com/attachments/944646735643410482/975084229467729980/single_or_multiline_input.png' alt="Single or multiline input example" />
                      </Box>
                    } placement='top' shouldWrapChildren bg="white" borderRadius={6} padding={0} marginLeft={1} >
                      <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup onChange={(value) => {
                    let newTextInputStyle = textInputStyle
                    newTextInputStyle[k] = value
                    setTextInputStyle(newTextInputStyle)
                  }} value={textInputStyle[k]} id={`forms.${nestIndex}.modal.components.${k}.components.0.style`}>
                    <Stack direction="row">
                      <Radio
                        name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                        {...register(`forms[${nestIndex}].modal.components[${k}].components[0].style`)}
                        value="1"
                        colorScheme='blurple'
                      >
                        <Text>Singleline</Text>
                      </Radio>
                      <Radio
                        name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                        {...register(`forms[${nestIndex}].modal.components[${k}].components[0].style`)}
                        value="2"
                        colorScheme='blurple'
                      >
                        <Text>Multiline</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box width='100%'>
                  <FormLabel>Required</FormLabel>
                  <Controller
                    control={control}
                    name={`forms.${nestIndex}.modal.components.${k}.components.0.required`}
                    render={({ field }) => (
                      <Switch
                        onChange={(e) => field.onChange(e.target.checked)}
                        colorScheme='blurple'
                        isChecked={field.value}
                      />
                    )}
                  />
                </Box>
              </HStack>

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`} display='flex' alignItems='flex-end'><Text>Placeholder</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.placeholder?.length > 100) ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{textInput?.placeholder?.length || 0}/100</span></FormLabel>
              <input
                {...register(`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`, { maxLength: 100 })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`}
                defaultValue={item.placeholder}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].value`} display='flex' alignItems='flex-end'><Text>Preset Value</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.value?.length !== 0 && (Number.isNaN(minimumLength) || Number.isNaN(maximumLength) || minimumLength < 0 || minimumLength > 1024 || maximumLength < 1 || maximumLength > 1024 || textInput?.value?.length < minimumLength || textInput?.value?.length > maximumLength)) ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{(minimumLength <= maximumLength && minimumLength >= 0 && minimumLength <= 1024 && maximumLength >= 1 && maximumLength <= 1024) ? `Must be betweeen ${minimumLength < 1024 ? minimumLength : 1023} and ${maximumLength <= 1024 ? maximumLength : 1024}` : 'Invalid minimum/maximum characters, fix these first'}</span></FormLabel>
              <Box
                as={textInputStyle[k] === '1' ? 'input' : 'textarea'}
                {...register(`forms[${nestIndex}].modal.components[${k}].components[0].value`, { minLength: minimumLength, maxLength: maximumLength })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].value`}
                defaultValue={item.value}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <HStack marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel display='flex' alignItems='flex-end'><Text>Minimum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (Number.isNaN(minimumLength) || minimumLength > maximumLength || minimumLength < 0 || minimumLength > 1024) ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>Must be betweeen 0 and {maximumLength > 1024 ? 1024 : (maximumLength < 1 ? 0 : maximumLength || 1024)}</span></FormLabel>
                  <input
                    {...register(`forms[${nestIndex}].modal.components[${k}].components[0].min_length`, { min: 0, max: 1024 })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].min_length`}
                    defaultValue={item.min_length}
                    type='number'
                    style={{ marginRight: "25px" }}
                  />
                </Box>
                <Box width='100%'>
                  <FormLabel display='flex' alignItems='flex-end'><Text>Maximum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (Number.isNaN(maximumLength) || maximumLength > 1024 || maximumLength < minimumLength || maximumLength < 1) ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>Must be betweeen {minimumLength > 1024 ? 1024 : (minimumLength < 0 ? 1 : minimumLength || 1)} and 1024</span></FormLabel>
                  <input
                    {...register(`forms[${nestIndex}].modal.components[${k}].components[0].max_length`, { min: 1, max: 1024 })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].max_length`}
                    defaultValue={item.max_length}
                    type='number'
                    style={{ marginRight: "25px" }}
                  />
                </Box>
              </HStack>

              {/* <Controller
                control={control}
                name={`forms.${nestIndex}.modal.components.${k}.components.0.min`}
                render={({ field }) => (
                  <RangeSlider aria-label={['min', 'max']} min={1} max={1024} defaultValue={[1, 1024]} onChange={(val) => {
                    // field.onChange(e.target.checked);
                    setSliderValue(val)
                  }} margin='50px 30px 25px 30px' width='600px' maxWidth="86%" colorScheme='blurple'>
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>

                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                    <RangeSliderMark value={1} {...labelStyles} >1</RangeSliderMark>
                    <RangeSliderMark value={250} {...labelStyles} >250</RangeSliderMark>
                    <RangeSliderMark value={500} {...labelStyles} >500</RangeSliderMark>
                    <RangeSliderMark value={750} {...labelStyles} >750</RangeSliderMark>
                    <RangeSliderMark value={1024} {...labelStyles} >1024</RangeSliderMark>
                    <RangeSliderMark
                      value={sliderValue[0]}
                      textAlign='center'
                      bg='blurple'
                      color='white'
                      mt='-10'
                      ml='-8'
                      minWidth={sliderValue[0] > 955 ? '85px' : '0px'}
                      borderRadius='3px'
                      p='0px 6px'
                    >
                      Min: {sliderValue[0]}
                    </RangeSliderMark>
                    <RangeSliderMark
                      value={sliderValue[1]}
                      textAlign='center'
                      bg='blurple'
                      color='white'
                      mt='-10'
                      ml='-8'
                      minWidth={sliderValue[0] === sliderValue[1] ? '101px' : (sliderValue[1] > 947 ? '85px' : '0px')}
                      borderRadius='3px'
                      p='0px 6px'
                    >
                      {sliderValue[0] === sliderValue[1] ? `Exactly: ${sliderValue[1]}` : `Max: ${sliderValue[1]}`}
                    </RangeSliderMark>
                  </RangeSlider>
                )}
              /> */}



            </Collapsible>
            {k + 1 === fields.length || k + 1 === 0 ? null : <hr />}
          </Box>

        );
      })}
      <Button variant="primary" disabled={fields.length >= 5 ? true : false} onClick={() => append({
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
      })}>Add Text Input</Button>
    </div>
  );
};
