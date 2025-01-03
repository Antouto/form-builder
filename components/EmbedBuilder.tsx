import { FormLabel, Tooltip, Text, Box, Button, CloseButton, HStack, Stack } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import Collapsible from "./Collapsible";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { useScreenWidth } from "../util/width";
import Counter from "./Counter";
import EmbedFieldBuilder from "./EmbedFieldBuilder";

//@ts-expect-error
export default function EmbedBuilder({ control, register, errors, setValue, getValues, watch, resetField, fixMessage, forMessage }) {
  const forEmbeds = `${forMessage}.embeds`
  
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: forEmbeds
  });

  const isSmallScreen = !useScreenWidth(500);

  function remove(index: number) {
    _remove(index)
    if (!getValues(forEmbeds)?.length) {
      resetField(forEmbeds)
      setValue(forEmbeds, undefined)
    }
  }

  return <>
    <FormLabel
      htmlFor={forEmbeds}
      display="flex"
      alignItems="center"
    >
      <Text>Embeds</Text>
      <Counter
        count={getValues(forEmbeds)?.length}
        max={10}
      />
    </FormLabel>

    {Array.isArray(getValues(forEmbeds)) ? fields.map((item, index) =>

      <>
        <Collapsible key={item.id} name={`Embed ${index + 1}${getValues(forEmbeds)[index]?.title && getValues(forEmbeds)[index]?.title?.match(/\S/) ? ` – ${getValues(forEmbeds)[index]?.title}` : ''}`} deleteButton={<CloseButton onClick={() => { remove(index); fixMessage(forMessage); }} />} style={{ padding: 0 }}>
          {/* Embed Author */}
          <Collapsible name="Author">
            {/* Embed Author Name */}
            <FormLabel htmlFor={`${forEmbeds}.${index}.author.name`}>Author Name</FormLabel>
            <textarea {...register(`${forEmbeds}.${index}.author.name`, { minLength: 1, maxLength: 256, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.author.name`} />
            <Stack direction={isSmallScreen ? "column" : "row"}>
              {/* Embed Author Icon URL */}
              <Box width='100%'>
                <FormLabel htmlFor={`${forEmbeds}.${index}.author.icon_url`}>Author Icon URL</FormLabel>
                <input {...register(`${forEmbeds}.${index}.author.icon_url`, { minLength: 1, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.author.icon_url`} />
              </Box>
              {/* Embed Author URL */}
              <Box width='100%'>
                <FormLabel htmlFor={`${forEmbeds}.${index}.author.url`}>Author URL</FormLabel>
                <input {...register(`${forEmbeds}.${index}.author.url`, { minLength: 1, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.author.url`} />
              </Box>
            </Stack>
          </Collapsible >
          <hr />
          <Collapsible name="Body">
            {/* Embed Title */}
            <FormLabel htmlFor={`${forEmbeds}.${index}.title`}>Title</FormLabel>
            <textarea {...register(`${forEmbeds}.${index}.title`, { minLength: 1, maxLength: 256, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.title`} />
            {/* Embed Description */}
            <FormLabel htmlFor={`${forEmbeds}.${index}.description`}>Description</FormLabel>
            <textarea style={{ height: '99px' }} {...register(`${forEmbeds}.${index}.description`, { minLength: 1, maxLength: 4096, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.description`} />
            {/* Embed Color */}
            {/* <FormLabel htmlFor={`${forEmbeds}.${index}.color`} display='flex' alignItems='center'>
              <Text mr={1} >Color</Text>
              <Box ml='7px' fontSize='12px' color='#dcddde' mt='2px'>Hex or Decimal format</Box>
            </FormLabel> */}
            {/* <input
                {...register(`${forEmbeds}.${index}.color`, { onChange: () => fixMessage(forMessage) })}
                type="number"
                id={`${forEmbeds}.${index}.color`}
            /> */}
            {/* <input
              {...register(`${forEmbeds}.${index}.color`, {
                onChange: (e: any) => {
                  if (!e.target.value.length) {
                    setValue(`${forEmbeds}.${index}.color`, undefined, { shouldValidate: true })
                  } else if (e.target.value.startsWith('#') && e.target.value.length === 7) {
                    setValue(`${forEmbeds}.${index}.color`, parseInt(e.target.value.replace('#', ''), 16), { shouldValidate: true })
                  } else {
                    setValue(`${forEmbeds}.${index}.color`, parseInt(e.target.value))
                  }
                  
                  // fixMessage(forMessage)
                }, validate: (value: any) => {
                  if(typeof value === 'undefined') return true
                  if(parseInt(value) && parseInt(value) >= 0 && parseInt(value) <= 16777215) return true
                  return false
                }
              })}
              id={`${forEmbeds}.${index}.color`}
            />
            <ErrorMessage error={errors?.message?.embeds?.[index]?.color} /> */}
            
            {/* Embed Image */}
            <FormLabel htmlFor={`${forEmbeds}.${index}.image.url`}>Image URL</FormLabel>
            <input {...register(`${forEmbeds}.${index}.image.url`, { minLength: 1, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.image.url`} />
          </Collapsible>
          <hr />
          <Collapsible name="Fields">
              <EmbedFieldBuilder control={control} register={register} forFields={`${forEmbeds}.${index}.fields`} getValues={getValues} resetField={resetField} setValue={setValue}/>
          </Collapsible>
          <hr />
          {/* Embed Footer */}
          < Collapsible name="Footer">
            {/* Embed Footer Text */}
            < FormLabel htmlFor={`${forEmbeds}.${index}.footer.text`} > Footer Text</FormLabel >
            <textarea {...register(`${forEmbeds}.${index}.footer.text`, { minLength: 1, maxLength: 2048, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.color`} />
            {/* Embed Footer Icon URL */}
            < FormLabel htmlFor={`${forEmbeds}.${index}.footer.icon_url`} > Footer Image URL</FormLabel >
            <input {...register(`${forEmbeds}.${index}.footer.icon_url`, { minLength: 1, onChange: () => fixMessage(forMessage) })} id={`${forEmbeds}.${index}.footer.icon_url`} />
          </Collapsible >

        </Collapsible>
        {!(getValues(`${forEmbeds}.${index}.title`) || getValues(`${forEmbeds}.${index}.description`) || getValues(`${forEmbeds}.${index}.fields`)?.length || getValues(`${forEmbeds}.${index}.author.name`) || getValues(`${forEmbeds}.${index}.image.url`) || getValues(`${forEmbeds}.${index}.footer.text`)) && <ErrorMessage>Embed {index + 1} is empty</ErrorMessage>}
      </>
    ) : ''}
    <Button
      variant='primary-outline'
      isDisabled={getValues(forEmbeds)?.length >= 10}
      onClick={() => {
        append({
          color: 5793266
        })

        setTimeout(() => {
          setValue(`${forEmbeds}.${getValues(forEmbeds)?.length - 1}`, {
            // color: 5793266
          })
        }, 1);
      }}
    >
      Add Embed
    </Button>
  </>
};