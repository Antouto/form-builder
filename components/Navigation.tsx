import {
  Box,
  Button,
  Tooltip,
  useColorMode,
  useDisclosure,
  Link,
  HStack,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Code,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useScreenWidth } from "../util/width";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { StorageKeys } from "../types";
import { resolveBoolean } from "./Toggle";
import { Modal, ModalContent } from "./Modal";
import { DEFAULT_API_URI } from "./config";

export interface NavigationProps {
  modalHandler: () => void;
  displaySection?: number;
  setDisplaySection?: any;
  setStage?: any;
}

export function Navigation({
  modalHandler,
  displaySection,
  setDisplaySection,
  setStage,
}: NavigationProps) {
  const isSmallScreen = !useScreenWidth(1070);
  const colorMode = useColorMode().colorMode;
  const { isOpen, onClose } = useDisclosure();
  const {
    isOpen: mIsOpen,
    onClose: mOnClose,
    onOpen: mOnOpen,
  } = useDisclosure();
  const [isTipOpen, setTipOpen] = useState(false);
  useEffect(() => {
    const val = localStorage.getItem(StorageKeys.PreviewTip);
    const resolvedVal = val == null ? false : resolveBoolean(val);
    if (
      typeof resolvedVal === "boolean" &&
      resolvedVal === false &&
      isTipOpen != true
    )
      setTipOpen(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(StorageKeys.PreviewTip, JSON.stringify(true));
  }, []);

  return (
    <header>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          bg={colorMode === "dark" ? "grey.dark" : "grey.extralight"}
        >
          <Tooltip label="Back" hasArrow arrowSize={6}>
            <DrawerCloseButton
              color={colorMode === "dark" ? "#B8B9BF" : "#4E5058"}
              _focusVisible={{ border: "none" }}
            />
          </Tooltip>
          {/* <ColorModeSwitcher
            placement="bottom"
            position="absolute"
            height="32px"
            width="32px"
            top={2}
            right={12}
          /> */}
          <DrawerHeader height="48px">Pages</DrawerHeader>
          <DrawerBody display="flex" flexDirection="column">
            <Link
              href="https://discord.gg/cajZ7Mvzbp"
              onClick={onClose}
              target="_blank"
              rel="noopener noreferrer"
            >
              Support Server
            </Link>
            <Link
              href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot"
              onClick={onClose}
              target="_blank"
              rel="noopener noreferrer"
            >
              Invite Bot
            </Link>
            <Link
              href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940"
              onClick={onClose}
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </Link>
            {/* <Link cursor="pointer" onClick={modalHandler}>Settings</Link> */}
          </DrawerBody>
          <DrawerFooter>
            <Footer />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={mIsOpen} onClose={mOnClose}>
        <ModalContent>
          <ModalHeader>Developer Tools</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5}>
            <Text>
              API is running at:{" "}
              <Code borderRadius={5} px={1}>
                {process?.env?.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URI}
              </Code>
            </Text>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="space-between">
            <HStack>
              <Button variant="secondary" onClick={mOnClose}>
                Ok
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box display="flex" alignItems="center">
        <Tooltip label="Home" placement="bottom-end" hasArrow arrowSize={6}>
          <NextLink href="/" onDoubleClick={mOnOpen}>
            <Image
              src="/forms.svg"
              alt="Forms Logo"
              onClick={() => {
                setStage("welcome");
              }}
              width={28}
              height={28}
              style={{
                clipPath: "circle(50%)",
              }}
            />
          </NextLink>
        </Tooltip>
        {isSmallScreen && displaySection && (
          <Box
            bg={colorMode === "dark" ? "#2b2d31" : "#e0e1e5"}
            height="28px"
            ml={isSmallScreen ? 4 : 5}
            px={"2px"}
            borderRadius={15}
          >
            <Button
              onClick={() => setDisplaySection(1)}
              variant="navigationDisplayMode"
              color={
                displaySection === 1
                  ? "white"
                  : colorMode === "dark"
                  ? "white"
                  : "grey.lighter"
              }
              bg={
                displaySection === 1
                  ? colorMode === "dark"
                    ? "grey.light"
                    : "grey.lighter"
                  : "transparent"
              }
            >
              Editor
            </Button>
            <Tooltip
              pointerEvents="all"
              label={
                <Box>
                  <HStack>
                    <Text>You can preview your form here!</Text>
                    <Text
                      color="#00b0f4"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => setTipOpen(false)}
                    >
                      Ok
                    </Text>
                  </HStack>
                </Box>
              }
              placement="bottom-end"
              hasArrow
              arrowSize={6}
              isOpen={isTipOpen}
            >
              <Button
                onClick={() => {
                  if (isTipOpen) setTipOpen(false);
                  setDisplaySection(2);
                }}
                variant="navigationDisplayMode"
                color={
                  displaySection === 2
                    ? "white"
                    : colorMode === "dark"
                    ? "white"
                    : "grey.lighter"
                }
                bg={
                  displaySection === 2
                    ? colorMode === "dark"
                      ? "grey.light"
                      : "grey.lighter"
                    : "transparent"
                }
              >
                Preview
              </Button>
            </Tooltip>
          </Box>
        )}
        {!isSmallScreen && (
          <nav>
            <a
              href="https://discord.gg/cajZ7Mvzbp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Support Server
            </a>
            <a
              href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              Invite Bot
            </a>
            <a
              href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            {/* <Link cursor="pointer" onClick={modalHandler}>Settings</Link> */}
            {/* <ColorModeSwitcher
            placement="bottom"
            position="absolute"
            height="32px"
            width="32px"
            top={2}
            right={12}
          /> */}
          </nav>
        )}
      </Box>
    </header>
  );
}
