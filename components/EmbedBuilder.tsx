import { FormLabel, Tooltip, Text, Box, Button, CloseButton, HStack, Stack } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import Collapsible from "./Collapsible";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { useScreenWidth } from "../util/width";
import Counter from "./Counter";

//@ts-expect-error
export default function EmbedBuilder({ control, register, errors, setValue, getValues, watch, resetField, fixMessage }) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: 'message.embeds'
  });

  const isSmallScreen = !useScreenWidth(500);

  function remove(index: number) {
    _remove(index)
    if (!getValues('message.embeds')?.length) {
      resetField('message.embeds')
    }
  }



  return <>
    <FormLabel
      htmlFor="message.embeds"
      display="flex"
      alignItems="center"
    >
      <Text>Embeds</Text>
      <Counter
        count={getValues(`message.embeds`)?.length}
        max={10}
      />
    </FormLabel>

    {Array.isArray(getValues('message.embeds')) ? fields.map((item, index) =>

      <>
        <Collapsible key={item.id} name={`Embed ${index + 1}${getValues('message.embeds')[index]?.title && getValues('message.embeds')[index]?.title.match(/\S/) ? ` – ${getValues('message.embeds')[index]?.title}` : ''}`} deleteButton={<CloseButton onClick={() => { remove(index); fixMessage(); }} />} style={{ padding: 0 }}>
          {/* Embed Author */}
          <Collapsible name="Author">
            {/* Embed Author Name */}
            <FormLabel htmlFor={`message.embeds.${index}.author.name`}>Author Name</FormLabel>
            <textarea {...register(`message.embeds.${index}.author.name`, { minLength: 1, maxLength: 256, onChange: () => fixMessage() })} id={`message.embeds.${index}.author.name`} />
            <Stack direction={isSmallScreen ? "column" : "row"}>
              {/* Embed Author Icon URL */}
              <Box width='100%'>
                <FormLabel htmlFor={`message.embeds.${index}.author.icon_url`}>Author Icon URL</FormLabel>
                <input {...register(`message.embeds.${index}.author.icon_url`, { minLength: 1, onChange: () => fixMessage() })} id={`message.embeds.${index}.author.icon_url`} />
              </Box>
              {/* Embed Author URL */}
              <Box width='100%'>
                <FormLabel htmlFor={`message.embeds.${index}.author.url`}>Author URL</FormLabel>
                <input {...register(`message.embeds.${index}.author.url`, { minLength: 1, onChange: () => fixMessage() })} id={`message.embeds.${index}.author.url`} />
              </Box>
            </Stack>
          </Collapsible >
          <hr />
          {/* Embed Title */}
          <FormLabel htmlFor={`message.embeds.${index}.title`}>Title</FormLabel>
          <textarea {...register(`message.embeds.${index}.title`, { minLength: 1, maxLength: 256, onChange: () => fixMessage() })} id={`message.embeds.${index}.title`} />
          {/* Embed Description */}
          <FormLabel htmlFor={`message.embeds.${index}.description`}>Description</FormLabel>
          <textarea style={{ height: '99px' }} {...register(`message.embeds.${index}.description`, { minLength: 1, maxLength: 4096, onChange: () => fixMessage() })} id={`message.embeds.${index}.description`} />
          {/* Embed Color */}
          <FormLabel htmlFor={`message.embeds.${index}.color`} display='flex' alignItems='center'>
            <Text mr={1} >Color</Text>
            <Box ml='7px' fontSize='12px' color='#dcddde' mt='2px'>Hex or Decimal format</Box>
          </FormLabel>
          {/* <input
              {...register(`message.embeds.${index}.color`, { onChange: () => fixMessage() })}
              type="number"
              id={`message.embeds.${index}.color`}
          /> */}
          <input
            {...register(`message.embeds.${index}.color`, {
              onChange: (e) => {
                if (!e.target.value.length) {
                  setValue(`message.embeds.${index}.color`, undefined, { shouldValidate: true })
                } else if (e.target.value.startsWith('#') && e.target.value.length === 7) {
                  setValue(`message.embeds.${index}.color`, parseInt(e.target.value.replace('#', ''), 16), { shouldValidate: true })
                } else {
                  setValue(`message.embeds.${index}.color`, parseInt(e.target.value))
                }
                
                // fixMessage()
              }, validate: (value: any) => {
                if(typeof value === 'undefined') return true
                if(parseInt(value) && parseInt(value) >= 0 && parseInt(value) <= 16777215) return true
                return false
              }
            })}
            id={`message.embeds.${index}.color`}
          />
          <ErrorMessage error={errors?.message?.embeds[index].color} />
          <hr />
          {/* Embed Image */}
          <FormLabel htmlFor={`message.embeds.${index}.image.url`}>Image URL</FormLabel>
          <input {...register(`message.embeds.${index}.image.url`, { minLength: 1, onChange: () => fixMessage() })} id={`message.embeds.${index}.image.url`} />
          <hr />
          {/* Embed Footer */}
          < Collapsible name="Footer">
            {/* Embed Footer Text */}
            < FormLabel htmlFor={`message.embeds.${index}.footer.text`} > Footer Text</FormLabel >
            <textarea {...register(`message.embeds.${index}.footer.text`, { minLength: 1, maxLength: 2048, onChange: () => fixMessage() })} id={`message.embeds.${index}.color`} />
            {/* Embed Footer Icon URL */}
            < FormLabel htmlFor={`message.embeds.${index}.footer.icon_url`} > Footer Image URL</FormLabel >
            <input {...register(`message.embeds.${index}.footer.icon_url`, { minLength: 1, onChange: () => fixMessage() })} id={`message.embeds.${index}.footer.icon_url`} />
          </Collapsible >

        </Collapsible>
        {!(getValues(`message.embeds.${index}.title`) || getValues(`message.embeds.${index}.description`) || getValues(`message.embeds.${index}.author.name`) || getValues(`message.embeds.${index}.image.url`) || getValues(`message.embeds.${index}.footer.text`)) && <ErrorMessage>Embed {index + 1} is empty</ErrorMessage>}
      </>
    ) : ''}
    <Button
      variant='primary'
      isDisabled={getValues('message.embeds')?.length >= 10}
      onClick={() => {
        append({
          color: 5793266
        })

        setTimeout(() => {
          setValue(`message.embeds.${getValues('message.embeds')?.length - 1}`, {
            color: 5793266
          })
        }, 1);
      }}
    >
      Add Embed
    </Button>
  </>
};