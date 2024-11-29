import {
  Box, Button, CloseButton, FormLabel, HStack, Input, Link, Select, Text, useColorMode, Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import Collapsible from './Collapsible';
import Counter from './Counter';
import ErrorMessage from './ErrorMessage';
import ButtonBuilder from './ButtonBuilder';
import PermissionOverwritesBuilder from './PermissionOverwritesBuilder';

export default function SubmitComponentsBuilder({ i, ii, control, getValues, resetField, setValue, register, errors, watch, premium, setPremiumFeatureTarget, onOpenPremium }: any) {
  const { fields, remove: _remove, append } = useFieldArray({
    control,
    name: `forms.${i}.submit_components.${ii}.components`
  });
  const colorMode = useColorMode().colorMode

  function remove(index: number) {
    _remove(index)
    if (!getValues(`forms.${i}.submit_components.${ii}.components`)?.length) {
      setValue(`forms.${i}.submit_components.${ii}.components`, undefined)
      resetField(`forms.${i}.submit_components.${ii}.components`)
    }
  }

  return (
    <>
      {fields.map((item, iii) => {
        const button = getValues(`forms[${i}].submit_components.${ii}.components.${iii}`)
        return <Collapsible key={item.id} name={`Button ${iii + 1}${button?.label && button?.label?.match(/\S/) ? ` – ${button?.label}` : ''}`} deleteButton={getValues(`forms[${i}].submit_components.${ii}.components`)?.length > 1 ? <CloseButton onClick={() => { remove(iii) }} /> : null}>
          {/* @ts-expect-error */}
          <HStack><ButtonBuilder forButton={`forms[${i}].submit_components.${ii}.components.${iii}`} error={errors.forms?.[i]?.submit_components?.[ii]?.components[iii]?.label} button={button} register={register} setValue={setValue} watch={watch} fix={() => { }} /></HStack>
          {/* <FormLabel>Button Logic</FormLabel> */}
          {/* <Collapsible name={'Logic'}> */}
          <FormLabel>Actions on click</FormLabel>
          <Menu isLazy>
            <MenuButton as={Button} variant='primary' mt={1} pr='0px' rightIcon={<svg style={{ marginRight: '8px', cursor: 'pointer', transition: 'transform 0.2s', transform: `rotate(180deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 10L8 6L4 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>}>
              Add
            </MenuButton>
            <MenuList bg='#181414' p='4px'>
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`, '')}>Add role to submitter</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`, '')}>Remove role from submitter</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`, '')}>Forward Submission</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL`, {})} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`)}>Send message to this channel</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE`, {})}>Send message to different channel</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`, {})} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`)}>Update button</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, {
                modal: {
                  title: "DM response to submitter",
                  components: [
                    {
                      type: 1,
                      components: [
                        {
                          type: 4,
                          style: 2,
                          label: "Message"
                        }
                      ]
                    }
                  ]
                },
                message: {
                  content: "{TextInputValue1}"
                }
              })}>DM response to submitter</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`, true)} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`)}>Remove other buttons in this row</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`, true)} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`)}>Delete this {getValues('forms')[i].submit_thread ? 'thread' : 'channel'}</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`, true)} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) || getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`)}>Delete this message</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`) === undefined && <MenuItem bg='#181414' _hover={{ background: '#5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`, {
                name: '🔒-{ChannelName}',
                permission_overwrites: [
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
                    deny: 2048
                  }
                ]
              })} isDisabled={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`)}>Update this {getValues('forms')[i].submit_thread ? 'thread' : 'channel'}</MenuItem>}
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) === undefined && <><MenuDivider /><MenuGroup title='Premium'>
              {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) === undefined && <MenuItem background='linear-gradient(to right, rgb(52, 66, 217), rgb(1, 118, 164))' backgroundClip='text' border='2px solid transparent' _hover={{ border: '2px solid #5865F2' }} borderRadius='4px' p='4px 10px' onClick={() => {
                if (!premium) {
                  setPremiumFeatureTarget('require_permissions')
                  onOpenPremium()
                  return;
                }
                setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, '')
              }}>Require permissions to use</MenuItem>}
              </MenuGroup></>}
            </MenuList>
          </Menu>
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Role ID - Add role to submitter</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`, { required: true, pattern: /^\d{10,20}$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`}
                type='string'
                inputmode="numeric"
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.ADD_ROLE_TO_SUBMITTER`, undefined) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.ADD_ROLE_TO_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Role ID - Remove role from submitter</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`, { required: true, pattern: /^\d{10,20}$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`}
                type='string'
                inputmode="numeric"
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ROLE_FROM_SUBMITTER`, undefined) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REMOVE_ROLE_FROM_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Channel ID - Forward Submission</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`, { required: true, pattern: /^\d{10,20}$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`}
                type='string'
                inputmode="numeric"
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.FORWARD_SUBMISSION`, undefined) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.FORWARD_SUBMISSION} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`) !== undefined && <Collapsible name={`Update this ${getValues('forms')[i].submit_thread ? 'thread' : 'channel'}`} deleteButton={<CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL`, undefined) }} />
          }>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.name`} display='flex' alignItems='flex-end'>
              <Text>Name</Text>
              <Counter count={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.name`)?.length} max={100} />
            </FormLabel>
            <Input
              {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.name`, { pattern: /^[^ _!"§$%&/()=]+$/, maxLength: 100 })}
              id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.name`}
              height='36px'
            />
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.UPDATE_THIS_CHANNEL?.name} />
            {!getValues('forms')[i].submit_thread && <>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites`}>Permission Overwrites</FormLabel>
            Use this <Link href='https://discordapi.com/permissions.html' target="_blank" rel="noopener noreferrer" color='#00b0f4'>permissions number generator</Link> for the allow and deny fields.
            <PermissionOverwritesBuilder control={control} i={i} forPermissionOverwrite={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites`} register={register} errors={errors} getValues={getValues} setValue={setValue} resetField={resetField} premium={premium} /> 
            </>}
          </Collapsible>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL.content`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Content - Send message to this channel</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL.content`, { required: true })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL.content`}
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE_TO_THIS_CHANNEL`, undefined) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REMOVE_ROLE_FROM_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE`) !== undefined && <Box>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.content`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Channel ID - Send message to differnt channel</Text>
            </FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.channel_id`, { required: true })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.channel_id`}
                type='string'
                inputmode="numeric"
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE`, undefined) }} />
            </HStack>
            <FormLabel htmlFor={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.message.content`} display='flex' alignItems='flex-end'>
              <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Content - Send message to different channel</Text>
            </FormLabel>
            <input
              {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.message.content`, { required: true })}
              id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.SEND_MESSAGE.message.content`}
            />
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REMOVE_ROLE_FROM_SUBMITTER} />
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`) !== undefined && <Box>
            {/* @ts-expect-error */}
            <HStack><ButtonBuilder forButton={`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`} error={errors.forms?.[i]?.submit_components?.[ii]?.components[iii]?.logic?.UPDATE_COMPONENT?.label} button={getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`)} buttonLabel={'Update Button Label'} buttonLabelRequired={'no'} buttonColourRequired={'no'} buttonColour={'Update Button Colour'} register={register} setValue={setValue} watch={watch} allowColourDeselect={true} resetField={resetField} getValues={getValues} fix={() => {
              if (getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT.label`) === '') setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT.label`, undefined)
            }} /> <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.UPDATE_COMPONENT`, undefined) }} /></HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`) !== undefined && <Box>
            <HStack>
              <FormLabel>User will be prompted to write a message - DM response to submitter</FormLabel>
              {/* <input
                  {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, { required: true, pattern: /^\d{10,20}$/ })}
                  id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`}
                /> */}
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DM_SUBMITTER_WITH_MODAL_INPUT`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`) && <Box>
            <HStack>
              <FormLabel>Remove other buttons in this row</FormLabel>
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`) && <Box>
            <HStack>
              <FormLabel>Delete this {getValues('forms')[i].submit_thread ? 'thread' : 'channel'}</FormLabel>
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_CHANNEL`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`) && <Box>
            <HStack>
              <FormLabel>Delete this message</FormLabel>
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.DELETE_THIS_MESSAGE`, undefined) }} />
            </HStack>
          </Box>}
          {getValues(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`) !== undefined && <Box>
            <FormLabel>Permissions Number - Require permissions to use</FormLabel>
            <HStack>
              <input
                {...register(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, { required: true, pattern: /^\d+$/ })}
                id={`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`}
                placeholder='8 for administrator'
              />
              <CloseButton onClick={() => { resetField(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`); setValue(`forms[${i}].submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, undefined) }} />
            </HStack>
            <ErrorMessage error={errors.forms?.[i]?.submit_components?.[ii].components?.[iii]?.logic?.REQUIRED_PERMISSIONS} />
            <Link href='https://discordapi.com/permissions.html' target="_blank" rel="noopener noreferrer" color='#00b0f4'>Discord Permissions Number Generator</Link>
          </Box>}
          {/* </Collapsible> */}
        </Collapsible>
      })}
      <Button isDisabled={fields.length >= 5} variant='primary' onClick={() => append({
        type: 2,
        label: 'Button',
        style: 1
      })}>Add Button</Button>
    </>
  )
}
