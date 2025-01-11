import {
  background,
  Box,
  Button,
  CloseButton,
  FormLabel,
  HStack,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Switch,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Control,
  FieldValues,
  FormState,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues,
  UseFormResetField,
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import TextInputBuilder from "./TextInputBuilder";
import ErrorMessage, { ErrorSeverity } from "./ErrorMessage";
import { FormAndOpenFormTypeBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import { useColorMode } from "@chakra-ui/react";
import Counter from "./Counter";
import ButtonBuilder from "./ButtonBuilder";
import WebhookURLInput from "./WebhookURLInput";
import FormTitleInput from "./FormTitleInput";
import ActionRowBuilder from "./ActionRowBuilder";
import SubmissionChannelIDInput from "./SubmissionChannelIDInput";
import PermissionOverwritesBuilder from "./PermissionOverwritesBuilder";
import PageBuilder from "./PageBuilder";
import MessageBuilder from "./MessageBuilder"
import { AiFillExclamationCircle } from "react-icons/ai";
import ReactSelect from "react-select";
import { RoleIcon } from "./Icons";
import Image from "next/image";
import PremiumFeatureTag from "./PremiumFeatureTag";

export interface FormBuilderProperties<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  resetField: UseFormResetField<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  premium: boolean;
}

export default function FormBuilder({
  control,
  register,
  setValue,
  getValues,
  resetField,
  formState,
  formState: { errors },
  watch,
  displayForm,
  setDisplayForm,
  //@ts-expect-error
  fixMessage,
  // handleCooldownChange,
  //@ts-expect-error
  webhookUrlFocused,
  //@ts-expect-error
  webhookUrlSetFocused,
  premium,
  //@ts-expect-error
  submissionType,
  //@ts-expect-error
  setSubmissionType,
  //@ts-expect-error
  submissionChannel,
  //@ts-expect-error
  setSubmissionChannel,
  //@ts-expect-error
  onOpenWhereDoIFindSubmissionChannelID,
  //@ts-expect-error
  fixSubmitChannel,
  //@ts-expect-error
  formMessageComponents,
  //@ts-expect-error
  formMessageComponentsAppend,
  //@ts-expect-error
  formMessageComponentsRemove,
  //@ts-expect-error
  openFormType,
  //@ts-expect-error
  displayPage,
  //@ts-expect-error
  setDisplayPage,
  //@ts-expect-error
  isOpenPremium,
  //@ts-expect-error
  onOpenPremium,
  //@ts-expect-error
  onClosePremium,
  //@ts-expect-error
  setPremiumFeatureTarget,
  //@ts-expect-error
  currentGuild,
  //@ts-expect-error
  cookieValue,
  //@ts-expect-error
  getGuild,
  //@ts-expect-error
  getGuilds,
  //@ts-expect-error
  stage,
  //@ts-expect-error
  setCookieValue,
  //@ts-expect-error
  loadingGuild,
  //@ts-expect-error
  setLoadingGuild,
  //@ts-expect-error
  onOpenAddToServer,
  //@ts-expect-error
  guilds,
  //@ts-expect-error
  currentGuildID,
  //@ts-expect-error
  setCurrentGuildID,
  //@ts-expect-error
  textInputMaxLength,
  //@ts-expect-error
  setTextInputMaxLength
}: FormBuilderProperties<FormAndOpenFormTypeBuilder>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
    rules: { minLength: 1 },
  });

  const isSmallScreen = !useScreenWidth(1240);
  const isReallySmallScreen = !useScreenWidth(400);
  const colorMode = useColorMode().colorMode;

  const [temporaryDisablePremiumFields, setTemporaryDisablePremiumFields] = useState(false);

  const [
    formsThatNeedSubmitChannelIDString,
    setFormsThatNeedSubmitChannelIDString,
  ] = useState("");

  useEffect(() => {
    let formsThatNeedSubmitChannelID: number[] = [];
    console.log(formsThatNeedSubmitChannelID);
    fields.forEach((form, i) => {
      if (
        submissionChannel[i] === "existing" &&
        submissionType[i] === "bot" &&
        (formState.errors.forms?.[i]?.submit_channel_id ||
          !getValues(`forms.${i}.submit_channel_id`) ||
          getValues(`forms.${i}.submit_channel`))
      ) {
        formsThatNeedSubmitChannelID.push(i + 1);
      }
    });
    console.log(formsThatNeedSubmitChannelID);

    if (formsThatNeedSubmitChannelID.length) {
      if (formsThatNeedSubmitChannelID.length === 1) {
        setFormsThatNeedSubmitChannelIDString(
          ` ${formsThatNeedSubmitChannelID[0]} requires`
        );
      } else {
        const lastElement = formsThatNeedSubmitChannelID.pop();
        setFormsThatNeedSubmitChannelIDString(
          `s ${formsThatNeedSubmitChannelID.join(
            ", "
          )}, and ${lastElement} require`
        );
      }
    } else {
      setFormsThatNeedSubmitChannelIDString("");
    }
  }, [formState, fields, submissionChannel]);

  // function handleCooldownClick(index) {
  //   if (!premium) {
  //     setPremiumFeatureTarget('submission_cooldown')
  //     setCooldownDisabled(true)
  //     setTimeout(() => setCooldownDisabled(false), 1);
  //     onOpenPremium()
  //     handleCooldownChange(null, null, index)
  //     return;
  //   }
  // }

  return (
    <Box width="100%" pb={2}>
      <FormLabel display="flex" alignItems="center" pb={2}>
        <Text>Forms</Text>
        <Counter
          count={getValues("forms")?.length}
          max={
            getValues("application_command")
              ? 1
              : getValues("message") && getValues("forms.0.select_menu_option")
                ? 25
                : 5 -
                getValues("message.components.0.components")?.filter(
                  (component) => component.style === 5
                )?.length
          }
        />
      </FormLabel>
      {formsThatNeedSubmitChannelIDString && (
        <Box mb={4}>
          <ErrorMessage>
            <Text>
              Form{formsThatNeedSubmitChannelIDString} a Submission Channel.
            </Text>
          </ErrorMessage>
        </Box>
      )}
      <ul>
        {fields.map((item, index) => {
          return (
            <>
              <Collapsible
                name={`Form ${index + 1}${getValues("forms")[index]?.pages[0]?.modal.title &&
                  getValues("forms")[index]?.pages?.[0]?.modal.title?.match(
                    /\S/
                  )
                  ? ` – ${getValues("forms")[index]?.pages?.[0]?.modal.title}`
                  : ""
                  }`}
                variant="large"
                deleteButton={
                  getValues("forms").length > 1 ? (
                    <CloseButton
                      onClick={() => {
                        remove(index);

                        if (openFormType === "button") {
                          const formToDeleteIndex = getValues(
                            "message.components.0.components"
                          )?.findIndex(
                            (component) =>
                              component.custom_id &&
                              component.custom_id === `{FormID${index + 1}}`
                          );
                          formMessageComponentsRemove(formToDeleteIndex);
                          getValues("message.components.0.components").forEach(
                            (component, i) => {
                              if (
                                i >= formToDeleteIndex &&
                                component.custom_id &&
                                component.custom_id?.match(/\d+/)
                              ) {
                                setValue(
                                  `message.components.0.components.${i}.custom_id`,
                                  `{FormID${parseInt(
                                    //@ts-expect-error
                                    (component?.custom_id ?? "").match(
                                      /\d+/
                                    )[0]
                                  ) - 1
                                  }}`
                                );
                              }
                            }
                          );
                        }

                        setSubmissionType("delete", null, index);
                        setSubmissionChannel("delete", null, index);
                        setDisplayForm(displayForm - 1);
                      }}
                    />
                  ) : null
                }
                key={item.id}
              >
                <Collapsible
                  name={
                    <>
                      General
                      {(!(
                        watch(`forms.${index}.submit_channel_id`) ||
                        watch(`forms.${index}.webhook_url`)
                      ) ||
                        formState?.errors?.forms?.[index]?.submit_channel_id ||
                        formState?.errors?.forms?.[index]?.webhook_url) &&
                        !watch(`forms.${index}.submit_channel`) && (
                          <AiFillExclamationCircle
                            style={{ marginLeft: "4px" }}
                            color={colorMode === "dark" ? "#ff7a6b" : "#d92f2f"}
                          />
                        )}
                    </>
                  }
                >
                  <HStack wrap="wrap" mb="8px">
                    <FormLabel whiteSpace="nowrap" m={0}>
                      Send submissions using
                    </FormLabel>
                    <Select
                      backgroundImage="linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))"
                      height="24px!important"
                      width="fit-content"
                      borderWidth="2px"
                      borderColor="transparent"
                      borderRadius="4px"
                      // isDisabled={!premium}
                      border="1px solid rgba(255, 255, 255, 0.16)"
                      // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
                      _focus={{ outline: "none" }}
                      _focusVisible={{ outline: "none" }}
                      _hover={{ borderColor: "transparent" }}
                      onClick={() => {
                        if (!premium) {
                          setPremiumFeatureTarget("webhook_submissions");
                          onOpenPremium();
                          return;
                        }
                      }}
                      onChange={(event) => {
                        setSubmissionType("edit", event.target.value, index);
                      }}
                      value={submissionType[index]}
                    >
                      <option value="bot">Bot</option>
                      <option value="webhook">Webhook</option>
                    </Select>
                    {submissionType[index] === "bot" && (
                      <>
                        <FormLabel whiteSpace="nowrap" m={0}>
                          to
                        </FormLabel>
                        <Select
                          backgroundImage="linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))"
                          height="24px!important"
                          width="fit-content"
                          borderWidth="2px"
                          borderColor="transparent"
                          borderRadius="4px"
                          border="1px solid rgba(255, 255, 255, 0.16)"
                          // bg={colorMode === "dark" ? "grey.extradark" : "grey.extralight"}
                          _focus={{ outline: "none" }}
                          _focusVisible={{ outline: "none" }}
                          _hover={{ borderColor: "transparent" }}
                          onClick={() => {
                            if (!premium) {
                              setPremiumFeatureTarget("tickets");
                              onOpenPremium();
                              return;
                            }
                          }}
                          onChange={(event) => {
                            setSubmissionChannel(
                              "edit",
                              event.target.value,
                              index
                            );
                          }}
                          value={submissionChannel[index]}
                        >
                          <option value="existing">Existing Channel</option>
                          <option value="new">New Channel (For tickets)</option>
                          <option value="new_thread">
                            New Thread (For tickets)
                          </option>
                        </Select>
                      </>
                    )}
                  </HStack>

                  {submissionType[index] === "bot" &&
                    (submissionChannel[index] === "existing" ||
                      submissionChannel[index] === "new_thread") && (
                      <SubmissionChannelIDInput
                        index={index}
                        register={register}
                        errors={formState.errors}
                        watch={watch}
                        fixMessage={fixMessage}
                        onOpenWhereDoIFindSubmissionChannelID={
                          onOpenWhereDoIFindSubmissionChannelID
                        }
                        currentGuild={currentGuild}
                        getValues={getValues}
                        setValue={setValue}
                        cookieValue={cookieValue}
                        getGuild={getGuild}
                        getGuilds={getGuilds}
                        stage={stage}
                        setCookieValue={setCookieValue}
                        setLoadingGuild={setLoadingGuild}
                        onOpenAddToServer={onOpenAddToServer}
                        loadingGuild={loadingGuild}
                        guilds={guilds}
                        currentGuildID={currentGuildID}
                        setCurrentGuildID={setCurrentGuildID}
                      />
                    )}
                  {submissionType[index] === "webhook" && (
                    <WebhookURLInput
                      index={index}
                      register={register}
                      webhookUrlFocused={webhookUrlFocused}
                      webhookUrlSetFocused={webhookUrlSetFocused}
                      errors={formState.errors}
                      fixMessage={fixMessage}
                    />
                  )}
                  {submissionChannel[index] === "new" && (
                    <Collapsible name="New Channel">
                      <HStack
                        mb={2}
                        wrap={isReallySmallScreen ? "wrap" : "nowrap"}
                      >
                        <Box width="100%">
                          <FormLabel
                            htmlFor={`forms.${index}.submit_channel.name`}
                            display="flex"
                            alignItems="center"
                          >
                            <Text
                              _after={{
                                content: '" *"',
                                color:
                                  colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
                              }}
                            >
                              Name
                            </Text>
                            <Counter
                              count={
                                getValues("forms")[index].submit_channel?.name
                                  ?.length
                              }
                              max={100}
                            />
                          </FormLabel>
                          <Input
                            {...register(`forms.${index}.submit_channel.name`, {
                              required: true,
                              maxLength: 100,
                              pattern: /^[^ _!"§$%&/()=]+$/,
                              onChange: () => fixSubmitChannel(index),
                            })}
                            id={`forms.${index}.submit_channel.name`}
                            height="36px"
                          />

                          <ErrorMessage
                            error={errors.forms?.[index]?.submit_channel?.name}
                          />
                        </Box>
                        <Box width="100%">
                          <FormLabel
                            htmlFor={`forms.${index}.submit_channel.parent_id`}
                          >
                            Category ID
                          </FormLabel>
                          <input
                            {...register(
                              `forms.${index}.submit_channel.parent_id`,
                              {
                                pattern: /^\d{10,20}$/,
                                onChange: () => fixSubmitChannel(index),
                              }
                            )}
                            id={`forms.${index}.submit_channel.parent_id`}
                          />
                          <ErrorMessage
                            error={
                              errors.forms?.[index]?.submit_channel?.parent_id
                            }
                          />
                        </Box>
                        <Box>
                          <FormLabel
                            htmlFor={`forms.${index}.submit_channel.nsfw`}
                          >
                            NSFW
                          </FormLabel>
                          <Switch
                            //@ts-expect-error
                            {...register(`forms.${index}.submit_channel.nsfw`)}
                            colorScheme="blurple"
                          />
                        </Box>
                      </HStack>
                      <FormLabel
                        htmlFor={`forms.${index}.submit_channel.permission_overwrites`}
                      >
                        Permission Overwrites
                      </FormLabel>
                      Use this{" "}
                      <Link
                        href="https://discordapi.com/permissions.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="#00b0f4"
                      >
                        permissions number generator
                      </Link>{" "}
                      for the allow and deny fields.
                      <PermissionOverwritesBuilder
                        control={control}
                        i={index}
                        forPermissionOverwrite={`forms.${index}.submit_channel.permission_overwrites`}
                        register={register}
                        errors={errors}
                        getValues={getValues}
                        setValue={setValue}
                        resetField={resetField}
                        premium={premium}
                      />
                    </Collapsible>
                  )}
                  {submissionChannel[index] === "new_thread" && (
                    <Collapsible name="New Thread">
                      <HStack mb={2} wrap={isSmallScreen ? "wrap" : "nowrap"}>
                        <Box width="60%">
                          <FormLabel
                            htmlFor={`forms.${index}.submit_thread.name`}
                            display="flex"
                            alignItems="center"
                          >
                            <Text
                              _after={{
                                content: '" *"',
                                color:
                                  colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
                              }}
                            >
                              Name
                            </Text>
                            <Counter
                              count={
                                getValues("forms")[index].submit_thread?.name
                                  ?.length
                              }
                              max={100}
                            />
                          </FormLabel>
                          <Input
                            {...register(`forms.${index}.submit_thread.name`, {
                              required: true,
                              maxLength: 100,
                              pattern: /^[^ _!"§$%&/()=]+$/,
                            })}
                            id={`forms.${index}.submit_thread.name`}
                            height="36px"
                          />

                          <ErrorMessage
                            error={errors.forms?.[index]?.submit_thread?.name}
                          />
                        </Box>
                        {/* <Box width='100%'>
                      <FormLabel htmlFor={`forms.${index}.submit_channel.parent_id`}>Category ID</FormLabel>
                      <input
                        //@ts-expect-error
                        {...register(`forms.${index}.submit_channel.parent_id`, { pattern: /^\d{10,20}$/, onChange: () => fixSubmitChannel(index) })}
                        id={`forms.${index}.submit_channel.parent_id`}
                      /> */}
                        {/* @ ts-expect-error */}
                        {/* <ErrorMessage error={errors.forms?.[index]?.submit_channel?.parent_id} />
                    </Box> */}
                        <Box>
                          <FormLabel
                            htmlFor={`forms.${index}.submit_thread.add_submitter`}
                          >
                            Add submitter
                          </FormLabel>
                          <Switch
                            {...register(
                              `forms.${index}.submit_thread.add_submitter`,
                              {
                                onChange: (e) => {
                                  setValue(
                                    `forms.${index}.submit_thread.add_submitter`,
                                    e.target.checked ? true : undefined
                                  );
                                },
                              }
                            )}
                            colorScheme="blurple"
                          />
                        </Box>
                        <Box>
                          <FormLabel
                            htmlFor={`forms.${index}.submit_thread.type`}
                          >
                            Private
                          </FormLabel>
                          <Switch
                            checked={watch(`forms.${index}.submit_thread.type`) === 12}
                            onChange={(e) => {
                              const newValue = e.target.checked ? 12 : 11;
                              setValue(`forms.${index}.submit_thread.type`, newValue, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true
                              });
                              if (!e.target.checked) {
                                setValue(`forms.${index}.submit_thread.invitable`, undefined);
                              }
                            }}
                            colorScheme="blurple"
                          />
                        </Box>
                      </HStack>
                      {watch(`forms.${index}.submit_thread.type`) === 12 && (
                        <Box>
                          <FormLabel
                            htmlFor={`forms.${index}.submit_thread.invitable`}
                          >
                            Anyone can add people to the thread
                          </FormLabel>
                          <Switch
                            {...register(
                              `forms.${index}.submit_thread.invitable`,
                              {
                                onChange: (e) => {
                                  setValue(
                                    `forms.${index}.submit_thread.invitable`,
                                    e.target.checked ? undefined : false
                                  );
                                },
                              }
                            )}
                            colorScheme="blurple"
                            defaultChecked
                          />
                        </Box>
                      )}
                    </Collapsible>
                  )}

                  <FormLabel mt={2} htmlFor={`forms[${index}].google_sheets_url`} display='flex' alignItems='center'>
                    <HStack mb={2}>
                      <Image src="sheets.png" alt="" width='16' height='16' />
                      <Text>Google Sheet URL</Text>
                      <PremiumFeatureTag/>
                    </HStack>
                  </FormLabel>
                  <input
                    {...register(`forms.${index}.google_sheets_url`, { pattern: /^https:\/\/docs.google.com\/spreadsheets\/.+/ })}
                    id={`forms[${index}].google_sheets_url`}
                    inputMode="url"
                    onClick={() => {
                      if (!premium) {
                        setPremiumFeatureTarget("google_sheets");
                        setTemporaryDisablePremiumFields(true);
                        setTimeout(() => setTemporaryDisablePremiumFields(false), 1);
                        onOpenPremium();
                        return;
                      }
                    }}
                    disabled={!premium && temporaryDisablePremiumFields}
                    placeholder='https://docs.google.com/spreadsheets/ ...'
                    style={{ marginBottom: '8px' }}
                  />
                  <ErrorMessage error={errors.forms?.[index]?.google_sheets_url} />
                  <Text>To send submissions to a google sheet, share a new google sheet with submissions@discordforms.iam.gserviceaccount.com and grant edit permissions.</Text>
                  <Stack
                    direction={isSmallScreen ? "column" : "row"}
                    marginBottom="8px"
                    alignItems="flex-start"
                  >
                    <Stack
                      direction={isReallySmallScreen ? "column" : "row"}
                      width="100%"
                    >
                      {watch("forms.0.select_menu_option") && (
                        <>
                          <Box width="100%">
                            <FormLabel
                              htmlFor={`forms.${index}.select_menu_option.label`}
                              display="flex"
                              alignItems="center"
                            >
                              <Text
                                _after={{
                                  content: '" *"',
                                  color:
                                    colorMode === "dark"
                                      ? "#ff7a6b"
                                      : "#d92f2f",
                                }}
                              >
                                Select Menu Option Label
                              </Text>
                              <Counter
                                count={
                                  getValues("forms")[index].select_menu_option
                                    ?.label?.length
                                }
                                max={100}
                              />
                            </FormLabel>
                            <input
                              {...register(
                                `forms.${index}.select_menu_option.label`,
                                {
                                  required: true,
                                  maxLength: 100,
                                  onChange: () => fixMessage('message'),
                                }
                              )}
                              id={`forms.${index}.select_menu_option.label`}
                              placeholder="Form"
                            />
                            <ErrorMessage
                              error={
                                errors.forms?.[index]?.select_menu_option?.label
                              }
                            />
                          </Box>
                          <Box width="100%">
                            <FormLabel
                              htmlFor={`forms.${index}.select_menu_option.description`}
                              display="flex"
                              alignItems="center"
                            >
                              <Text>Select Menu Option Description</Text>
                              <Counter
                                count={
                                  getValues("forms")[index].select_menu_option
                                    ?.description?.length
                                }
                                max={100}
                              ></Counter>
                            </FormLabel>
                            <input
                              {...register(
                                `forms.${index}.select_menu_option.description`,
                                { maxLength: 100, onChange: () => fixMessage('message') }
                              )}
                              id={`forms.${index}.select_menu_option.description`}
                            />
                            <ErrorMessage
                              error={
                                errors.forms?.[index]?.select_menu_option
                                  ?.description
                              }
                            />
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Stack>

                  {watch("forms.0.select_menu_option") && (
                    <Box width="100%">
                      <FormLabel
                        htmlFor={`forms.${index}.select_menu_option.emoji.id`}
                        display="flex"
                        alignItems="center"
                      >
                        Select Menu Option Emoji ID
                      </FormLabel>
                      <input
                        {...register(
                          `forms.${index}.select_menu_option.emoji.id`,
                          {
                            maxLength: 100,
                            pattern: /^\d{10,20}$/,
                            onChange: () => fixMessage('message'),
                          }
                        )}
                        id={`forms.${index}.select_menu_option.emoji.id`}
                        type="number"
                        inputMode="numeric"
                      />
                      <ErrorMessage
                        error={
                          errors.forms?.[index]?.select_menu_option?.emoji?.id
                        }
                      />
                    </Box>
                  )}

                  <Box>
                    <FormLabel
                      htmlFor={`forms.${index}.cooldown`}
                      display="flex"
                      alignItems="center"
                      mb={2}
                    >
                      <HStack>
                      <Text>Cooldown (seconds)</Text>
                      <PremiumFeatureTag/>
                      </HStack>
                    </FormLabel>
                    <NumberInput
                      min={60}
                      max={31536000}
                      isDisabled={!premium && temporaryDisablePremiumFields}
                      onClick={() => {
                        if (!premium) {
                          setPremiumFeatureTarget("submission_cooldown");
                          setTemporaryDisablePremiumFields(true);
                          setTimeout(() => setTemporaryDisablePremiumFields(false), 1);
                          onOpenPremium();
                          return;
                        }
                      }}
                    >
                      <NumberInputField
                        _focusVisible={{
                          boxShadow: "inset 0 0 0 2px #5865F2",
                          border: "none",
                        }}
                        height="36px"
                        border='none'
                        borderRadius='4px'
                        background='grey.extradark'
                        {...register(`forms.${index}.cooldown`, { valueAsNumber: true })}
                        id={`forms.${index}.cooldown`}
                        onBlur={(event) => {
                          if(parseInt(event.target.value) < 60) setValue(`forms.${index}.cooldown`, 60)
                          if(parseInt(event.target.value) > 31536000) setValue(`forms.${index}.cooldown`, 31536000)
                        }}
                      />
                    </NumberInput>
                    {/* <HStack><Text width='60px'>Days</Text><Text width='60px'>Hours</Text><Text width='60px'>Minutes</Text><Text width='60px'>Seconds</Text><Text width='60px'>Infinite</Text></HStack>
                  <HStack>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.days`, { onChange: e => handleCooldownChange('days', e, index) })} onClick={() => handleCooldownClick(index)} />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.hours`, { onChange: e => handleCooldownChange('hours', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.minutes`, { onChange: e => handleCooldownChange('minutes', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <NumberInput width='60px' min={0} isDisabled={cooldownDisabled}>
                      <NumberInputField paddingInlineEnd='16px' {...register(`forms.${index}.cooldown.seconds`, { onChange: e => handleCooldownChange('seconds', e, index) })} onClick={() => handleCooldownClick(index)}  />
                    </NumberInput>
                    <Switch
                      onChange={e => {
                        setValue(`forms.${index}.cooldown`, e.target.checked ? 0 : undefined );
                        setCooldownDisabled(e.target.checked)
                      }}
                      isDisabled={!premium}
                      colorScheme='blurple'
                    />
                  </HStack> */}
                  </Box>
                </Collapsible>
                <hr />
                <Collapsible name="Pages">
                  <PageBuilder
                    {...{
                      index,
                      control,
                      premium,
                      getValues,
                      setValue,
                      register,
                      formState,
                      watch,
                      resetField,
                      fixMessage,
                      setDisplayPage,
                      isOpenPremium,
                      onOpenPremium,
                      onClosePremium,
                      setPremiumFeatureTarget,
                      textInputMaxLength,
                      setTextInputMaxLength,
                    }}
                  />
                </Collapsible>
                <hr />
                <Collapsible name="Server Submission Message">
                  <VStack align={"flex-start"}>
                    {/* <HStack>
                    <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    <Text>This section is still in development and currently only supports the message content</Text>
                  </HStack> */}

                    <HStack justifyContent="space-between" width="100%">
                      <FormLabel whiteSpace="nowrap" m={0}>
                        Message
                      </FormLabel>
                      <ReactSelect
                        // onChange={async (option) => {
                        //   for (let i = 0; i < getValues("forms").length; i++) {
                        //     //@ts-expect-error setting to undefined
                        //     setValue(`forms.${i}.submit_channel_id`, undefined);
                        //   }

                        //   if (!option) return;
                        //   setCurrentGuildID(option.value);

                        //   setLoadingGuild(true);
                        //   let guildResponse = await getGuild(option.value);
                        //   setLoadingGuild(false);

                        //   if (guildResponse === false) {
                        //     onOpenAddToServer();
                        //   } else {
                        //     //setStage('submissions')
                        //   }
                        // }}
                        // isLoading={loadingGuild}
                        //defaultValue={guilds ? { label: guilds[0].name, value: guilds[0].id } : null}
                        // value={
                        //   currentGuildID && guilds
                        //     ? {
                        //         label:
                        //           guilds.find((guild) => guild.id === currentGuildID)
                        //             ?.name || "Server Name Unknown",
                        //         value: currentGuildID,
                        //       }
                        //     : null
                        // }
                        onChange={(option) => {
                          // @ts-expect-error
                          if (option.value === "default") {
                            resetField(`forms.${index}.guild_submit_message`);
                            setValue(`forms.${index}.guild_submit_message`, undefined)
                          }

                          // @ts-expect-error
                          if (option.value === "custom") {
                            setValue(`forms.${index}.guild_submit_message`, {
                              "embeds": [
                                {
                                  "author": {
                                    "name": "{MemberNickname}",
                                    "icon_url": "{MemberAvatarURL}",
                                    "url": "https://discord.com/users/{UserID}"
                                  },
                                  "color": "{UserAccentColour}",
                                  "fields": [
                                    {
                                      "name": "{TextInputLabel1}",
                                      "value": "{TextInputValue1}"
                                    },
                                    {
                                      "name": "{TextInputLabel2}",
                                      "value": "{TextInputValue2}"
                                    },
                                    {
                                      "name": "{TextInputLabel3}",
                                      "value": "{TextInputValue3}"
                                    },
                                    {
                                      "name": "{TextInputLabel4}",
                                      "value": "{TextInputValue4}"
                                    },
                                    {
                                      "name": "{TextInputLabel5}",
                                      "value": "{TextInputValue5}"
                                    }
                                  ]
                                }
                              ]
                            })
                          }
                        }}
                        value={watch(`forms.${index}.guild_submit_message`) === undefined ? { label: "Default", value: "default" } : { label: "Custom", value: "custom" }}
                        isClearable={false}
                        isSearchable={false}
                        // placeholder={"Select a server"}
                        // noOptionsMessage={() => "No results found"}
                        name="Select submission confirmation message"
                        options={[
                          {
                            label: 'Default',
                            value: 'default'
                          },
                          {
                            label: 'Custom',
                            value: 'custom'
                          }
                        ]}
                        menuPortalTarget={document.body} // Renders dropdown at the top of the DOM
                        menuPosition="fixed"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            height: "43.5px",
                            background: "oklab(0.23892 0.000131361 -0.00592163)",
                            border: "1px solid oklab(0.23892 0.000131361 -0.00592163)",
                            borderBottomLeftRadius: state.menuIsOpen ? 0 : "4px",
                            borderBottomRightRadius: state.menuIsOpen ? 0 : "4px",
                            "&:hover": {
                              borderColor: "oklab(0.23892 0.000131361 -0.00592163)",
                            },
                            boxShadow: "none",
                            boxSizing: "content-box",
                          }),
                          input: (baseStyles, state) => ({
                            ...baseStyles,
                            margin: "0",
                            alignItems: "center",
                            height: '24px!important',
                            display: "flex",
                            color: 'oklab(0.899401 -0.00192499 -0.00481987)'
                          }),
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            height: "43.5px",
                            padding: "0 12px",
                          }),
                          singleValue: (baseStyles, state) => ({
                            ...baseStyles,
                            color: 'oklab(0.899401 -0.00192499 -0.00481987)',
                            margin: "0"
                          }),
                          placeholder: (baseStyles, state) => ({
                            ...baseStyles,

                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            background: state.isSelected
                              ? '#404249'
                              : state.isFocused
                                ? "#35373c"
                                : "transparent",
                            color: 'inherit',
                            padding: "9.75px",
                            display: "flex",
                            ":active": {
                              background: state.isSelected
                                ? '#404249'
                                : state.isFocused
                                  ? "#35373c"
                                  : "transparent",
                            },
                          }),
                          menu: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            background: "#2b2d31",
                            margin: 0,
                            borderTopLeftRadius: state.menuPlacement === "top" ? 0 : "4px",
                            borderTopRightRadius: state.menuPlacement === "top" ? 0 : "4px",
                            borderBottomLeftRadius:
                              state.menuPlacement === "bottom" ? 0 : "4px",
                            borderBottomRightRadius:
                              state.menuPlacement === "bottom" ? 0 : "4px",
                          }),
                          menuList: (baseStyles) => ({
                            ...baseStyles,
                            padding: 0,
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          dropdownIndicator: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            // transition: 'transform 0.2s ease',
                            transform: state.selectProps.menuIsOpen
                              ? "rotate(180deg)"
                              : "rotate(0)",
                            "&:hover": {
                              color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            },
                          }),
                          menuPortal: (baseStyles) => ({ ...baseStyles, zIndex: 9999 }),
                        }}
                      />
                    </HStack>
                    {watch(`forms.${index}.guild_submit_message`) !== undefined && <>
                      <HStack>
                        <IconContext.Provider
                          value={{ color: "#b9bbbe", size: "20px" }}
                        >
                          <Box>
                            <IoInformationCircle />
                          </Box>
                        </IconContext.Provider>
                        <Text>
                          Use variables to add the submission content to your
                          message:
                        </Text>
                        <Link
                          color="#00b0f4"
                          href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940#variables"
                          isExternal
                        >
                          Show Variables
                        </Link>
                      </HStack>
                      {/* @ts-expect-error */}
                      <MessageBuilder forMessage={`forms.${index}.guild_submit_message`} control={control} register={register} errors={errors} setValue={setValue} getValues={getValues} resetField={resetField} fixMessage={fixMessage} openFormType={openFormType} watch={watch} premium={premium} />
                    </>
                    }

                    <FormLabel>Buttons</FormLabel>
                    <HStack>
                      <IconContext.Provider
                        value={{ color: "#b9bbbe", size: "20px" }}
                      >
                        <Box>
                          <IoInformationCircle />
                        </Box>
                      </IconContext.Provider>
                      <Text>
                        Buttons can be used once and are then automatically
                        disabled
                      </Text>
                    </HStack>
                    <ActionRowBuilder
                      control={control}
                      i={index}
                      getValues={getValues}
                      resetField={resetField}
                      setValue={setValue}
                      register={register}
                      errors={errors}
                      watch={watch}
                      premium={premium}
                      {...{ setPremiumFeatureTarget, onOpenPremium }}
                    />
                  </VStack>
                </Collapsible>
                <hr />
                <Collapsible name="DM Confirmation Message">
                  <VStack align='flex-start'>
                    <HStack justifyContent="space-between" width="100%">
                      <FormLabel whiteSpace="nowrap" m={0}>
                        Message
                      </FormLabel>
                      <ReactSelect
                        // onChange={async (option) => {
                        //   for (let i = 0; i < getValues("forms").length; i++) {
                        //     //@ts-expect-error setting to undefined
                        //     setValue(`forms.${i}.submit_channel_id`, undefined);
                        //   }

                        //   if (!option) return;
                        //   setCurrentGuildID(option.value);

                        //   setLoadingGuild(true);
                        //   let guildResponse = await getGuild(option.value);
                        //   setLoadingGuild(false);

                        //   if (guildResponse === false) {
                        //     onOpenAddToServer();
                        //   } else {
                        //     //setStage('submissions')
                        //   }
                        // }}
                        // isLoading={loadingGuild}
                        //defaultValue={guilds ? { label: guilds[0].name, value: guilds[0].id } : null}
                        // value={
                        //   currentGuildID && guilds
                        //     ? {
                        //         label:
                        //           guilds.find((guild) => guild.id === currentGuildID)
                        //             ?.name || "Server Name Unknown",
                        //         value: currentGuildID,
                        //       }
                        //     : null
                        // }
                        onChange={(option) => {
                          // @ts-expect-error
                          switch (option.value) {
                            case "default": {
                              resetField(`forms.${index}.dm_submit_message`);
                              setValue(`forms.${index}.dm_submit_message`, undefined)
                              break;
                            }
                            case "custom": {
                              setValue(`forms.${index}.dm_submit_message`, {
                                "embeds": [
                                  {
                                    "author": {
                                      "name": "{MemberNickname}",
                                      "icon_url": "{MemberAvatarURL}",
                                      "url": "https://discord.com/users/{UserID}"
                                    },
                                    "color": "{UserAccentColour}",
                                    "fields": [
                                      {
                                        "name": "{TextInputLabel1}",
                                        "value": "{TextInputValue1}"
                                      },
                                      {
                                        "name": "{TextInputLabel2}",
                                        "value": "{TextInputValue2}"
                                      },
                                      {
                                        "name": "{TextInputLabel3}",
                                        "value": "{TextInputValue3}"
                                      },
                                      {
                                        "name": "{TextInputLabel4}",
                                        "value": "{TextInputValue4}"
                                      },
                                      {
                                        "name": "{TextInputLabel5}",
                                        "value": "{TextInputValue5}"
                                      }
                                    ]
                                  }
                                ]
                              })
                              break;
                            }
                            case "off": {
                              if (!premium) {
                                setPremiumFeatureTarget(null)
                                onOpenPremium()
                                break;
                              }
                              //@ts-expect-error
                              setValue(`forms.${index}.dm_submit_message`, null);
                              break;
                            }
                          }
                        }}
                        value={watch(`forms.${index}.dm_submit_message`) ? { label: "Custom", value: "custom" } : watch(`forms.${index}.dm_submit_message`) === null ? { label: "Off", value: "off" } : { label: "Default", value: "default" }}
                        isClearable={false}
                        isSearchable={false}
                        // placeholder={"Select a server"}
                        // noOptionsMessage={() => "No results found"}
                        name="Select submission confirmation message"
                        options={[
                          {
                            label: 'Default',
                            value: 'default'
                          },
                          {
                            label: 'Custom',
                            value: 'custom'
                          },
                          {
                            label: 'Off',
                            value: 'off'
                          }
                        ]}
                        menuPortalTarget={document.body} // Renders dropdown at the top of the DOM
                        menuPosition="fixed"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            height: "43.5px",
                            background: "oklab(0.23892 0.000131361 -0.00592163)",
                            border: "1px solid oklab(0.23892 0.000131361 -0.00592163)",
                            borderBottomLeftRadius: state.menuIsOpen ? 0 : "4px",
                            borderBottomRightRadius: state.menuIsOpen ? 0 : "4px",
                            "&:hover": {
                              borderColor: "oklab(0.23892 0.000131361 -0.00592163)",
                            },
                            boxShadow: "none",
                            boxSizing: "content-box",
                          }),
                          input: (baseStyles, state) => ({
                            ...baseStyles,
                            margin: "0",
                            alignItems: "center",
                            height: '24px!important',
                            display: "flex",
                            color: 'oklab(0.899401 -0.00192499 -0.00481987)'
                          }),
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            height: "43.5px",
                            padding: "0 12px",
                          }),
                          singleValue: (baseStyles, state) => ({
                            ...baseStyles,
                            color: state.data.value === "off" ? 'rgb(26,92,190)' : 'oklab(0.899401 -0.00192499 -0.00481987)',
                            margin: "0"
                          }),
                          placeholder: (baseStyles, state) => ({
                            ...baseStyles,

                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            background: state.isSelected
                              ? '#404249'
                              : state.isFocused
                                ? "#35373c"
                                : "transparent",
                            color: state.data.value === 'off' ? 'rgb(26,92,190)' : 'inherit',
                            padding: "9.75px",
                            display: "flex",
                            ":active": {
                              background: state.isSelected
                                ? '#404249'
                                : state.isFocused
                                  ? "#35373c"
                                  : "transparent",
                            },
                          }),
                          menu: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            background: "#2b2d31",
                            margin: 0,
                            borderTopLeftRadius: state.menuPlacement === "top" ? 0 : "4px",
                            borderTopRightRadius: state.menuPlacement === "top" ? 0 : "4px",
                            borderBottomLeftRadius:
                              state.menuPlacement === "bottom" ? 0 : "4px",
                            borderBottomRightRadius:
                              state.menuPlacement === "bottom" ? 0 : "4px",
                          }),
                          menuList: (baseStyles) => ({
                            ...baseStyles,
                            padding: 0,
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          dropdownIndicator: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            // transition: 'transform 0.2s ease',
                            transform: state.selectProps.menuIsOpen
                              ? "rotate(180deg)"
                              : "rotate(0)",
                            "&:hover": {
                              color: "oklab(0.786807 -0.0025776 -0.0110238)",
                            },
                          }),
                          menuPortal: (baseStyles) => ({ ...baseStyles, zIndex: 9999 }),
                        }}
                      />
                    </HStack>
                    {watch(`forms.${index}.dm_submit_message`) !== undefined && watch(`forms.${index}.dm_submit_message`) !== null && <>
                      <HStack>
                        <IconContext.Provider
                          value={{ color: "#b9bbbe", size: "20px" }}
                        >
                          <Box>
                            <IoInformationCircle />
                          </Box>
                        </IconContext.Provider>
                        <Text>
                          Use variables to add the submission content to your
                          message:
                        </Text>
                        <Link
                          color="#00b0f4"
                          href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940#variables"
                          isExternal
                        >
                          Show Variables
                        </Link>
                      </HStack>
                      {/* @ts-expect-error */}
                      <MessageBuilder forMessage={`forms.${index}.dm_submit_message`} control={control} register={register} errors={errors} setValue={setValue} getValues={getValues} resetField={resetField} fixMessage={fixMessage} openFormType={openFormType} watch={watch} premium={premium} />
                    </>
                    }
                  </VStack>
                </Collapsible>
                <hr />
                <Collapsible
                  name={
                    <>
                      Additional actions on submission
                      {((watch(`forms.${index}.on_submit`)
                        ?.ADD_ROLE_TO_SUBMITTER !== undefined &&
                        (formState?.errors?.forms?.[index]?.on_submit
                          ?.ADD_ROLE_TO_SUBMITTER ||
                          watch(`forms.${index}.on_submit`)
                            ?.ADD_ROLE_TO_SUBMITTER === "")) ||
                        (watch(`forms.${index}.on_submit`)
                          ?.REMOVE_ROLE_FROM_SUBMITTER !== undefined &&
                          formState?.errors?.forms?.[index]?.on_submit
                            ?.REMOVE_ROLE_FROM_SUBMITTER) ||
                        watch(`forms.${index}.on_submit`)
                          ?.REMOVE_ROLE_FROM_SUBMITTER === "") && (
                          <AiFillExclamationCircle
                            style={{ marginLeft: "4px" }}
                            color={colorMode === "dark" ? "#ff7a6b" : "#d92f2f"}
                          />
                        )}
                    </>
                  }
                >
                  <Menu isLazy>
                    <MenuButton
                      as={Button}
                      variant="primary"
                      mt={1}
                      pr="0px"
                      rightIcon={
                        <svg
                          style={{
                            marginRight: "8px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            transform: `rotate(180deg)`,
                          }}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M12 10L8 6L4 10"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    >
                      Add
                    </MenuButton>
                    <MenuList bg="#181414" px="4px" py="10px">
                      {getValues(
                        `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`
                      ) === undefined && (
                          <MenuItem
                            bg="#181414"
                            _hover={{ background: "#5865F2" }}
                            borderRadius="4px"
                            p="4px 10px"
                            onClick={() =>
                              setValue(
                                `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`,
                                ""
                              )
                            }
                          >
                            <RoleIcon /><Text ml={2}>Add role to submitter</Text>
                          </MenuItem>
                        )}
                      {getValues(
                        `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`
                      ) === undefined && (
                          <MenuItem
                            bg="#181414"
                            _hover={{ background: "#5865F2" }}
                            borderRadius="4px"
                            p="4px 10px"
                            onClick={() =>
                              setValue(
                                `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`,
                                ""
                              )
                            }
                          >
                            <RoleIcon /><Text ml={2}>Remove role from submitter</Text>
                          </MenuItem>
                        )}
                    </MenuList>
                  </Menu>
                  {getValues(
                    `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`
                  ) !== undefined && (
                      <Box>
                        <FormLabel
                          htmlFor={`forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`}
                          display="flex"
                          alignItems="flex-end"
                        >
                          <Text
                            _after={{
                              content: '" *"',
                              color: colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
                            }}
                          >
                            Role ID - Add role to submitter
                          </Text>
                        </FormLabel>
                        <HStack>
                          <input
                            {...register(
                              `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`,
                              { required: true, pattern: /^\d{10,20}$/ }
                            )}
                            id={`forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`}
                            type="string"
                          />
                          <CloseButton
                            onClick={() => {
                              resetField(
                                `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`
                              );
                              if (
                                Object.keys(
                                  watch(`forms.${index}.on_submit`) ?? {}
                                ).length === 1
                              ) {
                                setValue(`forms.${index}.on_submit`, undefined);
                              } else {
                                setValue(
                                  `forms.${index}.on_submit.ADD_ROLE_TO_SUBMITTER`,
                                  undefined
                                );
                              }
                            }}
                          />
                        </HStack>
                        <ErrorMessage
                          error={
                            errors.forms?.[index]?.on_submit
                              ?.ADD_ROLE_TO_SUBMITTER
                          }
                        />
                      </Box>
                    )}
                  {getValues(
                    `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`
                  ) !== undefined && (
                      <Box>
                        <FormLabel
                          htmlFor={`forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`}
                          display="flex"
                          alignItems="flex-end"
                        >
                          <Text
                            _after={{
                              content: '" *"',
                              color: colorMode === "dark" ? "#ff7a6b" : "#d92f2f",
                            }}
                          >
                            Role ID - Remove role from submitter
                          </Text>
                        </FormLabel>
                        <HStack>
                          <input
                            {...register(
                              `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`,
                              { required: true, pattern: /^\d{10,20}$/ }
                            )}
                            id={`forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`}
                            type="string"
                          />
                          <CloseButton
                            onClick={() => {
                              resetField(
                                `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`
                              );

                              if (
                                Object.keys(
                                  getValues(`forms.${index}.on_submit`) ?? {}
                                ).length === 1
                              ) {
                                setValue(`forms.${index}.on_submit`, undefined);
                              } else {
                                setValue(
                                  `forms.${index}.on_submit.REMOVE_ROLE_FROM_SUBMITTER`,
                                  undefined
                                );
                              }
                            }}
                          />
                        </HStack>
                        <ErrorMessage
                          error={
                            errors.forms?.[index]?.on_submit
                              ?.REMOVE_ROLE_FROM_SUBMITTER
                          }
                        />
                      </Box>
                    )}
                </Collapsible>
              </Collapsible>
            </>
          );
        })}
      </ul>

      <section>
        <Button
          variant="primary"
          isDisabled={
            (getValues("message") &&
              getValues("forms.0.select_menu_option") &&
              getValues("forms").length >= 25) ||
            (getValues("message") &&
              !getValues("forms.0.select_menu_option") &&
              getValues("message.components.0.components")?.length >= 5) ||
            (getValues("application_command") && getValues("forms").length >= 1)
          }
          onClick={() => {
            if (openFormType === "button")
              formMessageComponentsAppend({
                label: "Open Form",
                custom_id: `{FormID${fields.length + 1}}`,
                style: 1,
                type: 2,
              });
            append({
              pages: [
                {
                  modal: {
                    title: "",
                    components: [
                      {
                        type: 1,
                        components: [
                          {
                            type: 4,
                            label: "",
                            style: 1,
                            max_length: 1024,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            });
            setDisplayForm(fields.length);
            setSubmissionType("append", "bot");
            setSubmissionChannel("append", "existing");

            fixMessage('message');
          }}
        >
          Add Form
        </Button>
        {getValues("forms")?.length > 5 ||
          (getValues("application_command") &&
            getValues("forms").length > 1 && (
              <ErrorMessage>You have too many forms</ErrorMessage>
            ))}
      </section>
    </Box>
  );
}
