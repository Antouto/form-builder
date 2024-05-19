import { Box, Button, Text, FormLabel, HStack, Select, useColorMode, CloseButton, Input } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import ErrorMessage from './ErrorMessage';

export default function PermissionOverwritesBuilder({ control, i, register, errors, getValues, setValue, resetField, premium }: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms.${i}.submit_channel.permission_overwrites`
  });
  const { colorMode } = useColorMode();

  function fixOverwrite(ii: number) {
    if (!getValues(`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`)) resetField(`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`)
    if (!getValues(`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`)) resetField(`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`)
  }

  return (
    <Box>
      {fields.map((permission_overwrite, ii) => <Collapsible key={permission_overwrite.id} name={`Overwrite ${ii + 1}`} deleteButton={<CloseButton onClick={() => remove(ii)} />}>
        <HStack>
          <Box>
            <FormLabel htmlFor={`forms.${i}.submit_channel.permission_overwrites.${ii}.type`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Type</Text>
            </FormLabel>
            <Select
              isDisabled={!premium}
              height='36px'
              backgroundImage='linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))'
              width='120px'
              borderWidth="2px"
              borderColor="transparent"
              borderRadius="4px"
              border='1px solid rgba(255, 255, 255, 0.16)'
              // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
              _focus={{ outline: 'none' }}
              _focusVisible={{ outline: 'none' }}
              _hover={{ borderColor: "transparent" }}
              onChange={(event) => {
                setValue(`forms.${i}.submit_channel.permission_overwrites.${ii}.type`, parseInt(event.target.value))
                fixOverwrite(ii)
              }}
              value={getValues(`forms.${i}.submit_channel.permission_overwrites.${ii}.type`)}
            >
              <option value="0">Role</option>
              <option value="1">Member</option>
            </Select>
          </Box>
          <Box width='calc(100% - 120px);'>
            <FormLabel htmlFor={`forms.${i}.submit_channel.permission_overwrites.${ii}.id`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>ID</Text>
            </FormLabel>
            <Input
              {...register(`forms.${i}.submit_channel.permission_overwrites.${ii}.id`, { required: true, pattern: /^(\d{10,20})|{.+}$/, onChange: () => fixOverwrite(ii) })}
              id={`forms.${i}.submit_channel.permission_overwrites.${ii}.id`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel.permission_overwrites?.[ii]?.id} />
          </Box>
        </HStack>
        <HStack>
          <Box width='100%'>
            <FormLabel htmlFor={`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`}>Allow</FormLabel>
            <Input
              {...register(`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`, { pattern: /^\d+$/, onChange: () => fixOverwrite(ii) })}
              id={`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}
            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel.permission_overwrites?.[ii]?.allow} />
          </Box>
          <Box width='100%'>
            <FormLabel htmlFor={`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`}>Deny</FormLabel>
            <Input
              {...register(`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`, { pattern: /^\d+$/, onChange: () => fixOverwrite(ii) })}
              id={`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}
            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel.permission_overwrites?.[ii]?.deny} />
          </Box>
        </HStack>
      </Collapsible>)}
      <Button style={{ backgroundImage: 'linear-gradient(to right, rgb(52, 66, 217), rgb(1, 118, 164))' }} isDisabled={!premium}
        onClick={() => append({
          type: 0
        })}>Add Permission Overwrite</Button>
    </Box>
  )
}
