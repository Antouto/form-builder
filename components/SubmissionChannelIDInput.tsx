import {
  Button,
  FormLabel,
  HStack,
  Stack,
  Select,
  Text,
  Box,
  useColorMode,
  Skeleton,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import ReactSelect from "react-select";
import { useScreenWidth } from "../util/width";
import { ChannelIdHint } from "./Hints";
import {
  FieldErrors,
  SetFieldValue,
  UseFormGetValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { FormAndOpenFormTypeBuilder, Guild } from "../util/types";

type InputMethod = "login" | "manual";

export default function SubmissionChannelIDInput({
  register,
  index,
  errors,
  fixMessage,
  watch,
  onOpenWhereDoIFindSubmissionChannelID,
  currentGuild,
  getValues,
  setValue,
  cookieValue,
  setCookieValue,
  getGuild,
  getGuilds,
  stage,
  setLoadingGuild,
  onOpenAddToServer,
  loadingGuild,
  guilds,
  currentGuildID,
  setCurrentGuildID,
}: {
  // Should be typed
  register: UseFormRegister<FormAndOpenFormTypeBuilder>;
  index: number;
  errors: FieldErrors<FormAndOpenFormTypeBuilder>;
  fixMessage: any;
  watch: UseFormWatch<FormAndOpenFormTypeBuilder>;
  onOpenWhereDoIFindSubmissionChannelID: (() => unknown) | null;
  currentGuild: Guild;
  getValues: UseFormGetValues<FormAndOpenFormTypeBuilder>;
  setValue: SetFieldValue<FormAndOpenFormTypeBuilder>;
  cookieValue: boolean;
  setCookieValue: React.Dispatch<React.SetStateAction<boolean>>;
  getGuild: (value: any) => unknown;
  getGuilds: () => void;
  guilds: Guild[];
  stage: string;
  setLoadingGuild: (value: boolean) => unknown;
  onOpenAddToServer: () => unknown;
  loadingGuild: boolean;
  currentGuildID: string | undefined;
  setCurrentGuildID: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const colorMode = useColorMode().colorMode;

  const [inputMethod, _setInputMethod] = useState<InputMethod | null>(); // login or manual
  const isReallySmallScreen = !useScreenWidth(450);

  function setInputMethod(method: InputMethod) {
    _setInputMethod(method);
    if (method === "login") {
      const popup = window.open(
        `https://discord.com/oauth2/authorize?client_id=942858850850205717&response_type=code&redirect_uri=https%3A%2F%2Fcreate.discordforms.app%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds&prompt=none`,
        "popup",
        "popup=true,width=485,height=700"
      );

      const monitorPopupClosed = () => {
        const interval = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(interval);
            _setInputMethod(null);
          }
        }, 500); // 500ms
      };

      monitorPopupClosed();

      window.addEventListener("message", (event) => {
        if (event.data === "authorized") {
          // Close the popup if it hasn't been closed already
          if (popup && !popup.closed) {
            popup.close();
          }

          // GET DATA
          console.log("GET DATA");
          getGuilds();
          setCookieValue(true);
          // setStage('submissions')
        }
      });
    }
  }

  const Label = () => (
    <FormLabel
      htmlFor={`forms[${index}].submit_channel_id`}
      display="flex"
      alignItems="center"
    >
      <Text
        marginRight="5px"
      >
        Submission Channel {inputMethod === "manual" ? "ID" : ""}
      </Text>
      {onOpenWhereDoIFindSubmissionChannelID &&
        !Array.isArray(currentGuild) && (
          <Text
            color="#00b0f4"
            fontFamily="Whitney"
            textDecoration="underline"
            onClick={onOpenWhereDoIFindSubmissionChannelID}
            _hover={{ cursor: "pointer" }}
          >
            Where do I find this?
          </Text>
        )}
    </FormLabel>
  );

  const getChannelIcon = (type: number) => (
    <svg
      aria-hidden="true"
      role="img"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      style={{ color: "currentColor" }}
    >
      {type === 15 ? (
        // Forum channel icon
        <>
          <path
            fill="currentColor"
            d="M18.91 12.98a5.45 5.45 0 0 1 2.18 6.2c-.1.33-.09.68.1.96l.83 1.32a1 1 0 0 1-.84 1.54h-5.5A5.6 5.6 0 0 1 10 17.5a5.6 5.6 0 0 1 5.68-5.5c1.2 0 2.32.36 3.23.98Z"
          ></path>
          <path
            fill="currentColor"
            d="M19.24 10.86c.32.16.72-.02.74-.38L20 10c0-4.42-4.03-8-9-8s-9 3.58-9 8c0 1.5.47 2.91 1.28 4.11.14.21.12.49-.06.67l-1.51 1.51A1 1 0 0 0 2.4 18h5.1a.5.5 0 0 0 .49-.5c0-4.2 3.5-7.5 7.68-7.5 1.28 0 2.5.3 3.56.86Z"
          ></path>
        </>
      ) : (
        // Default text channel icon
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );

  return (
    <>
      {/* Logging in */}
      {inputMethod == "login" && (
        <Skeleton
          height="100px"
          startColor={"hsla(0 0% 100% / 0.25)"}
          endColor={"hsla(0 0% 100% / 0.20)"}
          borderRadius={15}
        />
      )}

      {/* Not Logged in and input method not chosen and stage not editor */}
      {!cookieValue && !inputMethod && stage !== "editor" && (
        <Stack
          direction={isReallySmallScreen ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <Button variant="primary" onClick={() => setInputMethod("login")}>
            Login to choose channel
          </Button>
          <HStack gap={isReallySmallScreen ? 2 : 3}>
            <Text>or</Text>
            <button
              onClick={() => setInputMethod("manual")}
              style={{
                color: "oklab(0.700834 -0.0780351 -0.1469)",
                fontSize: "15px",
              }}
            >
              <Text _hover={{ textDecor: "underline" }}>
                enter Channel ID manually
              </Text>
            </button>
          </HStack>
        </Stack>
      )}

      {/* Logged in so Server Selection */}
      {cookieValue && (
        <Box mb={1}>
          <FormLabel display="flex" alignItems="center">
            <Text
              marginRight="5px"
              _after={{ content: '" *"', color: "#ff7a6b" }}
            >
              Server
            </Text>
          </FormLabel>
          <ReactSelect
            onChange={async (option) => {
              for (let i = 0; i < getValues("forms").length; i++) {
                //@ts-expect-error setting to undefined
                setValue(`forms.${i}.submit_channel_id`, undefined);
              }

              if (!option) return;
              setCurrentGuildID(option.value);

              setLoadingGuild(true);
              let guildResponse = await getGuild(option.value);
              setLoadingGuild(false);

              if (guildResponse === false) {
                onOpenAddToServer();
              } else {
                //setStage('submissions')
              }
            }}
            isLoading={loadingGuild}
            //defaultValue={guilds ? { label: guilds[0].name, value: guilds[0].id } : null}
            value={
              currentGuildID && guilds
                ? {
                  label:
                    guilds.find((guild) => guild.id === currentGuildID)
                      ?.name || "Server Name Unknown",
                  value: currentGuildID,
                }
                : null
            }
            isClearable={false}
            isSearchable={true}
            placeholder={"Select a server"}
            noOptionsMessage={() => "No results found"}
            name="Select server"
            options={
              guilds
                ? guilds.map((guild) => ({
                  label: guild.name,
                  value: guild.id,
                }))
                : []
            }
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
                display: "flex",
                ":before": {
                  flexShrink: 0,
                  backgroundImage: `url("https://cdn.discordapp.com/icons/${currentGuildID
                      ? currentGuildID
                      : guilds
                        ? guilds[0]?.id
                        : ""
                    }/${currentGuildID
                      ? guilds
                        ? guilds.find((guild) => guild.id === currentGuildID)
                          ?.icon
                        : ""
                      : "linear-gradient(rgba(255, 255, 255, .1), rgb(255, 255, 255, .1))"
                    }.webp?size=100")`,
                  backgroundSize: "contain",
                  borderRadius: 10,
                  content: '" "',
                  display: "block",
                  marginRight: 8,
                  height: "20px",
                  width: "20px",
                },
                color: "oklab(0.899401 -0.00192499 -0.00481987)",
              }),
              valueContainer: (baseStyles) => ({
                ...baseStyles,
                height: "43.5px",
                padding: "0 12px",
              }),
              singleValue: (baseStyles, state) => ({
                ...baseStyles,
                color: "oklab(0.899401 -0.00192499 -0.00481987)",
                margin: "0",
                alignItems: "center",
                display: "flex",
                ":before": {
                  backgroundImage: `url("https://cdn.discordapp.com/icons/${currentGuildID}/${guilds
                      ? guilds.find((guild) => guild.id === state.data.value)
                        ?.icon
                      : ""
                    }.webp?size=100")`,
                  backgroundSize: "contain",
                  borderRadius: 10,
                  content: '" "',
                  display: "block",
                  marginRight: 8,
                  height: "20px",
                  width: "20px",
                },
              }),
              placeholder: (baseStyles, state) => ({
                ...baseStyles,
                alignItems: "center",
                display: "flex",
                ":before": {
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, .1), rgb(255, 255, 255, .1))" /*`url("https://cdn.discordapp.com/icons/${state.value}/${guilds ? guilds.find(guild => guild.id === state.value)?.icon : ''}.webp?size=100")`*/,
                  backgroundSize: "contain",
                  borderRadius: 10,
                  content: '" "',
                  display: "block",
                  marginRight: 8,
                  height: "20px",
                  width: "20px",
                },
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                background: state.isSelected
                  ? "#404249"
                  : state.isFocused
                    ? "#35373c"
                    : "transparent",
                // height: '43.5px',
                padding: "9.75px",
                display: "flex",
                ":before": {
                  backgroundImage:
                    guilds &&
                      guilds.find((guild) => guild.id === state.data.value)
                      ? guilds.find((guild) => guild.id === state.data.value)
                        ?.icon
                        ? `url("https://cdn.discordapp.com/icons/${state.data.value
                        }/${guilds.find(
                          (guild) => guild.id === state.data.value
                        )?.icon
                        }.webp?size=100")`
                        : "linear-gradient(rgba(255, 255, 255, .1), rgb(255, 255, 255, .1))"
                      : "",
                  backgroundSize: "contain",
                  borderRadius: 10,
                  content: '" "',
                  display: "block",
                  marginRight: 8,
                  height: "20px",
                  width: "20px",
                },
                ":active": {
                  background: state.isSelected
                    ? "#404249"
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
        </Box>
      )}

      {/* Logged In or Input method manual */}
      {(cookieValue || inputMethod === "manual") &&
        Array.isArray(currentGuild) && (
          <>
            <Label />
            {/* <Select
          height='36px!important'
          // maxWidth='155px'
          borderWidth='2px'
          borderColor='transparent'
          borderRadius='4px'
          bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
          _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
          _hover={{ borderColor: 'transparent' }}
          onChange={(event) => setValue(`forms.${index}.submit_channel_id`, event.target.value)}
          value={watch(`forms.${index}.submit_channel_id`)}
        >
          <option disabled selected value="">Select a channel</option>
          {currentGuild.filter(channel => ![2, 4, 13, 14].includes(channel.type)).map(channel => <option key={Math.random()} value={channel.id}>{channel.name}</option>)}
        </Select> */}
            <ReactSelect
              onChange={(option) =>
                //@ts-expect-error
                setValue(
                  `forms.${index}.submit_channel_id`,
                  option?.value ?? ""
                )
              }
              isLoading={loadingGuild}
              value={
                watch(`forms.${index}.submit_channel_id`)
                  ? {
                    label:
                      currentGuild.find(
                        (channel) =>
                          channel.id ===
                          watch(`forms.${index}.submit_channel_id`)
                      )?.name || "Channel Name Unknown",
                    value: watch(`forms.${index}.submit_channel_id`),
                    type:
                      currentGuild.find(
                        (channel) =>
                          channel.id ===
                          watch(`forms.${index}.submit_channel_id`)
                      )?.type || "1",
                  }
                  : null
              }
              isClearable={false}
              isSearchable={true}
              placeholder={"Select a channel"}
              noOptionsMessage={() => "No results found"}
              name="Select channel"
              formatOptionLabel={({ label, type }) => (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {getChannelIcon(type)}
                  <span>{label}</span>
                </div>
              )}
              options={currentGuild
                .filter((channel) => ![2, 4, 13, 14].includes(channel.type))
                .map((channel) => ({
                  label: channel.name,
                  value: channel.id,
                  type: channel.type, // Make sure to include the type
                }))}
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
                  display: "flex",
                  color: "oklab(0.899401 -0.00192499 -0.00481987)",
                }),
                valueContainer: (baseStyles) => ({
                  ...baseStyles,
                  height: "43.5px",
                  padding: "0 12px",
                }),
                singleValue: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "oklab(0.899401 -0.00192499 -0.00481987)",
                  margin: "0",
                  alignItems: "center",
                  display: "flex",
                }),
                placeholder: (baseStyles, state) => ({
                  ...baseStyles,
                  alignItems: "center",
                  display: "flex",
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  background: state.isSelected
                    ? "#404249"
                    : state.isFocused
                      ? "#35373c"
                      : "transparent",
                  // height: '43.5px',
                  padding: "9.75px",
                  display: "flex",
                  ":active": {
                    background: state.isSelected
                      ? "#404249"
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
                  borderTopLeftRadius:
                    state.menuPlacement === "top" ? 0 : "4px",
                  borderTopRightRadius:
                    state.menuPlacement === "top" ? 0 : "4px",
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
          </>
        )}

      {cookieValue && (
        <Text
          mt={1}
          fontSize="14px"
          color="oklab(0.686636 -0.00407365 -0.0149199)"
        >
          Only servers and channels you have admin permissions in are shown.
        </Text>
      )}

      {(inputMethod === "manual" || (stage === "editor" && !cookieValue)) && (
        <>
          <Label />
          <input
            {...register(`forms.${index}.submit_channel_id`, {
              pattern: /^\d{10,20}$/,
              onChange: () => fixMessage('message'),
            })}
            id={`forms[${index}].submit_channel_id`}
            type="number"
            inputMode="numeric"
            style={{ marginBottom: "2px" }}
          />


          <ErrorMessage error={errors.forms?.[index]?.submit_channel_id} />

          {!cookieValue && (
            <>
              {!Array.isArray(currentGuild) &&
                !onOpenWhereDoIFindSubmissionChannelID && <ChannelIdHint />}
              <HStack gap={1}>
                <Text>or</Text>
                <button
                  onClick={() => setInputMethod("login")}
                  style={{
                    color: "oklab(0.700834 -0.0780351 -0.1469)",
                    fontSize: "15px",
                  }}
                >
                  <Text _hover={{ textDecor: "underline" }}>
                    login to choose channel
                  </Text>
                </button>
              </HStack>
            </>
          )}
        </>
      )}
    </>
  );
}
