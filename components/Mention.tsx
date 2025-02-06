import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Tooltip,
  cssVar,
  useColorMode,
  HStack,
} from "@chakra-ui/react";
import React, { CSSProperties, MouseEventHandler, useState } from "react";
import Image from "next/image";
import { AVATAR_URL } from "./config";

export interface MentionProperties {
  children: React.ReactNode;
}

interface InternalMentionProperties extends MentionProperties {
  hover?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
}

export interface UserMentionProperties extends MentionProperties {
  isFormsBot?: boolean;
  avatar?: string;
  text?: string;
  link?: string;
}

export interface FormProfileProperties {
  children: React.ReactNode;
  avatar?: string;
  hidden: boolean;
  HandleInteraction: MouseEventHandler<HTMLDivElement>;
}

export function Mention({
  children,
  onClick,
  isActive,
}: InternalMentionProperties) {
  const { colorMode } = useColorMode();
  return (
    <Box
      onClick={onClick}
      display="inline-block"
      textColor={isActive ? "white" : colorMode == "dark" ? "unset" : "#5865f2"}
      bgColor={
        isActive ? "#5865f2" : colorMode == "dark" ? "#3e4372" : "#e6e8fd"
      }
      marginX={0.2}
      paddingX="2px"
      borderRadius={4}
      _hover={{
        bgColor: "#5865f2",
      }}
      cursor="pointer"
    >
      {children}
    </Box>
  );
}

export function SlashCommand({ children }: MentionProperties) {
  return <Mention>/{children}</Mention>;
}

export function Channel({ children }: MentionProperties) {
  return <Mention>#{children}</Mention>;
}

const Invite =
  "https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=378762447896&scope=applications.commands%20bot";
export function FormProfile({
  children,
  avatar,
  hidden,
  HandleInteraction,
}: FormProfileProperties) {
  return (
    <Tooltip
      hasArrow
      isOpen={!hidden}
      zIndex={10000}
      backgroundColor="#292b2f"
      padding={5}
      borderRadius={5}
      ml={2}
      label={
        <Box>
          <Box pb={2} textAlign="center">
            <Center>
              {/* <Image
                alt="Avatar"
                src={avatar}
                width={30}
                height={30}
                style={{
                  marginBottom: 2,
                  borderRadius: 1000000,
                }}
              /> */}
              <Heading size="md" px={3}>
                Forms
              </Heading>
              <Box
                display="inline-flex"
                backgroundColor="#5865F2"
                borderRadius=".1875rem"
                ml="4px"
                height=".9375rem"
                width="39px"
                pr="4px"
              >
                <Tooltip
                  hasArrow
                  label={<Box>Verified Bot</Box>}
                  placement="top"
                  bg="#181414"
                >
                  <svg width="16" height="16" viewBox="0 0 16 15.2">
                    <path
                      d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </Tooltip>
                <Text fontFamily="Whitney Bold" fontSize=".625rem">
                  APP
                </Text>
              </Box>
            </Center>
          </Box>
        </Box>
      }
      shouldWrapChildren
    >
      {children}
    </Tooltip>
  );
}

/**
 * If {@link UserMention} should render avatars alongside the username.
 */
const SHOW_AVATARS = false;

export function UserMention({
  children,
  isFormsBot,
  avatar,
  text,
  link,
}: UserMentionProperties) {
  if (children === "Forms") isFormsBot = true;

  if (SHOW_AVATARS) {
    // If Forms bot, then apply to avatar automatically
    if (typeof avatar != "string" && isFormsBot) avatar = AVATAR_URL;
    else if (avatar == null)
      // default avatar
      avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
    if (avatar.startsWith("https://github.com"))
      link = avatar.replace(".png", "");
  } else avatar = undefined;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Mention hover={{ textDecoration: "underline" }}>
        <HStack>
          {avatar && (
            <Image
              src={avatar}
              alt="Avatar"
              width={15}
              height={15}
              style={{ borderRadius: 100, marginLeft: 2 }}
            />
          )}
          <Text display="inline" textColor={text ?? "currentcolor"}>
            @{children}
          </Text>
        </HStack>
      </Mention>
    </a>
  );
}
