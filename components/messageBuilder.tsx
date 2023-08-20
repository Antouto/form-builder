import { Box, FormLabel, HStack, Radio, RadioGroup, Stack, Text, VStack, Tooltip, Select, useColorMode, SelectField } from "@chakra-ui/react";
import { FieldValues, Control, UseFormRegister, FormState, UseFormWatch, UseFormSetValue, UseFormGetValues, useFieldArray, UseFormSetError } from "react-hook-form";
import { Embed, FormAndMessageBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import EmbedBuilder from "./EmbedBuilder";
import Counter from "./Counter";

export interface Defaults {
    Message: string;
    Embed: Embed;
}

export interface MessageBuilderProperties<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    getValues: UseFormGetValues<T>;
    formState: FormState<T>;
    Defaults: Defaults;
    openFormType: string;
    setOpenFormType: React.Dispatch<React.SetStateAction<string>>;
}

export default function MessageBuilder({
    register,
    formState: { errors },
    setValue,
    getValues,
    //@ts-expect-error
    resetField,
    Defaults,
    //@ts-expect-error
    control,
    openFormType,
    setOpenFormType
}: MessageBuilderProperties<FormAndMessageBuilder>) {
    const colorMode = useColorMode().colorMode

    return (
        <>
            <HStack >
                <FormLabel whiteSpace='nowrap' m={0}>Open form using</FormLabel>
                <Select
                    height='24px!important'
                    borderWidth='2px'
                    borderColor='transparent'
                    borderRadius='4px'
                    bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                    _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                    _hover={{ borderColor: 'transparent' }}
                    onChange={(event) => setOpenFormType(event.target.value)}
                    value={openFormType}
                >
                    <option value="button">Buttons</option>
                    <option value="application_command">Slash Command</option>
                    <option value="select_menu">Select Menu</option>
                </Select>
            </HStack>
            <Collapsible variant='large' name={(openFormType === 'button' || openFormType === 'select_menu')? 'Message' : 'Slash Command'}>
            {(openFormType === 'button' || openFormType === 'select_menu') &&
                <VStack align='flex-start' width='100%' marginBottom="8px">
                    <FormLabel htmlFor="message.content">Message</FormLabel>
                    <textarea style={{ height: '99px' }} {...register('message.content')} id='message.content' />
                    <EmbedBuilder {...{ control, register, errors, setValue, getValues, resetField }}/>
                    {openFormType === 'select_menu' && <Box width='100%'>
                        <FormLabel htmlFor="select_menu_placeholder">Select Menu Placeholder</FormLabel>
                        {/* @ts-expect-error */}
                        <input {...register('select_menu_placeholder', { required: false })} maxLength='100' placeholder="Select a form" id='select_menu_placeholder' />
                    </Box>}

                </VStack>
            }
            

            {openFormType === 'application_command' && <>
                <FormLabel htmlFor={'application_command.name'} display='flex' alignItems='flex-end'>
                    <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Name</Text>
                    <Counter count={getValues('application_command')?.name?.length} max={32}/>
                </FormLabel>
                <input {...register('application_command.name', { required: true, pattern: /^[-_\p{Ll}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u, maxLength: 32 }) } id='application_command.name' />
                <ErrorMessage error={errors?.application_command?.name}/>
                <FormLabel htmlFor={'application_command.description'} display='flex' alignItems='flex-end'>
                    <Text>Description</Text>
                    <Counter count={getValues('application_command')?.description?.length} max={100}/>
                </FormLabel>
                <input {...register('application_command.description', { maxLength: 100 }) } id='application_command.description' />
                <ErrorMessage error={errors?.application_command?.description}/>
                </>
            }</Collapsible>
            </>
    );
}
