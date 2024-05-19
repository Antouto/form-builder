import { Box, Button, Text, FormLabel, HStack, Select, useColorMode, CloseButton, Input } from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import ErrorMessage from './ErrorMessage';

export default function PermissionOverwritesBuilder({ control, i, forPermissionOverwrite, register, errors, getValues, setValue, resetField, premium }: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: forPermissionOverwrite
  });
  const { colorMode } = useColorMode();

  function fixOverwrite(ii: number) {
    if (!getValues(`${forPermissionOverwrite}.${ii}.allow`)) resetField(`${forPermissionOverwrite}.${ii}.allow`)
    if (!getValues(`${forPermissionOverwrite}.${ii}.deny`)) resetField(`${forPermissionOverwrite}.${ii}.deny`)
  }

  return (
    <Box>
      {fields.map((permission_overwrite, ii) => <Collapsible key={permission_overwrite.id} name={`Overwrite ${ii + 1}`} deleteButton={<CloseButton isDisabled={!premium} onClick={() => remove(ii)} />}>
        <HStack>
          <Box>
            <FormLabel htmlFor={`${forPermissionOverwrite}.${ii}.type`} display='flex' alignItems='flex-end'>
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
                setValue(`${forPermissionOverwrite}.${ii}.type`, parseInt(event.target.value))
                fixOverwrite(ii)
              }}
              value={getValues(`${forPermissionOverwrite}.${ii}.type`)}
            >
              <option value="0">Role</option>
              <option value="1">Member</option>
            </Select>
          </Box>
          <Box width='calc(100% - 120px);'>
            <FormLabel htmlFor={`${forPermissionOverwrite}.${ii}.id`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>ID</Text>
            </FormLabel>
            <Input
              {...register(`${forPermissionOverwrite}.${ii}.id`, { required: true, pattern: /^(\d{10,20})|{.+}$/, onChange: () => fixOverwrite(ii) })}
              id={`${forPermissionOverwrite}.${ii}.id`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel?.permission_overwrites?.[ii]?.id} />
          </Box>
        </HStack>
        <HStack>
          <Box width='100%'>
            <FormLabel htmlFor={`${forPermissionOverwrite}.${ii}.allow`}>Allow</FormLabel>
            <Input
              {...register(`${forPermissionOverwrite}.${ii}.allow`, { pattern: /^\d+$/, onChange: () => fixOverwrite(ii) })}
              id={`${forPermissionOverwrite}.${ii}.allow`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}
            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel?.permission_overwrites?.[ii]?.allow} />
          </Box>
          <Box width='100%'>
            <FormLabel htmlFor={`${forPermissionOverwrite}.${ii}.deny`}>Deny</FormLabel>
            <Input
              {...register(`${forPermissionOverwrite}.${ii}.deny`, { pattern: /^\d+$/, onChange: () => fixOverwrite(ii) })}
              id={`${forPermissionOverwrite}.${ii}.deny`}
              isDisabled={!premium}
              height='36px'
              style={{ backgroundImage: 'linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))' }}
            />
            <ErrorMessage error={errors?.forms?.[i]?.submit_channel?.permission_overwrites?.[ii]?.deny} />
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
