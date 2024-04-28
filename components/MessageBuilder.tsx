import {
  Box,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Tooltip,
  Select,
  useColorMode,
  SelectField,
} from "@chakra-ui/react";
import {
  FieldValues,
  Control,
  UseFormRegister,
  FormState,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
  useFieldArray,
} from "react-hook-form";
import { Embed, FormAndMessageBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import EmbedBuilder from "./EmbedBuilder";
import Counter from "./Counter";
import ApplicationCommandBuilder from "./ApplicationCommandBuilder";

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
  setOpenFormType: (type: string, setContent?: boolean) => void;
}

export default function MessageBuilder({
  register,
  formState: { errors },
  setValue,
  getValues,
  //@ts-expect-error
  resetField,
  //@ts-expect-error
  control,
  openFormType,
  setOpenFormType,
  //@ts-expect-error
  fixMessage,
}: MessageBuilderProperties<FormAndMessageBuilder>) {
  const colorMode = useColorMode().colorMode;

  return (
    <>
      <HStack>
        <FormLabel whiteSpace="nowrap" m={0}>
          Open form using
        </FormLabel>
        <Select
          height="24px!important"
          borderWidth="2px"
          borderColor="transparent"
          borderRadius="4px"
          bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
          _focus={{ borderWidth: "2px", borderColor: "blurple" }}
          _hover={{ borderColor: "transparent" }}
          onChange={(event) => setOpenFormType(event.target.value)}
          value={openFormType}
        >
          <option value="button">Buttons</option>
          <option value="application_command">Slash Command</option>
          <option value="select_menu">Select Menu</option>
        </Select>
      </HStack>
      <Collapsible
        variant="large"
        name={
          openFormType === "button" || openFormType === "select_menu"
            ? "Message"
            : "Slash Command"
        }
      >
        {(openFormType === "button" || openFormType === "select_menu") && (
          <VStack align="flex-start" width="100%" marginBottom="8px">
            <FormLabel htmlFor="message.content">Message</FormLabel>
            <textarea
              style={{ height: "99px" }}
              {...register("message.content", { onChange: () => fixMessage() })}
              id="message.content"
            />
            <EmbedBuilder
              {...{
                control,
                register,
                errors,
                setValue,
                getValues,
                resetField,
                fixMessage,
              }}
            />
            {openFormType === "select_menu" && (
              <Box width="100%">
                <FormLabel htmlFor="select_menu_placeholder">
                  Select Menu Placeholder
                </FormLabel>
                <input
                  {...register("select_menu_placeholder", { required: false })}
                  maxLength={100}
                  placeholder="Select a form"
                  id="select_menu_placeholder"
                />
              </Box>
            )}
          </VStack>
        )}

        {openFormType === "application_command" && (
          <ApplicationCommandBuilder register={register} getValues={getValues} errors={errors}/>
        )}
      </Collapsible>
    </>
  );
}
