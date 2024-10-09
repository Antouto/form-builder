/* eslint eqeqeq: 0 */
import {
  Box,
  Button,
  Circle,
  VStack,
  Image,
  Link,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  HStack,
  Switch,
} from "@chakra-ui/react";
//import Image from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FormBuilder, FormOpenFormTypeBuilder } from "../util/types";
import { FormProfile } from "./Mention";
import { PreviewStep } from "./PreviewStep";
import { AVATAR_URL } from "../util/config";

function isEmpty(value: any) {
  return value == null || value == "";
}

export interface PreviewProperties {
  message: FormOpenFormTypeBuilder;
  forms: FormBuilder[];
  select_menu_placeholder: string;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  displayPage: number;
  setDisplayPage: React.Dispatch<React.SetStateAction<number>>;
  displaySection: boolean;
  stage: string;
}

function Preview({
  message,
  forms,
  //@ts-expect-error
  application_command,
  select_menu_placeholder,
  displayForm,
  setDisplayForm,
  displayPage,
  setDisplayPage,
  displaySection,
  stage
}: PreviewProperties) {
  const { colorMode } = useColorMode();
  const defaultValues = {
    ...forms?.[displayForm]?.pages?.[displayPage]?.modal.components
      .map((e) => e.components[0])
      .map((e) => ({ [e.label]: e.value })),
  };
  const textInputs = useForm({
    defaultValues,
  });

  const applicationCommandRef = useRef(null)
  const formRef = useRef(null)

  //@ts-expect-error
  const executeApplicationCommandScroll = () => applicationCommandRef.current.scrollIntoView({ behavior: 'smooth' })
  //@ts-expect-error  
  const executeFormScroll = () => formRef.current.scrollIntoView({ behavior: 'smooth' })

  if (displayForm < 0) displayForm = 0;

  function decimalToHexColor(decimal: number) {
    // Extract the red, green, and blue components
    let r = (decimal >> 16) & 0xFF;
    let g = (decimal >> 8) & 0xFF;
    let b = decimal & 0xFF;

    // Convert each component to a hexadecimal string and pad with zeros if needed
    let rHex = r.toString(16).padStart(2, '0');
    let gHex = g.toString(16).padStart(2, '0');
    let bHex = b.toString(16).padStart(2, '0');

    // Concatenate the hexadecimal values and prepend with a '#'
    return `#${rHex}${gHex}${bHex}`;
}

  const MessageEmbed = (
    <>
      {message?.embeds &&
        message.embeds.map((embed) => (
          <Box
            key={Math.random()}
            borderLeftColor={
              //@ts-expect-error
              parseInt(embed?.color) ? decimalToHexColor(embed?.color) : "#202225"
            }
            borderLeftWidth="4px"
            mt="0.2rem"
            bg={colorMode === "dark" ? "#2f3136" : "#f2f3f5"}
            borderLeft={`4px solid ${!isEmpty(embed?.color)
              ? message?.embeds?.[0]?.color
              : colorMode === "dark"
                ? "#202225"
                : "#e3e5e8"
              }`}
            maxWidth="520px"
            borderRadius="4px"
          >
            <Box padding="0.5rem 1rem 1rem 0.75rem">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}{" "}
              <Link
                href={
                  embed?.author?.url == undefined ? undefined : embed.author.url
                }
                style={{
                  cursor: isEmpty(embed?.author?.url) ? "default" : "pointer",
                }}
                _hover={
                  isEmpty(embed?.author?.url)
                    ? { textDecoration: "none" }
                    : { textDecoration: "underline" }
                }
              >
                <Box display="flex" alignItems="center" m="2px 0px 0px">
                  {embed?.author?.icon_url != undefined && (
                    <Image
                      alt="Author Image"
                      src={embed.author.icon_url}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                    />
                  )}
                  <Box
                    fontSize="0.875rem"
                    fontWeight="500"
                    whiteSpace="pre-wrap"
                  >
                    {embed?.author?.name}
                  </Box>
                </Box>
              </Link>
              <Box>
                <Text
                  fontFamily="Whitney Bold"
                  fontSize="0.975rem"
                  mt="3px"
                  whiteSpace="pre-wrap"
                >
                  {embed?.title}
                </Text>
                <Text fontSize="0.875rem" color="#c5c5d3" whiteSpace="pre-wrap">
                  {embed?.description}
                </Text>
              </Box>
              {!isEmpty(embed?.image?.url) && (
                <Image
                  alt="Image"
                  src={embed?.image?.url}
                  style={{
                    maxWidth: "400px",
                    maxHeight: "300px",
                    borderRadius: "4px",
                    marginTop: "16px",
                  }}
                />
              )}
              {!isEmpty(embed?.footer?.text) && (
                <Box
                  display="flex"
                  alignItems="center"
                  mt="8px"
                  whiteSpace="pre-wrap"
                >
                  {embed?.footer?.icon_url != undefined && (
                    <Image
                      alt="Footer Icon"
                      src={embed.footer.icon_url}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                    />
                  )}
                  <Text
                    fontFamily="Whitney Bold"
                    fontSize="0.80rem"
                    color="#fbfbfb"
                  >
                    {embed?.footer?.text}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        ))}
    </>
  );

  const [FormsProfileHidden, setHidden] = useState(true);
  const HandleInteraction = () => setHidden(!FormsProfileHidden);
  const { isOpen, onToggle } = useDisclosure();

  const [temporaryModalHighlight, setTemporaryModalHighlight] = useState(false)
  const [temporarySubmissionHighlight, setTemporarySubmissionHighlight] = useState(false)

  const [discohook, setDiscohook] = useState(false)

  //@ts-expect-error
  const discohookMessage = message => {
    let msg = { ...message }
    if (msg) msg.author = {
      name: 'Forms',
      icon_url: 'https://cdn.discordapp.com/avatars/942858850850205717/a_437f281f490a388866b7be0b3cd7cc33.gif'
    }
    return msg
  }

  return (
    <Box
      overflowY="scroll"
      p="16px 16px 16px 12px"
      maxHeight="calc(100vh - 48px);"
      display={displaySection ? "block" : "none"}
    >
      <VStack align="start" spacing={3}>
        {(!application_command) && (
          <PreviewStep
            number={1}
            highlighted={stage === 'openFormType'}
            title={`A message with ${!forms?.[0].select_menu_option ? "buttons" : "a select menu"
              } to open forms is sent to a channel`}
          >


              <Box display={discohook ? 'block' : 'none'} ><iframe
                src={`https://discohook.app/viewer?data=${Buffer.from(JSON.stringify({ version: 'd2', messages: [{ data: discohookMessage(message) }] })).toString('base64')}&header=false`}
                style={{ width: '100%', height: '200px', border: 'none', padding: '20px', background: 'white', borderRadius: '8px', resize: 'vertical', overflow: 'auto' }}
                title="Content"
              /></Box>
            
              <Box
                display={discohook ? "none" : "flex"}
                bg={colorMode === "dark" ? "grey.dark" : "white"}
                borderRadius="8px"
                p={4}
              >
                <FormProfile
                  {...{
                    avatar: AVATAR_URL,
                    hidden: FormsProfileHidden,
                    HandleInteraction,
                  }}
                >
                  <Image
                    alt="Form's Avatar"
                    src={AVATAR_URL}
                    style={{
                      width: "40px",
                      height: "40px",
                      clipPath: "circle(50%)",
                      marginTop: "5px",
                      marginRight: "16px",
                    }}
                    width="40px"
                    height="40px"
                    clipPath="circle(50%)"
                    mt="5px"
                    mr="16px"
                  />
                </FormProfile>
                <Box>
                  <Box display="flex" alignItems="center">
                    <Text
                      fontFamily="Whitney Bold"
                      _hover={{ textDecoration: "underline" }}
                      cursor="pointer"
                    >
                      Forms
                    </Text>
                    <Box
                      display="flex"
                      backgroundColor="#5865F2"
                      borderRadius=".1875rem"
                      ml="4px"
                      height=".9375rem"
                      width="39px"
                    >
                      <Tooltip
                        hasArrow
                        label={<Box>Verified App</Box>}
                        placement="top"
                        bg="#181414"
                      >
                        <svg
                          color="white"
                          width="16"
                          height="16"
                          viewBox="0 0 16 15.2"
                        >
                          <path
                            d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </Tooltip>
                      <Text
                        fontFamily="Whitney Bold"
                        fontSize=".625rem"
                        textColor="white"
                      >
                        APP
                      </Text>
                    </Box>
                    <Box pl={2} display="inline-block">
                      <Tooltip
                        hasArrow
                        label={"You can use the components below to switch forms"}
                        placement="right"
                        shouldWrapChildren
                        bg="#181414"
                      >
                        <IconContext.Provider
                          value={{
                            color: "#b9bbbe",
                            size: "20px",
                            style: {
                              display: "inline-block",
                            },
                          }}
                        >
                          <Box>
                            <IoInformationCircle />
                          </Box>
                        </IconContext.Provider>
                      </Tooltip>
                    </Box>
                    <Text
                      fontFamily="Whitney Bold"
                      fontSize="0.75rem"
                      color="#a3a6aa"
                      ml=".5rem"
                      alignSelf="flex-end"
                      mb="1px"
                    >
                      Today at {new Date().getHours() < 10 ? "0" : ""}
                      {new Date().getHours()}:
                      {new Date().getMinutes() < 10 ? "0" : ""}
                      {new Date().getMinutes()}
                    </Text>
                  </Box>
                  <Box>
                    {message?.content && (
                      <Text fontFamily="Whitney" whiteSpace="pre-wrap">
                        {message.content}
                      </Text>
                    )}
                    {MessageEmbed}
                    <Box p="4px 0">
                      {!forms?.[0].select_menu_option &&
                        message?.components?.[0]?.components?.map((component, index) => (
                          <Button
                            key={Math.random()}
                            onClick={() => {
                              if (component.style !== 5) {
                                setDisplayPage(0)
                                //@ts-expect-error
                                setDisplayForm(parseInt(component.custom_id?.match(/\d+/)[0]) - 1)
                                //@ts-expect-error
                                if (displayForm === parseInt(component.custom_id?.match(/\d+/)[0]) - 1) {
                                  setTemporaryModalHighlight(true)
                                  executeFormScroll()
                                  setTimeout(() => setTemporaryModalHighlight(false), 300);
                                }
                              }
                            }}
                            height="32px"
                            fontSize="14px"
                            paddingBlock={0}
                            paddingInline={0}
                            padding="2px 16px"
                            m="4px 8px 4px 0"
                            variant={
                              //@ts-expect-error
                              message?.components[0].components[index]?.style == 1
                                ? "primary"                             //@ts-expect-error
                                : message?.components[0].components[index]?.style == 2
                                  ? "secondary"                            //@ts-expect-error
                                  : message?.components[0].components[index]?.style == 3
                                    ? "success"                             //@ts-expect-error
                                    : message?.components[0].components[index]?.style == 4
                                      ? "danger"
                                      : "secondary"
                            }
                          >
                            {message?.components?.[0]?.components?.[index]?.label}
                          </Button>
                        ))}
                      {forms?.[0].select_menu_option && (
                        <Box>
                          <Box
                            width={
                              forms.find(
                                (e) =>
                                  (e?.select_menu_option?.description?.length ??
                                    0) > 40
                              ) != null
                                ? 450
                                : "auto"
                            }
                            onClick={onToggle}
                            cursor="pointer"
                            backgroundColor={
                              colorMode == "light" ? "#e9eaed" : "#1e1f22"
                            }
                            borderRadius={3.5}
                            borderBottomRadius={isOpen ? 0 : 3.5}
                            pl={3.5}
                            pr={2}
                            py={2}
                          >
                            <Text
                              color={colorMode == "light" ? "#5c5e66" : "#949a96"}
                              display="inline-block"
                            >
                              {select_menu_placeholder ||
                                "Select a form to preview"}
                            </Text>
                            <Box float="right" display="inline-block" pr={1}>
                              <IconContext.Provider
                                value={{
                                  color:
                                    colorMode == "light" ? "#313338" : "#e0e1e5",
                                  size: "25px",
                                }}
                              >
                                {isOpen ? <MdExpandLess /> : <MdExpandMore />}
                              </IconContext.Provider>
                            </Box>
                          </Box>
                          <Box
                            hidden={!isOpen}
                            backgroundColor={
                              colorMode == "light" ? "#eeeff1" : "#2b2d31"
                            }
                            borderColor={
                              colorMode == "light" ? "#e0e1e5" : "#1e1f22"
                            }
                            borderWidth="1.22px"
                            borderBottomRadius={3.5}
                          >
                            {forms.map((form, index) => (
                              <Box
                                key={index}
                                cursor="pointer"
                                _hover={{
                                  backgroundColor:
                                    colorMode == "light" ? "#dddee1" : "#36373d",
                                }}
                                px={4}
                                py={2}
                                onClick={() => {
                                  onToggle();
                                  setDisplayForm(index)
                                  if (displayForm === index) {
                                    setTemporaryModalHighlight(true)
                                    setTimeout(() => executeFormScroll(), 1);
                                    setTimeout(() => setTemporaryModalHighlight(false), 800);
                                  }
                                }}
                              >
                                <Text
                                  color={
                                    colorMode == "light" ? "#424244" : "#eeeff0"
                                  }
                                >
                                  {form?.select_menu_option?.label}
                                </Text>
                                <Text
                                  color={
                                    colorMode == "light" ? "#64666d" : "#9fa0a6"
                                  }
                                  maxWidth={400}
                                >
                                  {form?.select_menu_option?.description}
                                </Text>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>


            

            {<Box mt={2} display='flex' alignItems='center' justifyContent='right' fontSize='12px'>
              <Switch
                onChange={event => { setDiscohook(event.target.checked) }}
                colorScheme='blurple'
                size='sm'
                mr={2}
              />
              Use discohook for message rendering
            </Box>}

          </PreviewStep>
        )}

        <PreviewStep
          number={!application_command ? 2 : 1}
          title={
            !application_command
              ? "User opens a form"
              : `User opens the form with ${application_command?.name
                ? `/${application_command?.name}`
                : "the slash command"
              }`
          }
          controls={forms?.[displayForm]?.pages.length > 1 && <HStack>
            <svg onClick={() => displayPage > 0 && setDisplayPage(displayPage - 1)} style={{ cursor: displayPage > 0 ? 'pointer' : 'not-allowed', transform: `rotate(${270}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 10L8 6L4 10"
                stroke={displayPage > 0 ? "#bcbcbc" : 'grey'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Text userSelect='none'>Page {displayPage + 1}</Text>
            <svg onClick={() => ((displayPage + 1) < forms?.[displayForm]?.pages.length && setDisplayPage(displayPage + 1))} style={{ cursor: (displayPage + 1) < forms?.[displayForm]?.pages.length ? 'pointer' : 'not-allowed', transform: `rotate(${90}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 10L8 6L4 10"
                stroke={(displayPage + 1) < forms?.[displayForm]?.pages.length ? "#bcbcbc" : 'grey'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </HStack>}
          highlighted={stage === 'form' || temporaryModalHighlight}
          reference={formRef}
        >
          <Box
            display="flex"
            bg={colorMode === "dark" ? "grey.dark" : "white"}
            borderRadius="8px"
            p={4}
          >
            <Box
              border={`1px solid ${colorMode === "dark" ? "#292b2f" : "#e3e5e8"
                }`}
              borderRadius="3px"
              width="440px"
              height="fit-content"
              maxHeight="720px"
            >
              {" "}
              {/* overflowY='scroll' */}
              <Box
                display="flex"
                height="fit-content"
                justifyContent="space-between"
                alignItems="center"
                p="16px"
              >
                <Box display="flex" alignItems="center" height="24px">
                  <Image
                    src={AVATAR_URL}
                    alt="Forms Logo"
                    width="24px"
                    height="24px"
                    style={{ clipPath: "circle(50%)", marginRight: "8px" }}
                  />
                  <Text
                    fontSize="24px"
                    color={colorMode === "dark" ? "white" : "#060607"}
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {forms?.[displayForm]?.pages?.[displayPage]?.modal.title}
                  </Text>
                </Box>
                <Box display="flex" p="4px" cursor="pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="#b9bbbe"
                      d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
                    ></path>
                  </svg>
                </Box>
              </Box>
              <Box>
                {forms?.[displayForm]?.pages?.[displayPage]?.modal.components.map((actionRow, i) => (
                  <Box key={Math.random()} m="0 1em 1em">
                    <Text
                      textTransform="uppercase"
                      fontFamily="Sofia Sans"
                      fontWeight="extrabold"
                      fontSize="14px"
                      mb="8px"
                      color={colorMode === "dark" ? "#b9bbbe" : "#4f5660"}
                    >
                      {actionRow.components[0]?.label}
                      {actionRow.components[0]?.required && (
                        <span style={{ color: "#ed4245", paddingLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Text>
                    <Box
                      as={
                        actionRow.components[0]?.style == 1
                          ? "input"
                          : "textarea"
                      }
                      bg={colorMode === "dark" ? "#202225" : "#e3e5e8"}
                      height={
                        actionRow.components[0]?.style == 2 ? "16" : "2.2rem"
                      }
                      fontSize="16px"
                      resize="none"
                      border="0px"
                      _focus={{ border: "0px" }}
                      placeholder={actionRow.components[0]?.placeholder}
                      //@ts-ignore
                      //{...textInputs.register(`${actionRow.components[0].label}`)}
                      defaultValue={actionRow.components[0].value}
                    />
                  </Box>
                ))}
              </Box>
              <Box
                bg={colorMode === "dark" ? "#2f3136" : "#f2f3f5"}
                p="16px"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button
                  variant="link"
                  color={colorMode === "dark" ? "white" : "#747f8d"}
                  border="0px"
                  mr={4}
                  _focus={{ border: "0px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  border="0px"
                  _focus={{ border: "0px" }}
                  onClick={() => {
                    if ((displayPage + 1) < forms?.[displayForm]?.pages.length) {
                      setDisplayPage(displayPage + 1)
                    } else {
                      setTemporarySubmissionHighlight(true)
                      //@ts-expect-error
                      executeApplicationCommandScroll(applicationCommandRef)
                      setTimeout(() => setTemporarySubmissionHighlight(false), 300);
                    }
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </PreviewStep>

        <PreviewStep
          number={!application_command ? 3 : 2}
          //@ts-expect-error
          title={forms[displayForm].submit_channel ? 'A channel is created for the submission' : (forms[displayForm].submit_thread ? `A ${forms[displayForm].submit_thread?.type === 12 ? 'private ' : ''}thread is created for the submission` : 'The submission is sent to a channel')}
          highlighted={stage === 'server_selection' || stage === 'submissions' || temporarySubmissionHighlight}
          reference={applicationCommandRef}
        >
          <Box
            bg={colorMode === "dark" ? "grey.dark" : "white"}
            borderRadius="8px"
            p={4}
          >
            <Box display="flex">
              <FormProfile
                {...{
                  avatar: AVATAR_URL,
                  hidden: FormsProfileHidden,
                  HandleInteraction,
                }}
              >
                <Image
                  alt="Form's Avatar"
                  src={AVATAR_URL}
                  style={{
                    width: "40px",
                    height: "40px",
                    clipPath: "circle(50%)",
                    marginTop: "5px",
                    marginRight: "16px",
                  }}
                  width="40px"
                  height="40px"
                  clipPath="circle(50%)"
                  mt="5px"
                  mr="16px"
                />
              </FormProfile>
              <Box>
                <Box display="flex" alignItems="center">
                  <Text
                    fontFamily="Whitney Bold"
                    _hover={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Forms
                  </Text>
                  <Box
                    display="flex"
                    backgroundColor="#5865F2"
                    borderRadius=".1875rem"
                    ml="4px"
                    height=".9375rem"
                    width="39px"
                  >
                    <Tooltip
                      hasArrow
                      label={<Box>Verified App</Box>}
                      placement="top"
                      bg="#181414"
                    >
                      <svg
                        color="white"
                        width="16"
                        height="16"
                        viewBox="0 0 16 15.2"
                      >
                        <path
                          d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </Tooltip>
                    <Text
                      fontFamily="Whitney Bold"
                      fontSize=".625rem"
                      textColor="white"
                    >
                      APP
                    </Text>
                  </Box>
                  <Text
                    fontFamily="Whitney Bold"
                    fontSize="0.75rem"
                    color="#a3a6aa"
                    ml=".5rem"
                    alignSelf="flex-end"
                    mb="1px"
                  >
                    Today at {new Date().getHours() < 10 ? "0" : ""}
                    {new Date().getHours()}:
                    {new Date().getMinutes() < 10 ? "0" : ""}
                    {new Date().getMinutes()}
                  </Text>
                </Box>
                <Box
                  bg={colorMode === "dark" ? "#2f3136" : "#f2f3f5"}
                  borderLeft={
                    colorMode === "dark"
                      ? "4px solid #202225"
                      : "4px solid #e3e5e8"
                  }
                  maxWidth="520px"
                  borderRadius="4px"
                >
                  <Box padding="0.5rem 1rem 1rem 0.75rem">
                    <Box display="flex" alignItems="center" m="8px 0px 0px">
                      <Image
                        alt="Test User's Avatar"
                        src="https://cdn.discordapp.com/embed/avatars/5.png"
                        width="24px"
                        height="24px"
                        borderRadius="50%"
                        mr="8px"
                      />
                      <Box
                        fontFamily="Whitney Bold"
                        fontSize="0.875rem"
                        fontWeight="500"
                      >
                        User
                      </Box>
                    </Box>
                    <Box>
                      {forms?.[displayForm]?.pages?.[displayPage]?.modal.components.map(
                        (actionRow) => (
                          <Box key={Math.random()}>
                            <Text
                              fontFamily="Whitney Black"
                              fontSize="0.875rem"
                              mt="8px"
                            >
                              {actionRow.components[0]?.label}
                            </Text>
                            <Text
                              fontSize="0.875rem"
                              color={
                                actionRow.components[0]?.value
                                  ? "white"
                                  : "#a3a6aa"
                              }
                            >
                              {actionRow.components[0]?.value ||
                                "(Answer will be displayed here)"}
                            </Text>
                          </Box>
                        )
                      )}
                    </Box>
                    {/* <Box display="flex" alignItems="center" mt="8px">
                      <Image
                        alt="ID"
                        src="https://cdn.discordapp.com/emojis/882601305871360040.png"
                        width="20px"
                        height="20px"
                        mr="8px"
                        borderRadius="50%"
                      />
                      <Text
                        fontFamily="Whitney Bold"
                        fontSize="0.75rem"
                        color={colorMode === "dark" ? "#fbfbfb" : "#313338"}
                      >
                        643945264868098049
                      </Text>
                    </Box> */}
                  </Box>
                </Box>
                <Box>
                  {/* @ts-expect-error */}
                  {forms?.[displayForm]?.submit_components?.map((action_row, i) =>
                    <HStack key={Math.random()} gap={0}>
                      {/* @ts-expect-error */}
                      {forms?.[displayForm]?.submit_components[i].components?.map(button =>
                        <Button key={Math.random()} height="32px"
                          fontSize="14px"
                          paddingBlock={0}
                          paddingInline={0}
                          padding="2px 16px"
                          m="4px 8px 4px 0" variant={button.style === 1 ? 'primary' : (button.style === 2 ? 'secondary' : (button.style === 3 ? 'success' : 'danger'))}>{button.label}</Button>
                      )}
                    </HStack>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </PreviewStep>
      </VStack>
    </Box>
  );
}

export default Preview;
