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
  useFieldArray
} from "react-hook-form";
import { Embed, FormAndOpenFormTypeBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import EmbedBuilder from "./EmbedBuilder";
import Counter from "./Counter";
import ApplicationCommandBuilder from "./ApplicationCommandBuilder";
import MessageBuilder from "./MessageBuilder";

export interface Defaults {
  Message: string;
  Embed: Embed;
}

export interface OpenFormTypeBuilderProperties<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  formState: FormState<T>;
  Defaults: Defaults;
  openFormType: string;
  setOpenFormType: (type: string, setContent?: boolean) => void;
}

export default function OpenFormTypeBuilder({
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
  //@ts-expect-error
  watch,
  //@ts-expect-error
  formMessageComponents,
  //@ts-expect-error
  formMessageComponentsAppend,
  //@ts-expect-error
  formMessageComponentsRemove,
  //@ts-expect-error
  formMessageComponentsMove,
  //@ts-expect-error
  premium
}: OpenFormTypeBuilderProperties<FormAndOpenFormTypeBuilder>) {
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
          <MessageBuilder control={control} register={register} errors={errors} setValue={setValue} getValues={getValues} resetField={resetField} fixMessage={fixMessage} openFormType={openFormType} watch={watch} formMessageComponents={formMessageComponents} formMessageComponentsAppend={formMessageComponentsAppend} formMessageComponentsRemove={formMessageComponentsRemove} formMessageComponentsMove={formMessageComponentsMove} premium={premium}/>
        )}

        {openFormType === "application_command" && (
          <ApplicationCommandBuilder register={register} getValues={getValues} errors={errors}/>
        )}
      </Collapsible>
    </>
  );
}
