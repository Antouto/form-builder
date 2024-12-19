/* eslint-disable react/no-unescaped-entities */
import React, { use, useEffect, useState } from "react";
import {
  Control,
  FieldValues,
  FormState,
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayMove,
} from "react-hook-form";
import FormBuilder from "../components/FormBuilder";
import {
  Box,
  VStack,
  Button,
  Heading,
  useToast,
  HStack,
  Input,
  cssVar,
  Spinner,
  Text,
  FormLabel,
  useDisclosure,
  Link,
  Divider,
  Switch,
  Tooltip,
  Stack,
  Image,
  Avatar,
} from "@chakra-ui/react";
import JSONViewer, { DOWNLOAD_SPINNER_TIME } from "../components/JSONViewer";
import ErrorMessage from "../components/ErrorMessage";
import OpenFormTypeBuilder from "./OpenFormTypeBuilder";
import { Mention, SlashCommand, UserMention } from "../components/Mention";
import ClearedValues from "../ClearedValues.json";
import {
  ActionRow,
  FormAndOpenFormTypeBuilder,
  Guild,
  PermissionOverwrites,
  ToastStyles,
} from "../util/types";
import { createName } from "../util/form";
import { useScreenWidth } from "../util/width";
// import { useRouter } from "next/router";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ApplicationCommandBuilder from "./ApplicationCommandBuilder";
import FormTitleInput from "./FormTitleInput";
import TextInputBuilder from "./TextInputBuilder";
import SubmissionChannelIDInput from "./SubmissionChannelIDInput";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";
import Select from "react-select";

import Cookies from "js-cookie";
import { ChannelIcon, ThreadIcon } from "./Icons";

const Defaults = {
  Embed: {
    color: 5793266,
    title: "Example Form",
    description: "Fill out the form below!",
    author: {
      name: "",
      url: "",
      icon_url: "",
    },
    footer: {
      text: "",
      icon_url: "",
    },
  },
  Message: "Fill out the form below!",
};

export interface EditorProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  reset: UseFormReset<T>;
  displaySection: boolean;
  resetField: UseFormResetField<T>;
  stage: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  formMessageComponents: ActionRow[];
  formMessageComponentsAppend: UseFieldArrayAppend<T>;
  formMessageComponentsRemove: UseFieldArrayRemove;
  formMessageComponentsMove: UseFieldArrayMove;
}

export function Editor({
  displayForm,
  setDisplayForm,
  watch,
  getValues,
  setValue,
  formState,
  control,
  register,
  reset,
  displaySection,
  resetField,
  stage,
  setStage,
  formMessageComponents,
  formMessageComponentsAppend,
  formMessageComponentsRemove,
  formMessageComponentsMove,
  //@ts-expect-error
  displayPage,
  //@ts-expect-error
  setDisplayPage,
  //@ts-expect-error
  openFormType,
  //@ts-expect-error
  setOpenFormType,
  //@ts-expect-error
  setPremium,
  //@ts-expect-error
  premium,
  //@ts-expect-error
  _setPremium,
  //@ts-expect-error
  submissionType,
  //@ts-expect-error
  _setSubmissionType,
  //@ts-expect-error
  submissionChannel,
  //@ts-expect-error
  _setSubmissionChannel,
  //@ts-expect-error
  setPreset,
  //@ts-expect-error
  cookieValue,
  //@ts-expect-error
  setCookieValue,
  //@ts-expect-error
  currentGuild,
  //@ts-expect-error
  setCurrentGuild,
  //@ts-expect-error
  formCreationFeatures,
  //@ts-expect-error
  setFormCreationFeatures,
}: EditorProps<FormAndOpenFormTypeBuilder>) {
  const toast = useToast();

  function postToast({
    title,
    description,
    style,
  }: {
    title: string;
    description?: string;
    style: ToastStyles;
  }) {
    return toast({
      title,
      description,
      status: style as unknown as undefined,
      containerStyle: {
        backgroundColor: "#5865f2",
        borderRadius: "0.3rem",
      },
      position: "bottom",
      duration: 3000,
      isClosable: true,
    });
  }

  const [guilds, setGuilds] = useState();

  const [textInputMaxLength, setTextInputMaxLength] = useState(1024);

  async function getGuild(id: string) {
    console.log("getGuild 1");
    let guildResponse = await fetch(
      `https://create.discordforms.app/api/discord/session?guild_id=${id}`
    );
    guildResponse = await guildResponse.json();
    console.log("getGuild 2");
    //@ts-expect-error
    if (guildResponse.code && guildResponse.code === 50001) {
      setCurrentGuild(id);
      return false;
    } else {
      setCurrentGuild(guildResponse);
      return guildResponse;
    }
  }

  async function getGuilds() {
    // Fetch guild details from Discord using the access token
    let guildResponse = (await (
      await fetch("https://create.discordforms.app/api/discord/session")
    ).json()) as Guild[];
    console.log("guildResponse");
    console.log("guildResponse here", guildResponse);

    guildResponse = guildResponse.filter(
      (guild) => (guild.permissions & (1 << 3)) === 1 << 3
    );

    //@ts-expect-error
    setGuilds(guildResponse);
  }

  useEffect(() => {
    // if(!cookieValue) window.location.replace('https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fcreate.discordforms.app%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds&prompt=none');

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      return;
    getGuilds();
  }, [cookieValue]);

  const [loadingGuild, setLoadingGuild] = useState(false);

  const [webhookUrlFocused, webhookUrlSetFocused] = useState(false);
  const {
    isOpen,
    onOpen: onOpenWhereDoIFindSubmissionChannelID,
    onClose,
  } = useDisclosure();
  const {
    isOpen: isOpenPremium,
    onOpen: onOpenPremium,
    onClose: onClosePremium,
  } = useDisclosure();
  const {
    isOpen: isOpenAddToServer,
    onOpen: onOpenAddToServer,
    onClose: onCloseAddToServer,
  } = useDisclosure();
  const [premiumFeatureTarget, setPremiumFeatureTarget] =
    useState("custom_branding");

  const [fileInput, setFileInput] = useState<HTMLInputElement>();
  const [isReading, setReading] = useState(false);

  const [currentGuildID, setCurrentGuildID] = useState();

  const ReadFile = (targetFile: React.ChangeEvent<HTMLInputElement>) => {
    setReading(true);
    function CannotRead() {
      return postToast({
        style: ToastStyles.Error,
        title: "Cannot read form",
      });
    }

    if (targetFile.target.files == null) return CannotRead();

    const file = targetFile.target.files[0];
    console.log(file, targetFile.target.files);
    const fileType = file.type;
    function makeError() {
      return postToast({
        title: "Invalid JSON File",
        style: ToastStyles.Error,
      });
    }

    if (fileType !== "application/json") {
      makeError();
      //@ts-expect-error
      targetFile.target.value = null;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result != "string") return CannotRead();
      const json = JSON.parse(e.target.result) as FormAndOpenFormTypeBuilder;

      // Log for debugging purposes
      console.log(json);

      if (
        json?.forms == null ||
        !Array.isArray(json?.forms) ||
        (json?.message == null && json?.application_command == null)
      ) {
        return makeError();
      }

      // Validator for the number of forms
      // 🔗 https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal
      if (json.forms.length > 25) {
        json.forms.length = 25;
      }

      // Add the json.forms array to the form hook
      setValue("forms", json.forms);

      if (!json.forms?.[0].select_menu_option) {
        setOpenFormType("button", false);
      } else if (json.forms[0].select_menu_option) {
        setOpenFormType("select_menu", false);
      } else if (json.application_command) {
        setOpenFormType("application_command", false);
      }

      //@ts-expect-error
      let newSubmissionType = [];
      //@ts-expect-error
      let newSubmissionChannel = [];
      json.forms.forEach((form, i) => {
        if (form.webhook_url) setPremium(true);
        if (form.submit_channel) {
          setTimeout(() => {
            if (form.submit_channel?.parent_id === "")
              setValue(`forms.${i}.submit_channel.parent_id`, undefined);

            if (getValues(`forms.${i}.submit_channel.permission_overwrites`))
              getValues(
                `forms.${i}.submit_channel.permission_overwrites`
              ).forEach((overwrite, ii) => {
                console.log("overwrite", overwrite);
                if (overwrite.allow === "")
                  setValue(
                    `forms.${i}.submit_channel.permission_overwrites.${ii}.allow`,
                    undefined
                  );
                if (overwrite.deny === "")
                  setValue(
                    `forms.${i}.submit_channel.permission_overwrites.${ii}.deny`,
                    undefined
                  );
              });
          }, 1);
        }
        if (form.submit_components) {
          form.submit_components.forEach((action_row, ii) => {
            if (action_row.components) {
              action_row.components.forEach((component, iii) => {
                if (component?.logic && component?.logic?.REQUIRED_PERMISSIONS)
                  setPremium(true);
                setTimeout(() => {
                  if (
                    component?.logic?.UPDATE_THIS_CHANNEL?.permission_overwrites
                  ) {
                    const values = getValues(
                      `forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites`
                    ) as PermissionOverwrites[];

                    values.forEach((overwrite, iiii) => {
                      if (overwrite.allow === "")
                        setValue(
                          `forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.allow`,
                          undefined
                        );
                      if (overwrite.deny === "")
                        setValue(
                          `forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.deny`,
                          undefined
                        );
                    });
                  }
                }, 1);
              });
            }
          });
        }

        if (form.webhook_url) {
          newSubmissionType.push("webhook_url");
        } else {
          newSubmissionType.push("bot");
        }

        if (form.submit_channel) {
          newSubmissionChannel.push("new");
        } else if (form.submit_thread) {
          newSubmissionChannel.push("new_thread");
        } else {
          newSubmissionChannel.push("existing");
        }
      });
      //@ts-expect-error
      _setSubmissionType(newSubmissionType);
      //@ts-expect-error
      _setSubmissionChannel(newSubmissionChannel);
      if (!json.application_command) {
        // Add the json.message object to the form hook
        setValue("message", json.message);
      }

      if (json.select_menu_placeholder)
        setValue("select_menu_placeholder", json.select_menu_placeholder);

      setReading(false);
      // Send a toast the the user notifying that the form has
      // been uploaded
      postToast({
        title: "Form Uploaded",
        style: ToastStyles.Success,
      });
    };

    reader.readAsText(file);
    return;
  };

  const downloadForm = () => {
    setTimeout(() => {
      const jsonString = `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(watch(), null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `${createName({ getValues })}.json`;

      // Append the link to the body to ensure compatibility on mobile
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link after download
    }, 500);
  };

  const [loading, setLoading] = useState(false);
  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
  };

  const isSmallScreen = !useScreenWidth(1070);
  const isReallySmallScreen = !useScreenWidth(500);

  function setSubmissionType(type: string, value: string, index: number) {
    let newSubmissionType = submissionType;
    switch (type) {
      case "edit": {
        newSubmissionType[index] = value;
        _setSubmissionType(newSubmissionType);
        switch (value) {
          case "bot":
            setValue(`forms.${index}.webhook_url`, undefined);
            break;
          case "webhook":
            setValue(`forms.${index}.submit_channel_id`, undefined);
            setSubmissionChannel("edit", "existing", index);
            break;
        }
        break;
      }
      case "append": {
        newSubmissionType.push(value);
        break;
      }
      case "delete": {
        newSubmissionType.splice(value, 1);
        break;
      }
    }
  }
  function setSubmissionChannel(type: string, value: string, index: number) {
    let newSubmissionChannel = submissionChannel;
    switch (type) {
      case "edit": {
        newSubmissionChannel[index] = value;
        _setSubmissionChannel(newSubmissionChannel);
        switch (value) {
          case "existing": {
            setValue(`forms.${index}.submit_channel`, undefined);
            setValue(`forms.${index}.submit_thread`, undefined);
            break;
          }
          case "new": {
            setValue(`forms.${index}.submit_thread`, undefined);
            setValue(`forms.${index}.webhook_url`, undefined);
            setValue(`forms.${index}.submit_channel_id`, undefined);
            setValue(`forms.${index}.submit_channel.type`, 0);
            setValue(`forms.${index}.submit_channel.name`, "ticket");
            setValue(`forms.${index}.submit_channel.permission_overwrites`, [
              {
                id: "{ServerID}",
                type: 0,
                deny: 1024,
              },
              {
                id: "{ApplicationID}",
                type: 1,
                allow: 19456,
              },
              {
                id: "{UserID}",
                type: 1,
                allow: 52224,
              },
            ]);
            setTimeout(() => {
              if (getValues(`forms.${index}.submit_channel.parent_id`) === "")
                setValue(`forms.${index}.submit_channel.parent_id`, undefined);
              getValues(
                `forms.${index}.submit_channel.permission_overwrites`
              ).map((overwrite, i) => {
                if (overwrite.allow === "")
                  setValue(
                    `forms.${index}.submit_channel.permission_overwrites.${i}.allow`,
                    undefined
                  );

                if (overwrite.deny === "")
                  setValue(
                    `forms.${index}.submit_channel.permission_overwrites.${i}.deny`,
                    undefined
                  );
              });
            }, 1);
            break;
          }
          case "new_thread": {
            setValue(`forms.${index}.submit_channel`, undefined);
            setValue(`forms.${index}.submit_thread`, undefined);
            setValue(`forms.${index}.webhook_url`, undefined);

            setValue(`forms.${index}.submit_thread`, {
              name: "ticket",
              type: 12,
              add_submitter: true,
            });
            break;
          }
        }
        break;
      }
      case "append": {
        newSubmissionChannel.push(value);
        break;
      }
      case "delete": {
        newSubmissionChannel.splice(index, 1);
        break;
      }
    }
  }

  // function handleCooldownChange(unit, e, index) {
  //   let prev = getValues(`forms.${index}.cooldown`)
  //   if (typeof prev !== 'object') prev = {}

  //   const updated = {
  //     days: parseInt(prev.days) || undefined,
  //     hours: parseInt(prev.hours) || undefined,
  //     minutes: parseInt(prev.minutes) || undefined,
  //     seconds: parseInt(prev.seconds) || undefined,
  //     ...unit && { [unit]: Number.isInteger(parseInt(e.target.value)) ? parseInt(e.target.value) : undefined }
  //   }

  //   let numKeys = 0;
  //   if (updated.days) numKeys++
  //   if (updated.hours) numKeys++
  //   if (updated.minutes) numKeys++
  //   if (updated.seconds) numKeys++

  //   setValue(`forms.${index}.cooldown`, numKeys ? updated : undefined)

  // }

  function fixMessage() {
    const message = getValues("message");
    if (!message) return;
    const { content, embeds } = message;
    if (!content) setValue(`message.content`, undefined);
    if (embeds?.length) {
      for (let i = 0; i < embeds.length; i++) {
        const { title, description, color, image, author, footer } = embeds[i];
        if (!author?.name && !author?.icon_url && !author?.url) {
          setValue(`message.embeds.${i}.author`, undefined);
        } else {
          if (!author?.name)
            //@ts-expect-error
            setValue(`message.embeds.${i}.author.name`, undefined);
          if (!author?.icon_url)
            //@ts-expect-error
            setValue(`message.embeds.${i}.author.icon_url`, undefined);
          if (!author?.url)
            //@ts-expect-error
            setValue(`message.embeds.${i}.author.url`, undefined);
        }
        if (!title) setValue(`message.embeds.${i}.title`, undefined);
        if (!description)
          setValue(`message.embeds.${i}.description`, undefined);
        if (typeof color === "string" && color.length) {
          setValue(`message.embeds.${i}.color`, parseInt(color));
        }
        if (typeof color === "string" && !color.length) {
          setValue(`message.embeds.${i}.color`, undefined);
        }
        if (!image?.url) setValue(`message.embeds.${i}.image`, undefined);
        if (!footer?.text && !footer?.icon_url) {
          setValue(`message.embeds.${i}.footer`, undefined);
        } else {
          if (!footer?.text)
            //@ts-expect-error
            setValue(`message.embeds.${i}.footer.text`, undefined);
          if (!footer?.icon_url)
            //@ts-expect-error
            setValue(`message.embeds.${i}.footer.icon_url`, undefined);
        }
      }
    } else {
      setValue(`message.embeds`, undefined);
    }

    // Also fix text inputs
    if (watch("forms")?.length)
      for (let i = 0; i < watch("forms")?.length; i++) {
        setTimeout(() => {
          if (watch(`forms.${i}`)?.select_menu_option) {
            if (!watch(`forms.${i}`)?.select_menu_option?.emoji?.id) {
              setValue(`forms.${i}.select_menu_option.emoji`, undefined);
            }
          }
        }, 1);
        // handleCooldownChange(null, null, i)
        for (let ii = 0; ii < watch(`forms.${i}.pages`)?.length; ii++) {
          for (
            let iii = 0;
            iii < watch(`forms.${i}.pages.${ii}.modal.components`).length;
            iii++
          ) {
            setTimeout(() => {
              if (
                !watch(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.placeholder`
                )
              )
                setValue(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.placeholder`,
                  //@ts-expect-error
                  undefined
                );
              if (
                !watch(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.value`
                )
              )
                setValue(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.value`,
                  //@ts-expect-error
                  undefined
                );

              if (
                typeof watch(
                  `forms.${ii}.pages.${ii}.modal.components.${iii}.components.0.style`
                ) === "string"
              )
                setValue(
                  `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.style`,
                  //@ts-expect-error
                  parseInt(
                    watch(
                      `forms.${i}.pages.${ii}.modal.components.${iii}.components.0.style`
                    ) as unknown as string
                  )
                );
            }, 1);
          }
        }
      }
  }

  function fixSubmitChannel(index: any) {
    if (!getValues(`forms.${index}.submit_channel.parent_id`))
      setValue(`forms.${index}.submit_channel.parent_id`, undefined);
  }

  return (
    <>
      <VStack
        align="flex-start"
        overflowY="scroll"
        p="16px"
        height="calc(100vh - 48px);"
        display={displaySection ? "flex" : "none"}
      >
        {stage === "editor" && (
          <>
            <Stack
              direction={isReallySmallScreen ? "column" : "row"}
              justifyContent="space-between"
              width="100%"
            >
              <HStack>
                <Button
                  onClick={() => {
                    if (fileInput == null) {
                      return postToast({
                        title: "Something didn't go right.",
                        style: ToastStyles.Error,
                      });
                    } else fileInput.click();
                  }}
                  variant="secondary"
                  isLoading={isReading}
                >
                  Upload JSON
                </Button>
                <Input
                  id="json"
                  type="file"
                  accept=".json"
                  display="none"
                  onChange={ReadFile}
                  ref={(input) => {
                    if (input != null) {
                      setFileInput(input);
                    }
                  }}
                />
                <Button
                  variant="danger-outline"
                  onClick={() => {
                    //@ts-expect-error
                    reset(ClearedValues);
                    setOpenFormType("button", false);
                    _setSubmissionType(["bot"]);
                    _setSubmissionChannel(["existing"]);
                  }}
                >
                  Clear All
                </Button>
              </HStack>
              <HStack
                height="36px"
                border="2px solid #1C5CBE"
                backgroundImage="linear-gradient(to right, rgba(52, 66, 217, 0.5), rgba(1, 118, 164, 0.5))"
                borderRadius={6}
                p={2}
                justifyContent="space-between"
              >
                <HStack>
                  <Switch
                    variant="green"
                    size="sm"
                    onChange={(event) => setPremium(event.target.checked)}
                    isChecked={premium}
                  />
                  <Text>Use premium features</Text>
                  <Tooltip
                    hasArrow
                    label={
                      "When enabled forms will only work in servers with an active premium subscription. Premium includes custom branding."
                    }
                    placement="right"
                    shouldWrapChildren
                    bg="#181414"
                  >
                    <IconContext.Provider
                      value={{ color: "#b9bbbe", size: "20px" }}
                    >
                      <Box>
                        <IoInformationCircle />
                      </Box>
                    </IconContext.Provider>
                  </Tooltip>
                </HStack>
                <Link
                  href="https://forms.lemonsqueezy.com/buy/6c238e6d-28f7-44ea-b965-b2f8c9e2512b"
                  target="_blank"
                >
                  <Button variant="link-outline">Upgrade</Button>
                </Link>
              </HStack>
            </Stack>
            <OpenFormTypeBuilder
              {...{
                Defaults,
                getValues,
                resetField,
                control,
                formState,
                register,
                setValue,
                openFormType,
                setOpenFormType,
                fixMessage,
                watch,
                formMessageComponents,
                formMessageComponentsAppend,
                formMessageComponentsRemove,
                formMessageComponentsMove,
                premium,
              }}
            />
            <FormBuilder
              {...{
                control,
                register,
                getValues,
                setValue,
                resetField,
                formState,
                watch,
                displayForm,
                setDisplayForm,
                fixMessage,
                // handleCooldownChange,
                webhookUrlFocused,
                webhookUrlSetFocused,
                premium,
                submissionType,
                setSubmissionType,
                submissionChannel,
                setSubmissionChannel,
                onOpenWhereDoIFindSubmissionChannelID,
                fixSubmitChannel,
                formMessageComponents,
                formMessageComponentsAppend,
                formMessageComponentsRemove,
                openFormType,
                displayPage,
                setDisplayPage,
                isOpenPremium,
                onOpenPremium,
                onClosePremium,
                setPremiumFeatureTarget,
                currentGuild,
                cookieValue,
                getGuild,
                getGuilds,
                stage,
                setCookieValue,
                loadingGuild,
                setLoadingGuild,
                onOpenAddToServer,
                guilds,
                currentGuildID,
                setCurrentGuildID,
                textInputMaxLength,
                setTextInputMaxLength,
              }}
            />
            <VStack width="100%" align="flex-start">
              <Heading size="sm" marginBottom="5px">
                Add the form to your server
              </Heading>
              <Text mb={2}>
                Using <UserMention isFormsBot>Forms</UserMention>, run{" "}
                <SlashCommand>form create</SlashCommand> and attach the
                configuration file downloaded.
              </Text>
              {/* <Box>
            This is the configuration file you'll need to give to the{" "}
            <UserMention isFormsBot>Forms</UserMention> bot to create your form.
            The <UserMention isFormsBot>Forms</UserMention> bot needs to be in
            your server.
          </Box> */}
              {/* <JSONViewer {...{ downloadForm, getValues }}>
            {JSON.stringify(watch(), null, 2)}
          </JSONViewer> */}
              <VStack alignItems="flex-start">
                <HStack alignItems="flex-start">
                  <Button
                    variant="success"
                    //@ts-expect-error
                    isDisabled={
                      !formState.isValid ||
                      watch("forms").length >
                        (watch("application_command")
                          ? 1
                          : getValues("message") &&
                            getValues("forms.0.select_menu_option")
                          ? 25
                          : 5) ||
                      (getValues("message.embeds")?.length &&
                        (() => {
                          const embeds = getValues("message.embeds");
                          if (embeds != undefined) {
                            for (const {
                              title,
                              description,
                              author,
                              footer,
                            } of embeds) {
                              if (
                                !(
                                  title ||
                                  description ||
                                  author?.name ||
                                  footer?.text
                                )
                              )
                                return true;
                            }
                          }
                        })())
                    }
                    onClick={() => {
                      handleLoad();
                      downloadForm();
                    }}
                    width={225}
                    // bgColor={loading ? "#215b32" : undefined}
                  >
                    {!loading && "Download Configuration File"}
                    {loading && <Spinner size="sm" />}
                  </Button>
                  <Link
                    href="https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=805309456&scope=bot+applications.commands"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="success-outline">Add bot to server</Button>
                  </Link>
                </HStack>
                {(!formState.isValid ||
                  watch("forms").length >
                    (watch("application_command")
                      ? 1
                      : getValues("message") &&
                        getValues("forms.0.select_menu_option")
                      ? 25
                      : 5) ||
                  (getValues("message.embeds")?.length &&
                    (() => {
                      const embeds = getValues("message.embeds");
                      if (embeds != undefined) {
                        for (const {
                          title,
                          description,
                          author,
                          image,
                          footer,
                        } of embeds) {
                          if (
                            !(
                              title ||
                              description ||
                              author?.name ||
                              image?.url ||
                              footer?.text
                            )
                          )
                            return true;
                        }
                      }
                    })())) && (
                  <ErrorMessage>
                    Fill out the fields correctly before downloading the
                    configuration file.
                  </ErrorMessage>
                )}
              </VStack>
              {/* <Box>
            Upload the configuration file using the{" "}
            <SlashCommand>form create</SlashCommand> command on the{" "}
            <UserMention isFormsBot>Forms</UserMention> bot.
          </Box> */}
            </VStack>
          </>
        )}
        {stage === "welcome" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={30}
              fontFamily="Whitney Bold"
            >
              Create a form
            </Text>
            <VStack align="center" gap={4} mt="30px" width="100%">
              <Button variant="primary" onClick={() => setPreset()}>
                Start quick setup
              </Button>
              <Text fontSize={18} my={2}>
                or start from a template
              </Text>
              <VStack width="100%">
                <Text fontSize={19} fontFamily="Whitney Bold">
                  Free templates
                </Text>
                <VStack
                  background="rgb(47, 49, 54)"
                  width="100%"
                  maxWidth="476px"
                  borderRadius="8px"
                  gap={2}
                  padding={2}
                >
                  <Text
                    width="100%"
                    textTransform="uppercase"
                    fontFamily="Sofia Sans"
                    color="#DBDEE1"
                    fontWeight="extrabold"
                    fontSize="14px"
                  >
                    Accept/Deny Buttons
                  </Text>
                  <Box
                    background="rgb(54, 57, 63)"
                    p="4px 8px"
                    width="100%"
                    borderRadius={4}
                    transition="filter .3s"
                    _hover={{ cursor: "pointer", filter: "brightness(1.15)" }}
                    onClick={() => setPreset("approval_dm")}
                  >
                    <Text fontWeight="bold">{"Approve Submissions → DM"}</Text>
                    <Text color="#DBDEE1" fontSize="14px">
                      Send forms to a private channel and DM users on approval
                      or denial
                    </Text>
                  </Box>
                  <Box
                    background="rgb(54, 57, 63)"
                    p="4px 8px"
                    width="100%"
                    borderRadius={4}
                    transition="filter .3s"
                    _hover={{ cursor: "pointer", filter: "brightness(1.15)" }}
                    onClick={() => setPreset("approval_forward")}
                  >
                    <Text fontWeight="bold">
                      {"Approve Submissions → Public channel"}
                    </Text>
                    <Text color="#DBDEE1" fontSize="14px">
                      Send forms to a private channel and forward to a public
                      channel on approval
                    </Text>
                  </Box>
                </VStack>
              </VStack>
              <VStack width="100%">
                <Text fontSize={19} fontFamily="Whitney Bold">
                  Premium templates
                </Text>
                <VStack
                  background="rgb(47, 49, 54)"
                  width="100%"
                  maxWidth="476px"
                  borderRadius="8px"
                  gap={2}
                  padding={2}
                >
                  <Text
                    width="100%"
                    textTransform="uppercase"
                    fontFamily="Sofia Sans"
                    color="#DBDEE1"
                    fontWeight="extrabold"
                    fontSize="14px"
                  >
                    Ticket Systems
                  </Text>
                  <Box
                    background="rgb(54, 57, 63)"
                    width="100%"
                    p="4px 8px"
                    borderRadius={4}
                    transition="filter .3s"
                    _hover={{ cursor: "pointer", filter: "brightness(1.15)" }}
                    onClick={() => setPreset("thread_ticket")}
                  >
                    <HStack>
                      <ThreadIcon size={18} />
                      <Text fontWeight="medium">{"Threads"}</Text>
                    </HStack>
                    <Text color="#DBDEE1" fontSize="14px">
                      Send submissions to a new thread and add the submitter to
                      it
                    </Text>
                  </Box>
                  <Box
                    background="rgb(54, 57, 63)"
                    width="100%"
                    p="4px 8px"
                    borderRadius={4}
                    transition="filter .3s"
                    _hover={{ cursor: "pointer", filter: "brightness(1.15)" }}
                    onClick={() => setPreset("ticket")}
                  >
                    <HStack>
                      <ChannelIcon size={18} />
                      <Text fontWeight="medium">{"Channels"}</Text>
                    </HStack>
                    <Text color="#DBDEE1" fontSize="14px">
                      Send submissions to a new channel and add the submitter to
                      it
                    </Text>
                  </Box>
                </VStack>
              </VStack>
              <VStack mt={1}>
                <Text fontSize={19} fontFamily="Whitney Bold">
                  Advanced
                </Text>
                <Button
                  variant="secondary-outline"
                  onClick={() => setStage("editor")}
                >
                  Open full editor
                </Button>
              </VStack>

              {/* <a href='https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fcreate.discordforms.app%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds&prompt=none'>
            <button style={{ color: 'darkgray' }}>{cookieValue ? `Cookie Value: ${cookieValue}` : '-'}</button>
          </a> */}

              {/* <button style={{ color: 'darkgray' }} onClick={() => {
            const popup = window.open(`https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fcreate.discordforms.app%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds&prompt=none`, 'popup', 'popup=true,width=485,height=700')

            window.addEventListener('message', (event) => {
              if (event.data === 'authorized') {
                // Close the popup if it hasn't been closed already
                if (popup && !popup.closed) {
                  popup.close();
                }

                // GET DATA
                console.log('GET DATA')
                getGuilds()

              }
            });
          }}>{cookieValue ? `Cookie Value: ${cookieValue}` : '-'}</button>

          <button onClick={() => setStage('server_selection')} style={{ color: 'darkgray' }}>.</button> */}
            </VStack>
          </>
        )}
        {stage === "useCase" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              What kind of form would you like to create?
            </Text>
            <VStack align="center" mt={10} width="100%" gap={10}>
              <VStack align="left">
                <FormLabel fontSize={18}>Basic</FormLabel>
                <Box>
                  <Box
                    transition="background 0.2s"
                    _hover={{ cursor: "pointer", background: "#1E1F22" }}
                    onClick={() => setOpenFormType("button")}
                    border={
                      openFormType === "button" ? "2px solid #5865F2" : "none"
                    }
                    background="#2B2D31"
                    width="250px"
                    height="105px"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  ></Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports up to 5 different forms per message.
                  </Text>
                </Box>
                <FormLabel fontSize={18}>Application</FormLabel>
                <Box>
                  <Box
                    transition="background 0.2s"
                    _hover={{ cursor: "pointer", background: "#1E1F22" }}
                    onClick={() => setOpenFormType("select_menu")}
                    border={
                      openFormType === "select_menu"
                        ? "2px solid #5865F2"
                        : "none"
                    }
                    background="#2B2D31"
                    width="250px"
                    height="105px"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  ></Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports up to 25 different forms per message.
                  </Text>
                </Box>
                <FormLabel fontSize={18}>Ticket</FormLabel>
                <Box>
                  <Box
                    transition="background 0.2s"
                    _hover={{ cursor: "pointer", background: "#1E1F22" }}
                    onClick={() => setOpenFormType("application_command")}
                    border={
                      openFormType === "application_command"
                        ? "2px solid #5865F2"
                        : "none"
                    }
                    background="#2B2D31"
                    width="250px"
                    height="105px"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      height="100%"
                      src="https://cdn.discordapp.com/attachments/943471614580903956/1241452276246118400/Screenshot_2024-05-18_at_19.57.40.png?ex=664a4007&is=6648ee87&hm=51ee3e0c269ede6a9f27617fc52c4f45129f4b944e7ebbef527c91212699a8ae&"
                    ></Image>
                  </Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports 1 form per command.
                  </Text>
                </Box>
              </VStack>
              <HStack>
                <Button variant="secondary" onClick={() => setStage("welcome")}>
                  Go back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    switch (openFormType) {
                      case "application_command":
                        setStage("applicationCommand");
                        break;
                      case "button":
                      case "select_menu":
                        setStage("form");
                        break;
                    }
                  }}
                >
                  Continue
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "openFormType" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              How should users open your form?
            </Text>
            <VStack align="center" mt={10} width="100%" gap={10}>
              <VStack align="left">
                <FormLabel fontSize={18}>Buttons</FormLabel>
                <Box>
                  <Box
                    transition="border 0.2s"
                    _hover={{
                      cursor: "pointer",
                      border: `2px solid ${
                        openFormType === "button"
                          ? "rgb(71, 82, 196)"
                          : "#1E1F22"
                      }`,
                    }}
                    onClick={() => {
                      if (openFormType === "button") setStage("form");
                      setOpenFormType("button");
                    }}
                    border={
                      openFormType === "button"
                        ? "2px solid #5865F2"
                        : "2px solid #2B2D31"
                    }
                    borderRadius="10px"
                  >
                    <Image
                      src="/preview/buttons.svg"
                      style={{ margin: 5 }}
                      alt="Buttons Form Preview"
                    />
                  </Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports up to 5 different forms per message.
                  </Text>
                </Box>
                <FormLabel fontSize={18}>Select Menu</FormLabel>
                <Box>
                  <Box
                    transition="border 0.2s"
                    _hover={{
                      cursor: "pointer",
                      border: `2px solid ${
                        openFormType === "select_menu"
                          ? "rgb(71, 82, 196)"
                          : "#1E1F22"
                      }`,
                    }}
                    onClick={() => {
                      if (openFormType === "select_menu") setStage("form");
                      setOpenFormType("select_menu");
                    }}
                    border={
                      openFormType === "select_menu"
                        ? "2px solid #5865F2"
                        : "2px solid #2B2D31"
                    }
                    borderRadius="10px"
                  >
                    <Image
                      src="/preview/select_menu.svg"
                      style={{ margin: 5 }}
                      alt="Select Menu Form Preview"
                    />
                  </Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports up to 25 different forms per message.
                  </Text>
                </Box>
                <FormLabel fontSize={18}>Slash Command</FormLabel>
                <Box>
                  <Box
                    transition="border 0.2s"
                    _hover={{
                      cursor: "pointer",
                      border: `2px solid ${
                        openFormType === "application_command"
                          ? "rgb(71, 82, 196)"
                          : "#1E1F22"
                      }`,
                    }}
                    onClick={() => {
                      if (openFormType === "application_command")
                        setStage("applicationCommand");
                      setOpenFormType("application_command");
                    }}
                    border={
                      openFormType === "application_command"
                        ? "2px solid #5865F2"
                        : "2px solid #2B2D31"
                    }
                    borderRadius="10px"
                  >
                    <Image
                      src="/preview/app_command.svg"
                      style={{ margin: 5 }}
                      alt="Slash Command Form Preview"
                    />
                  </Box>
                  <Text fontSize={12} color="#DBDEE1">
                    Supports 1 form per command.
                  </Text>
                </Box>
              </VStack>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => {
                    _setSubmissionChannel(["existing"]);
                    setValue("forms.0.submit_channel_id", undefined);
                    setValue("forms.0.submit_channel", undefined);
                    setValue("forms.0.submit_thread", undefined);
                    setValue("forms.0.submit_components", undefined);
                    setPremium(false);
                    setStage("welcome");
                  }}
                >
                  Go back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    switch (openFormType) {
                      case "application_command":
                        setStage("applicationCommand");
                        break;
                      case "button":
                      case "select_menu":
                        setStage("form");
                        break;
                    }
                  }}
                >
                  Continue
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "applicationCommand" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              Setup slash command
            </Text>
            <VStack align="center" mt={5} width="100%" gap={5}>
              <Box width="100%" maxWidth="350px">
                <ApplicationCommandBuilder
                  register={register}
                  getValues={getValues}
                  setValue={setValue}
                  errors={formState.errors}
                />
              </Box>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => setStage("openFormType")}
                >
                  Go back
                </Button>
                <Button
                  variant="primary"
                  isDisabled={
                    (getValues("application_command")?.name
                      ? formState.errors.application_command?.name
                        ? true
                        : false
                      : true) ||
                    (getValues("application_command")?.description
                      ? formState.errors.application_command?.description
                        ? true
                        : false
                      : true)
                  }
                  onClick={() => setStage("form")}
                >
                  Continue
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "form" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              Setup form
            </Text>
            <VStack align="center" mt={5} width="100%" gap={5}>
              <Box width="100%" maxWidth="500px">
                <FormTitleInput
                  index={0}
                  pageIndex={0}
                  register={register}
                  getValues={getValues}
                  fixMessage={fixMessage}
                  errors={formState.errors}
                />
                <TextInputBuilder
                  compact
                  id={`forms.0.pages.0.modal.components`}
                  nestIndex={0}
                  pageIndex={0}
                  {...{
                    control,
                    register,
                    formState,
                    watch,
                    setValue,
                    resetField,
                    fixMessage,
                    textInputMaxLength,
                  }}
                />
              </Box>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => {
                    switch (openFormType) {
                      case "application_command":
                        setStage("applicationCommand");
                        break;
                      case "button":
                      case "select_menu":
                        setStage("openFormType");
                        break;
                    }
                  }}
                >
                  Go back
                </Button>
                <Button
                  variant="primary"
                  isDisabled={
                    !getValues("forms.0")?.pages?.[0]?.modal?.title ||
                    (getValues("forms.0")?.pages?.[0]?.modal?.components[0]
                      ? !getValues("forms.0")?.pages?.[0]?.modal?.components[0]
                          .components?.[0]?.label
                      : false) ||
                    (getValues("forms.0")?.pages?.[0]?.modal?.components[1]
                      ? !getValues("forms.0")?.pages?.[0]?.modal?.components[1]
                          .components?.[0]?.label
                      : false) ||
                    (getValues("forms.0")?.pages?.[0]?.modal?.components[2]
                      ? !getValues("forms.0")?.pages?.[0]?.modal?.components[2]
                          .components?.[0]?.label
                      : false) ||
                    (getValues("forms.0")?.pages?.[0]?.modal?.components[3]
                      ? !getValues("forms.0")?.pages?.[0]?.modal?.components[3]
                          .components?.[0]?.label
                      : false) ||
                    (getValues("forms.0")?.pages?.[0]?.modal?.components[4]
                      ? !getValues("forms.0")?.pages?.[0]?.modal?.components[4]
                          .components?.[0]?.label
                      : false) ||
                    formState.errors.forms?.[0]?.pages?.[0]?.modal
                      ? true
                      : false
                  }
                  onClick={() => setStage("submissions")}
                >
                  Continue
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "submissions" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              Where should{" "}
              {formCreationFeatures.includes("approval_forward_submission")
                ? "to be approved "
                : ""}
              submissions be sent?
            </Text>
            <VStack align="center" mt={5} width="100%" gap={5}>
              <Box width="100%" maxWidth="500px">
                {/* Create a webhook in the channel you want submissions to be sent to.<br /><br />
              <WebhookURLInput index={0} register={register} webhookUrlFocused={webhookUrlFocused} webhookUrlSetFocused={webhookUrlSetFocused} errors={formState.errors} fixMessage={fixMessage} />
              <Text fontSize={12}>Channel Settings –&gt; Integrations –&gt; Webhooks –&gt; New Webhook –&gt; Copy Webhook URL<br /><br /></Text>
              In the webhooks settings you can customise the name and avatar of your submissions. */}

                {getValues("forms.0.submit_channel") ? (
                  <>
                    <FormLabel htmlFor={`forms.0.submit_channel.parent_id`}>
                      Category ID
                    </FormLabel>
                    <input
                      {...register(`forms.0.submit_channel.parent_id`, {
                        pattern: /^\d{10,20}$/,
                        onChange: () => fixSubmitChannel(0),
                      })}
                      id={`forms.0.submit_channel.parent_id`}
                    />
                    <ErrorMessage
                      error={
                        formState.errors.forms?.[0]?.submit_channel?.parent_id
                      }
                    />
                    <Text fontSize={12}>
                      User Settings –&gt; Advanced –&gt; Enable Developer Mode
                      <br /> Then create a category for submissions in your
                      server –&gt; Right Click –&gt; Copy Channel ID
                      <br />
                      <br />
                    </Text>
                  </>
                ) : (
                  <>
                    <SubmissionChannelIDInput
                      index={0}
                      register={register}
                      errors={formState.errors}
                      watch={watch}
                      fixMessage={fixMessage}
                      currentGuild={currentGuild}
                      getValues={getValues}
                      setValue={setValue}
                      cookieValue={cookieValue}
                      getGuild={getGuild}
                      getGuilds={getGuilds}
                      stage={stage}
                      setCookieValue={setCookieValue}
                      loadingGuild={loadingGuild}
                      setLoadingGuild={setLoadingGuild}
                      onOpenAddToServer={onOpenAddToServer}
                      guilds={guilds}
                      currentGuildID={currentGuildID}
                      setCurrentGuildID={setCurrentGuildID}
                    />
                  </>
                )}
              </Box>
              <HStack>
                <Button variant="secondary" onClick={() => setStage("form")}>
                  Go back
                </Button>
                <Button
                  variant="primary"
                  isDisabled={
                    (!getValues("forms.0.submit_channel.parent_id") &&
                      !getValues("forms.0")?.submit_channel_id) ||
                    formState.errors.forms
                      ? true
                      : false
                  }
                  onClick={() => {
                    if (
                      submissionChannel[0] === "new" &&
                      getValues("forms.0.submit_channel.parent_id") === ""
                    )
                      setValue("forms.0.submit_channel.parent_id", undefined);
                    if (
                      formCreationFeatures.includes(
                        "approval_forward_submission"
                      )
                    ) {
                      setStage("forward_submission_on_accept");
                    } else {
                      setStage("finishOrContinue");
                    }
                  }}
                >
                  {getValues("forms.0.submit_channel")
                    ? getValues("forms.0.submit_channel.parent_id")
                      ? "Continue"
                      : "Continue"
                    : "Continue"}
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "forward_submission_on_accept" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              Where should approved submissions be sent?
            </Text>
            <VStack align="center" mt={5} width="100%" gap={5}>
              <Box width="100%" maxWidth="500px">
                <FormLabel
                  htmlFor={`forms.0.submit_components.0.components.0.logic.FORWARD_SUBMISSION`}
                >
                  Channel ID
                </FormLabel>
                <input
                  {...register(
                    `forms.0.submit_components.0.components.0.logic.FORWARD_SUBMISSION`,
                    { pattern: /^\d{10,20}$/ }
                  )}
                  id={`forms.0.submit_components.0.components.0.logic.FORWARD_SUBMISSION`}
                  type="number"
                  inputMode="numeric"
                />
                <ErrorMessage
                  error={
                    formState.errors.forms?.[0]?.submit_components?.[0]
                      ?.components?.[0]?.logic?.FORWARD_SUBMISSION
                  }
                />
                <Text fontSize={12}>
                  User Settings –&gt; Advanced –&gt; Enable Developer Mode –&gt;
                  <br /> Right-click your channel –&gt; Copy Channel ID
                  <br />
                  <br />
                </Text>
              </Box>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => setStage("submissions")}
                >
                  Go back
                </Button>
                <Button
                  variant="primary"
                  isDisabled={
                    (!getValues("forms.0.submit_channel.parent_id") &&
                      !getValues("forms.0")?.submit_channel_id) ||
                    formState.errors.forms
                      ? true
                      : false
                  }
                  onClick={() => {
                    setStage("finishOrContinue");
                  }}
                >
                  Continue
                </Button>
              </HStack>
            </VStack>
          </>
        )}
        {stage === "finishOrContinue" && (
          <>
            <Text
              mt={5}
              align="center"
              width="100%"
              fontSize={25}
              fontFamily="Whitney Bold"
            >
              Done
            </Text>
            <VStack align="center" mt={5} width="100%" gap={5}>
              <Box width="100%" maxWidth="500px">
                <Text fontSize={20} fontFamily="Whitney Bold">
                  Continue to advanced customisation
                </Text>
                <Text mb={2}>
                  Add more forms, edit the message, add placeholders and more!
                </Text>
                <Button
                  mb={5}
                  variant="primary"
                  onClick={() => setStage("editor")}
                >
                  Open Editor
                </Button>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Divider bg="grey" />
                  <Text mx={4} fontSize={18}>
                    or
                  </Text>
                  <Divider bg="grey" />
                </Box>
                <Text fontSize={20} fontFamily="Whitney Bold">
                  Finish
                </Text>
                <Text mb={2}>
                  Using <UserMention isFormsBot>Forms</UserMention>, run{" "}
                  <SlashCommand>form create</SlashCommand> and upload the
                  configuration file.
                </Text>
                <HStack alignItems="flex-start">
                  <HStack>
                    <Button
                      variant="success"
                      disabled={!formState.isValid}
                      onClick={() => {
                        handleLoad();
                        downloadForm();
                      }}
                      width={225}
                    >
                      {!loading && "Download Configuration File"}
                      {loading && <Spinner size="sm" />}
                    </Button>
                    <Link
                      href="https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=805309456&scope=bot+applications.commands"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="success-outline">Invite Bot</Button>
                    </Link>
                  </HStack>
                </HStack>
              </Box>
              <HStack>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (
                      formCreationFeatures.includes(
                        "approval_forward_submission"
                      )
                    ) {
                      setStage("forward_submission_on_accept");
                    } else {
                      setStage("submissions");
                    }
                  }}
                >
                  Go back
                </Button>
              </HStack>
            </VStack>
          </>
        )}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="grey.dark">
          <ModalHeader>How to get your Submission Channel ID</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5}>
            <Text fontFamily="Whitney Bold">1. Enable Developer Mode</Text> Go
            to your User Settings in discord and in the advanced section enable
            "Developer Mode".
            <br />
            <br />
            <Text fontFamily="Whitney Bold">2. Copy the Channel ID</Text> Go to
            the discord channel where you'd like to have submissions posted to,
            right click it and click "Copy Channel ID".
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" onClick={onClose}>
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenAddToServer} onClose={onCloseAddToServer}>
        <ModalOverlay />
        <ModalContent bg="grey.dark">
          <ModalHeader>Add Forms to your server</ModalHeader>
          {/* <ModalCloseButton /> */}
          {/* <ModalBody pt={5}>
            <Text fontFamily='Whitney Bold'>1. Enable Developer Mode</Text>
          </ModalBody> */}

          <ModalFooter>
            <Button
              variant="primary"
              onClick={() => {
                onCloseAddToServer();

                const popup = window.open(
                  `https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=378762431504&integration_type=0&scope=bot+applications.commands&guild_id=${currentGuild}&disable_guild_select=true&response_type=code&redirect_uri=https%3A%2F%2Fcreate.discordforms.app%2Fapi%2Fdiscord%2Fauthorized`,
                  "popup",
                  "popup=true,width=485,height=700"
                );

                window.addEventListener("message", (event) => {
                  if (event.data === "authorized") {
                    // Close the popup if it hasn't been closed already
                    if (popup && !popup.closed) {
                      popup.close();
                    }
                    getGuild(currentGuild);
                  }
                });
              }}
            >
              Add to server
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenPremium} onClose={onClosePremium}>
        <ModalOverlay />
        <ModalContent bg="grey.dark">
          <ModalHeader>You've discovered a premium feature!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5} fontSize="18px" fontWeight="600">
            <VStack gap={4} align="flex-start">
              <Text fontWeight="400">Premium Features</Text>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_733_18)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M37.4903 37.4903C61.495 13.4857 94.0523 0 128 0C161.948 0 194.505 13.4857 218.51 37.4903C242.514 61.495 256 94.0523 256 128C256 148.416 251.122 168.33 242.013 186.181L239.044 192H192C162.545 192 138.667 215.878 138.667 245.333V256H128C94.0523 256 61.495 242.514 37.4903 218.51C13.4857 194.505 0 161.948 0 128C0 94.0523 13.4857 61.495 37.4903 37.4903ZM94.6725 88.944C104.98 88.9377 113.333 80.5802 113.333 70.2715C113.333 59.9589 104.973 51.5989 94.6608 51.5989C84.3536 51.6053 76 59.9642 76 70.2727C76 80.5854 84.36 88.944 94.6725 88.944ZM161.339 88.944C171.646 88.9377 180 80.5802 180 70.2715C180 59.9589 171.641 51.5989 161.328 51.5989C151.021 51.6053 142.667 59.9642 142.667 70.2727C142.667 80.5854 151.026 88.944 161.339 88.944ZM213.355 128.005C213.355 138.315 205.001 146.672 194.693 146.678C184.381 146.678 176.021 138.32 176.021 128.007C176.021 117.698 184.374 109.34 194.682 109.333C204.994 109.333 213.355 117.693 213.355 128.005ZM61.36 146.678C71.6672 146.672 80.0208 138.315 80.0208 128.005C80.0208 117.693 71.6609 109.333 61.3483 109.333C51.0412 109.34 42.6875 117.698 42.6875 128.007C42.6875 138.32 51.0475 146.678 61.36 146.678Z"
                        fill="url(#paint0_linear_733_18)"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_733_18"
                        x1="0"
                        y1="128"
                        x2="256"
                        y2="128"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                      <clipPath id="clip0_733_18">
                        <rect width="256" height="256" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "custom_branding"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Custom Branding
                </Text>
              </HStack>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M138.064 4.36718C141.624 9.15221 140.61 15.9022 135.8 19.4437L44.2921 86.8176C43.0392 88.0845 42.6897 89.6412 42.6709 91.3679V204.8C42.6709 210.754 37.8196 215.579 31.8354 215.579C25.8512 215.579 21 210.754 21 204.8L21.0221 90.1566C21.0429 89.4959 21.085 88.572 21.1717 87.5409C21.2566 86.534 21.3961 85.2772 21.6397 83.9922C21.8513 82.8751 22.2755 80.9746 23.2263 79.0933C24.9323 75.7176 27.6236 72.2699 30.7476 69.9698L122.908 2.11556C127.718 -1.42594 134.503 -0.417853 138.064 4.36718ZM227.232 47.4214C222.83 45.2743 218.043 45.2743 213.641 47.4214C213.252 47.6108 212.881 47.8306 212.527 48.0788L120.35 112.899C118.004 114.468 114.863 117.066 112.917 120.863C111.292 124.034 110.392 127.637 110.392 131.071V241.996C110.392 246.786 112.896 251.92 118.16 254.487C118.501 254.654 118.853 254.795 119.212 254.913C121.169 255.549 123.835 256.239 126.775 255.919C129.795 255.592 132.315 254.306 134.373 252.479L225.114 188.96C225.238 188.872 225.362 188.781 225.481 188.686C227.451 187.135 230.443 184.725 232.389 180.926C233.879 178.021 235 174.528 235 170.837V59.9124C235 55.1226 232.496 49.9886 227.232 47.4214ZM179.142 41.0019C183.952 37.4604 184.966 30.7104 181.406 25.9254C177.845 21.1403 171.06 20.1323 166.25 23.6738L74.0893 91.528C70.9654 93.828 68.2741 97.2758 66.568 100.652C65.6173 102.533 65.1931 104.433 64.9815 105.55C64.7379 106.835 64.5984 108.092 64.5135 109.1C64.4267 110.13 64.3847 111.054 64.3639 111.715L64.3418 226.358C64.3418 232.311 69.193 237.137 75.1772 237.137C81.1614 237.137 86.0127 232.311 86.0127 226.358V112.926C86.0315 111.199 86.381 109.643 87.6339 108.375L179.142 41.0019Z"
                      fill="url(#paint0_linear_788_15)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_788_15"
                        x1="21"
                        y1="128"
                        x2="235"
                        y2="128"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "multiple_pages"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Multiple Pages
                </Text>
              </HStack>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 201"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M157.595 0H27.6488C12.3788 0 0 12.379 0 27.6489V64.4883C0 68.6791 2.82737 72.3422 6.88144 73.404C18.878 76.5456 27.7181 87.4704 27.7181 100.437C27.7181 113.403 18.8779 124.328 6.88144 127.47C2.82737 128.531 0 132.194 0 136.385V173.224C0 188.494 12.3789 200.873 27.6488 200.873H157.595V169.261C157.595 162.898 162.753 157.741 169.116 157.741C175.478 157.741 180.636 162.898 180.636 169.261V200.873H228.351C243.623 200.873 256 188.494 256 173.224V136.303C256 132.142 253.213 128.497 249.197 127.408C237.317 124.187 228.591 113.319 228.591 100.437C228.591 87.5545 237.317 76.6866 249.197 73.4655C253.213 72.3765 256 68.7317 256 64.5705V27.6489C256 12.3788 243.623 0 228.351 0H180.636V31.7649C180.636 38.1273 175.478 43.2853 169.116 43.2853C162.753 43.2853 157.595 38.1273 157.595 31.7649V0ZM169.116 70.3233C175.478 70.3233 180.636 75.4811 180.636 81.8437V119.005C180.636 125.367 175.478 130.525 169.116 130.525C162.753 130.525 157.595 125.367 157.595 119.005V81.8437C157.595 75.4811 162.753 70.3233 169.116 70.3233Z"
                      fill="url(#paint0_linear_845_3)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_845_3"
                        x1="0"
                        y1="100.436"
                        x2="256"
                        y2="100.436"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "tickets"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Ticket System
                </Text>
              </HStack>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_764_24"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="256"
                      height="256"
                    >
                      <path
                        d="M116.361 115.2V91.1045C102.802 86.3123 93.088 73.3815 93.088 58.1819C93.088 38.9021 108.717 23.2727 127.997 23.2727C147.277 23.2727 162.906 38.9021 162.906 58.1819H186.179C186.179 26.0489 160.129 0 127.997 0C95.8642 0 69.8154 26.0489 69.8154 58.1819C69.8154 79.069 80.8218 97.3855 97.3512 107.648L61.6107 174.797C60.4909 174.632 59.345 174.546 58.1791 174.546C45.3259 174.546 34.9064 184.965 34.9064 197.818C34.9064 210.672 45.3259 221.091 58.1791 221.091C67.7222 221.091 75.9239 215.347 79.5152 207.127H176.479C180.07 215.347 188.272 221.091 197.815 221.091C210.668 221.091 221.088 210.672 221.088 197.818C221.088 184.965 210.668 174.546 197.815 174.546C188.272 174.546 180.07 180.289 176.479 188.509H79.5153C79.4554 188.372 79.3942 188.236 79.3317 188.1L116.361 115.2Z"
                        fill="url(#paint0_linear_764_24)"
                      />
                      <path
                        d="M128 81.4545C115.147 81.4545 104.727 71.035 104.727 58.1818C104.727 45.3286 115.147 34.9091 128 34.9091C140.854 34.9091 151.273 45.3286 151.273 58.1818C151.273 63.247 149.654 67.9342 146.907 71.7548L197.818 139.636C229.951 139.636 256 165.686 256 197.818C256 229.951 229.951 256 197.818 256C173.96 256 153.456 241.64 144.477 221.091H171.798C178.19 228.233 187.479 232.727 197.818 232.727C217.097 232.727 232.727 217.098 232.727 197.818C232.727 178.538 217.097 162.909 197.818 162.909H186.182L128 81.4545Z"
                        fill="url(#paint1_linear_764_24)"
                      />
                      <path
                        d="M111.522 221.09C102.544 241.638 82.0397 255.999 58.1816 255.999C26.0488 255.999 0 229.95 0 197.817C0 165.684 26.0488 139.635 58.1816 139.635V162.908C38.9019 162.908 23.2726 178.537 23.2726 197.817C23.2726 217.097 38.9019 232.726 58.1816 232.726C68.5204 232.726 77.8096 228.232 84.2016 221.09H111.522Z"
                        fill="url(#paint2_linear_764_24)"
                      />
                    </mask>
                    <g mask="url(#mask0_764_24)">
                      <rect
                        x="-61.6441"
                        y="-92.16"
                        width="410.961"
                        height="419.84"
                        fill="url(#paint3_linear_764_24)"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_764_24"
                        x1="34.9064"
                        y1="110.546"
                        x2="221.088"
                        y2="110.546"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_764_24"
                        x1="104.727"
                        y1="145.455"
                        x2="256"
                        y2="145.455"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_764_24"
                        x1="0"
                        y1="197.817"
                        x2="111.522"
                        y2="197.817"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_764_24"
                        x1="-61.6441"
                        y1="117.76"
                        x2="349.317"
                        y2="117.76"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "webhook_submissions"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Webhook Submissions
                </Text>
              </HStack>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M128 256C148.717 256.001 169.013 250.166 186.551 239.167C204.09 228.169 218.157 212.453 227.135 193.831C236.113 175.208 239.635 154.435 237.297 133.903C234.959 113.371 226.855 93.9152 213.919 77.7752L222.229 69.6076C224.531 67.3121 225.824 64.1987 225.824 60.9524C225.824 57.706 224.531 54.5927 222.229 52.2971C219.928 50.0016 216.807 48.712 213.552 48.712C210.297 48.712 207.176 50.0016 204.875 52.2971L196.686 60.5867C180.474 47.5954 160.889 39.477 140.222 37.181V24.381H164.665C167.906 24.381 171.015 23.0966 173.307 20.8104C175.599 18.5243 176.887 15.4236 176.887 12.1905C176.887 8.95736 175.599 5.85667 173.307 3.57051C171.015 1.28435 167.906 0 164.665 0H91.3349C88.0935 0 84.9848 1.28435 82.6928 3.57051C80.4008 5.85667 79.1132 8.95736 79.1132 12.1905C79.1132 15.4236 80.4008 18.5243 82.6928 20.8104C84.9848 23.0966 88.0935 24.381 91.3349 24.381H115.778V37.181C94.5125 39.619 75.2022 47.9086 59.314 60.5867L51.1255 52.2971C48.8241 50.0016 45.7027 48.712 42.4481 48.712C39.1934 48.712 36.0721 50.0016 33.7707 52.2971C31.4693 54.5927 30.1764 57.706 30.1764 60.9524C30.1764 64.1987 31.4693 67.3121 33.7707 69.6076L42.0814 77.7752C29.1449 93.9152 21.0411 113.371 18.7029 133.903C16.3647 154.435 19.8872 175.208 28.8649 193.831C37.8426 212.453 51.9104 228.169 69.4488 239.167C86.9872 250.166 107.283 256.001 128 256ZM173.22 118.248C174.985 115.9 175.842 112.996 175.634 110.069C175.425 107.142 174.165 104.388 172.085 102.313C170.005 100.238 167.244 98.9816 164.309 98.7735C161.375 98.5655 158.463 99.4203 156.11 101.181L119.445 137.752C117.68 140.1 116.823 143.004 117.031 145.931C117.24 148.858 118.5 151.612 120.58 153.687C122.66 155.762 125.421 157.018 128.356 157.226C131.29 157.434 134.202 156.58 136.555 154.819L173.22 118.248Z"
                      fill="url(#paint0_linear_739_4)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_739_4"
                        x1="18"
                        y1="128"
                        x2="238"
                        y2="128"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "submission_cooldown"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Submission Cooldown
                </Text>
              </HStack>
              <HStack>
                <Box width="32px">
                  <svg
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M192.8 64V96C210.032 96 224 109.969 224 127.2V224C224 241.673 209.674 256 192 256H64C46.3265 256 32 241.673 32 224V128C32 110.327 46.3265 96 64 96V64C64 28.16 94.4 0 128 0C161.6 0 192.8 28.16 192.8 64ZM96.0001 96H160V64C160 45.7142 145.066 32 128 32C110.934 32 96.0001 45.7142 96.0001 64V96Z"
                      fill="url(#paint0_linear_754_3)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_754_3"
                        x1="32"
                        y1="128"
                        x2="224"
                        y2="128"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#3442D9" />
                        <stop offset="1" stop-color="#0176A4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Text
                  className={
                    premiumFeatureTarget === "require_permissions"
                      ? "highlighted-feature"
                      : ""
                  }
                >
                  Require permissions to use buttons
                </Text>
              </HStack>
              <Text fontWeight="400">
                Unlock all premium features for €4.99/month
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="space-between">
            <Button
              variant="link"
              onClick={() => {
                setPremium(true);
                onClosePremium();
              }}
            >
              I already have premium
            </Button>
            <HStack>
              <Button variant="secondary" onClick={onClosePremium}>
                Not now
              </Button>
              <Link
                href="https://forms.lemonsqueezy.com/buy/6c238e6d-28f7-44ea-b965-b2f8c9e2512b"
                target="_blank"
              >
                <Button variant="success">Upgrade</Button>
              </Link>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
