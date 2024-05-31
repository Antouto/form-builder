// /* eslint-disable react/no-children-prop */
// /* eslint-disable react/no-unescaped-entities */
// import { useRef, useState } from 'react';
// import {
//     Box,
//     VStack,
//     Grid,
//     Text,
//     Button,
//     Heading,
//     useToast,
//     HStack, cssVar,
//     Spinner,
//     Center,
//     Badge,
//     Tooltip,
//     ModalBody,
//     ModalCloseButton,
//     useDisclosure,
//     FormLabel, Textarea as ChakraTextarea, useColorModeValue, useColorMode, Input as ChakraInput, TextareaProps, InputProps, ColorMode, ColorModeContextType
// } from '@chakra-ui/react';
// import { DOWNLOAD_SPINNER_TIME } from '../components/JSONViewer';
// import ErrorMessage from '../components/ErrorMessage';
// import _ClearedValues from '../ClearedValues.json';
// import { Meta } from '../components/Meta';
// import { EmbedAuthor, Embed, EmbedFooter, FormAndOpenFormTypeBuilder } from "../util/types";
// import { Navigation } from '../components/Navigation';
// import * as StaffAppForm from "../templates/StaffApp";
// import { FormDataResponse } from '../util/api';
// import { useModal } from '../components/SettingsModal';
// import Image from 'next/image';
// import { MdCheck, MdError, MdLabelImportant, MdPriorityHigh, MdQuestionAnswer, MdStar, MdStarBorder, MdVerified } from 'react-icons/md';
// import Preview from '../components/Preview';
// import Link from 'next/link';
// import { Modal, ModalContent, ModalFooter } from '../components/Modal';

// const ClearedValues = _ClearedValues as FormAndOpenFormTypeBuilder;
// const $SwitchBackground = cssVar("switch-bg");

// const Defaults = {
//     Embed: {
//         color: 5793266,
//         title: "Example Form",
//         description: "Fill out the form below!",
//         author: {
//             name: "",
//             url: "",
//             icon_url: ""
//         },
//         footer: {
//             text: "",
//             icon_url: ""
//         }
//     },
//     Message: 'Fill out the form below!'
// };

// export interface TemplateData {
//     // templates: FormDataResponse[] | null;
//     // error?: string;
//     REQUEST_WEBHOOK: string;
// }

// function getProps({ colorMode }: ColorModeContextType): InputProps & TextareaProps {
//     return {
//         backgroundColor: colorMode == "dark" ? "#2f3136" : "#e9eaed",
//         borderColor: "transparent"
//     }
// }

// export function Textarea(props: TextareaProps) {
//     const color = useColorMode();
//     return (
//         <ChakraTextarea {...props} {...getProps(color)} />
//     )
// }

// export function Input(props: InputProps) {
//     const color = useColorMode();
//     return (
//         <ChakraInput {...props} {...getProps(color)} />
//     )
// }

// export default function Templates({ REQUEST_WEBHOOK }: TemplateData) {
//     const toast = useToast();
//     const SettingsModal = useModal();

//     enum ToastStyles {
//         Success = "success",
//         Info = "info",
//         Warning = "wraning",
//         Error = "error",
//         Loading = "loading"
//     }

//     function postToast({ title, description, style }: {
//         title: string;
//         description?: string;
//         style: ToastStyles;
//     }) {
//         return toast({
//             title,
//             description,
//             status: style as unknown as undefined,
//             containerStyle: {
//                 backgroundColor: "#5865f2",
//                 borderRadius: "0.3rem"
//             },
//             position: "bottom",
//             duration: 3000,
//             isClosable: true,
//         });
//     }

//     const downloadForm = (formData: any, fileName: string) => {
//         setTimeout(() => {
//             const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
//                 JSON.stringify(formData, null, 2)
//             )}`;
//             const link = document.createElement("a");
//             link.href = jsonString;
//             link.download = fileName + ".json";
//             link.click();
//         }, 500)
//     }

//     // if (templates == null) return (
//     //     <>
//     //         <VStack pt={50}>
//     //             <Heading>Something didn't go right...</Heading>
//     //             <Text pt={2} pb={5} fontSize={20}>We had trouble fetching templates.</Text>
//     //             <Code p={5} backgroundColor="#2f3136" textColor="white" borderColor="#202225" borderWidth={1.3} borderRadius="md">
//     //                 {error}
//     //             </Code>
//     //         </VStack>
//     //     </>
//     // );

//     //@ts-expect-error
//     const Forms: FormDataResponse[] = [{
//         description: "Recruit staff to your server. This form includes helper, moderator, and administrator.",
//         name: "Staff Application",
//         official: true,
//         data: StaffAppForm.data,
//         replacers: StaffAppForm.replacers,
//         formBuilder: false,
//         highlighted: false
//     }, /*...templates.map(e => {
//         const data = typeof e == "string" ? JSON.parse(e) : e;
//         return {
//             data: JSON.parse(data.data),
//             ...data
//         }
//     })*/].sort(function (x, y) {
//         // true values first
//         return (x === y) ? 0 : x ? 1 : -1;
//         // false values first
//         // return (x === y)? 0 : x? 1 : -1;
//     });

//     const { colorMode } = useColorMode();

//     async function postWebhook(message: string, name: string, description: string, username: string) {
//         const fetched = await fetch(REQUEST_WEBHOOK, {
//             body: JSON.stringify({
//                 content: "```json\n" + message + "\n```",
//                 embeds: [{
//                     title: name,
//                     description,
//                     author: {
//                         name: username
//                     },
//                     color: 5793266
//                 }],
//                 allowed_mentions: { parse: [] }
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             method: "POST"
//         });

//         postToast({
//             style: ToastStyles.Success,
//             title: "Sent Template Request"
//         });
//     }

//     const { isOpen, onClose, onOpen } = useDisclosure();
//     const JsonData = useRef("");
//     const Name = useRef("");
//     const Description = useRef("");
//     const Username = useRef("");
//     const isInvalid = useState(true);
//     function HandleInput(func: () => unknown) {
//         //if (Name.current.length <= 3 || Description.current.length <= 3 || JsonData.current.length <= 3) isInvalid[1](true);
//         if (Name.current != "" && Username.current != "" && Description.current != "" && JsonData.current != "") isInvalid[1](false);
//         console.log(Name.current, Description.current)
//         return func();
//     }

//     return (
//         <>
//             <Meta>Templates</Meta>
//             <Navigation modalHandler={SettingsModal.modalHandler} />
//             <Center pt={10}>
//                 <VStack bgImage="/stars.svg" bgSize="contain" paddingX={150} bgRepeat="no-repeat">
//                     {/* <Image src="/stars.svg" alt='Stars' width={5} height={5} /> */}
//                     {/* <Badge bgColor="#5865f2" fontWeight="extrabold" fontSize={20} width="20" borderRadius="full" textAlign="center" textColor="white">BETA</Badge> */}
//                     <Heading>Form Templates</Heading>
//                     <Text></Text>
//                     <Box pb={2}>
//                         <ErrorMessage>Templates can only be added by website admins currently.</ErrorMessage>
//                     </Box>
//                     <Button onClick={onOpen}>Submit a Form</Button>
//                 </VStack>
//             </Center>
//             {SettingsModal.modal}
//             <Modal isOpen={isOpen} onClose={onClose}>
//                 <ModalContent>
//                     {/* <ModalHeader _after={{
//                     borderBottom: "none"
//                 }} paddingBottom="3.5">
//                     Configuration
//                 </ModalHeader> */}
//                     <HStack pl={5} pt={4}>
//                         <Image
//                             src="/forms.svg"
//                             alt="Forms Logo"
//                             width={28}
//                             height={28}
//                             style={{
//                                 clipPath: 'circle(50%)'
//                             }}
//                         />
//                         <Heading size="md" pl={2} fontWeight="medium">Submit Template</Heading>
//                     </HStack>
//                     <ModalCloseButton />
//                     <ModalBody paddingY={6}>
//                         <FormLabel pb={1} pt={0}>Discord Tag</FormLabel>
//                         <Input placeholder='Discord User#0001' onChange={(e) => HandleInput(() => Username.current = e.target.value)} />
//                         <FormLabel pb={1} pt={1.5}>Name</FormLabel>
//                         <Input placeholder='My Awesome Template' onChange={(e) => HandleInput(() => Name.current = e.target.value)} />
//                         <FormLabel pb={1} pt={1.5}>Description</FormLabel>
//                         <Input placeholder='' onChange={(e) => HandleInput(() => Description.current = e.target.value)} />
//                         <FormLabel pb={1} pt={1.5}>JSON Data</FormLabel>
//                         <Textarea onChange={(e) => HandleInput(() => JsonData.current = e.target.value)} _focusVisible={{ borderColor: "" }} _hover={{ borderColor: "" }} backgroundColor="#2f3136" textColor="white" borderColor="#202225" borderWidth={1.3} borderRadius="md" mt={2} />
//                         {isInvalid[0] && <Box pt={3}><ErrorMessage>Fill out all the fields before sending your template</ErrorMessage></Box>}
//                     </ModalBody>

//                     <ModalFooter>
//                         <Button variant="primary" mr={-2} onClick={() => {
//                             onClose();
//                             postWebhook(JsonData.current, Name.current, Description.current, Username.current);
//                         }} isDisabled={isInvalid[0]}>
//                             Send
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//             <Grid gridTemplateColumns='1fr 1fr' px={50} pt={10}>
//                 {Forms.map(form => {
//                     // eslint-disable-next-line react-hooks/rules-of-hooks
//                     const [loading, setLoading] = useState(false);
//                     const handleLoad = () => {
//                         setLoading(true);
//                         (() => {
//                             setTimeout(() => {
//                                 downloadForm(form.data, form.name.split(" ").map((e: string) => e.toLowerCase()).join("_"))
//                             }, 500);
//                         })();
//                         setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
//                     }
//                     // eslint-disable-next-line react-hooks/rules-of-hooks
//                     const { isOpen, onOpen, onClose } = useDisclosure();
//                     // eslint-disable-next-line react-hooks/rules-of-hooks
//                     const downloadModal = useDisclosure();
//                     // eslint-disable-next-line react-hooks/rules-of-hooks
//                     const [downloadModalSatisfied, setSatisfied] = useState(false);

//                     return (
//                         <Box id={form.name.toLowerCase().split(" ").join("-")} mx={2} my={2} key={form.name} bgColor={colorMode === "dark" ? "#292b2f" : "#ebedef"} borderRadius="lg" px={5} py={5}>
//                             <HStack>
//                                 <Heading size="md" display="inline-block">{form.name}</Heading>
//                                 {form.official && <Tooltip label={(
//                                     <Box>
//                                         <HStack>
//                                             <MdVerified color='#2da565' size={20} display="inline" />
//                                             <Text display="inline">This is an official template built by admins</Text>
//                                         </HStack>
//                                     </Box>
//                                 )} placement='top' bg="#181414" shouldWrapChildren>
//                                     <Box display="inline-block" pt={1}>
//                                         <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="28px" viewBox="0 0 24 24" width="28px" fill="#2da565"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7 l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M9.38,16.01L7,13.61c-0.39-0.39-0.39-1.02,0-1.41 l0.07-0.07c0.39-0.39,1.03-0.39,1.42,0l1.61,1.62l5.15-5.16c0.39-0.39,1.03-0.39,1.42,0l0.07,0.07c0.39,0.39,0.39,1.02,0,1.41 l-5.92,5.94C10.41,16.4,9.78,16.4,9.38,16.01z" /></g></svg>
//                                     </Box>
//                                 </Tooltip>}
//                                 {form.highlighted && <Tooltip label={(
//                                     <Box>
//                                         <HStack>
//                                             <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#f9c23c"><g><path d="M0 0h24v24H0V0z" fill="none" /><path d="M0 0h24v24H0V0z" fill="none" /></g><g><path d="m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z" /></g></svg>
//                                             <Text display="inline">This template is highlighted</Text>
//                                         </HStack>
//                                     </Box>
//                                 )} placement='top' bg="#181414">
//                                     <Box display="inline-block" pt={1}>
//                                         <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="28px" viewBox="0 0 24 24" width="28px" fill="#f9c23c"><g><path d="M0 0h24v24H0V0z" fill="none" /><path d="M0 0h24v24H0V0z" fill="none" /></g><g><path d="m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z" /></g></svg>
//                                     </Box>
//                                 </Tooltip>}
//                             </HStack>
//                             <Text pt={1} fontSize={17}>
//                                 {form.description}
//                             </Text>
//                             <Box pt={5}>
//                                 {/* <Box display="inline-flex" float="left" pt={3}>
//                                     <Box>
//                                         <HStack>
//                                             <MdVisibility />
//                                             <Text>{form.views}</Text>
//                                             <MdOutlineFileDownload />
//                                             <Text>{form.downloads}</Text>
//                                         </HStack>
//                                     </Box>
//                                 </Box> */}
//                                 <Box display="inline-block" float="right">
//                                     {/* <Tooltip label={(
//                                         <ErrorMessage>Forms cannot be previewed currently</ErrorMessage>
//                                     )} placement='top' bg="#181414">
//                                         <Button _hover={{
//                                             bgColor: ""
//                                         }} variant="secondary" mr={3} isDisabled>Preview</Button>
//                                     </Tooltip> */}
//                                     <Button variant="secondary" mr={3} onClick={onOpen}>Preview</Button>
//                                     <Button
//                                         variant="success"
//                                         onClick={downloadModal.onOpen}
//                                         //width="26"
//                                         width={24}
//                                     >
//                                         Download
//                                     </Button>
//                                 </Box>
//                                 <Modal {...downloadModal}>
//                                     <ModalContent>
//                                         <HStack pl={5} pt={4}>
//                                             <Image
//                                                 src="/forms.svg"
//                                                 alt="Forms Logo"
//                                                 width={28}
//                                                 height={28}
//                                                 style={{
//                                                     clipPath: 'circle(50%)'
//                                                 }}
//                                             />
//                                             <Heading size="md" pl={2} fontWeight="medium">Download Template</Heading>
//                                         </HStack>
//                                         <ModalCloseButton />
//                                         <ModalBody paddingY={6}>
//                                             {form.replacers().map(replacer => (
//                                                 <>
//                                                     <FormLabel pt={2}>{replacer.label} {replacer.helpLink != null && <Text display="inline" color="#00b0f4" _hover={{ textDecoration: "underline" }}>
//                                                         <Link href={replacer.helpLink}>(help)</Link>
//                                                     </Text>}</FormLabel>
//                                                     <Input isRequired onChange={(e) => {
//                                                         if (form.replacers().map(e => e.satisfied(form.data.forms)).every(e => e == true)) setSatisfied(true);
//                                                         else setSatisfied(false);
//                                                         return replacer.set(form.data.forms, e.target.value)
//                                                     }} _focusVisible={{ borderColor: replacer.satisfied(form.data.forms) ? "#5865f2" : "#ED4245" }} _hover={{ borderColor: "" }} backgroundColor="#2f3136" textColor="white" borderColor={replacer.satisfied(form.data.forms) ? "#202225" : "#ED4245"} borderWidth={1.3} borderRadius="md" mt={2} />
//                                                 </>
//                                             ))}
//                                             {!downloadModalSatisfied && <Box pt={3}><ErrorMessage>Fill out all the fields before sending your template</ErrorMessage></Box>}
//                                         </ModalBody>

//                                         <ModalFooter>
//                                             <Button
//                                                 variant="success"
//                                                 onClick={handleLoad}
//                                                 //width="26"
//                                                 width={24}
//                                                 isDisabled={!downloadModalSatisfied}
//                                             >
//                                                 {!loading && "Download"}
//                                                 {loading && <Spinner size="sm" />}
//                                             </Button>
//                                         </ModalFooter>
//                                     </ModalContent>
//                                 </Modal>
//                                 <Modal isOpen={isOpen} onClose={onClose}>
//                                     <ModalContent>
//                                         <Box display='flex'>
//                                             <Box border={`1px solid ${colorMode === 'dark' ? '#292b2f' : '#e3e5e8'}`} borderRadius='3px' width='440px' height='fit-content' maxHeight='720px'> {/* overflowY='scroll' */}
//                                                 <Box display='flex' height='fit-content' justifyContent='space-between' alignItems='center' p='16px'>
//                                                     <Box display='flex' alignItems='center' height='24px'>
//                                                         <Image src="https://cdn.discordapp.com/attachments/944646735643410482/953304477102915624/unknown.png" alt="Forms Logo" width={24} height={24} style={{ clipPath: 'circle(50%)', marginRight: '8px' }} />
//                                                         <Text fontSize='24px' color={colorMode === 'dark' ? 'white' : '#060607'} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{form.data.forms[0]?.modal.title}</Text>
//                                                     </Box>
//                                                     <Box display='flex' p='4px' cursor='pointer' onClick={onClose}>
//                                                         <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#b9bbbe" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
//                                                     </Box>
//                                                 </Box>
//                                                 <Box>
//                                                     {form.data.forms[0]?.modal.components.map(actionRow => (
//                                                         <Box key={Math.random()} m='0 1em 0.4em'>
//                                                             <Text textTransform='uppercase' fontFamily='Sofia Sans' fontWeight='extrabold' fontSize='14px' mb='8px' color={colorMode === 'dark' ? '#b9bbbe' : '#4f5660'}>
//                                                                 {actionRow.components[0]?.label}
//                                                                 {actionRow.components[0]?.required && <span style={{ color: '#ed4245', paddingLeft: '4px' }}>*</span>}
//                                                             </Text>
//                                                             <Box as={actionRow.components[0]?.style == 1 ? 'input' : 'textarea'} bg={colorMode === 'dark' ? '#202225' : '#e3e5e8'} fontSize='16px' resize='none' border='0px' _focus={{ border: '0px' }} placeholder={actionRow.components[0]?.placeholder} defaultValue={actionRow.components[0]?.value} />
//                                                         </Box>
//                                                     ))}
//                                                 </Box>
//                                                 <Box mt={5} bg={colorMode === 'dark' ? '#2f3136' : '#f2f3f5'} p='16px' display='flex' justifyContent='flex-end' alignItems='center'>
//                                                     <Button onClick={onClose} variant='link' color={colorMode === 'dark' ? 'white' : '#747f8d'} border='0px' _focus={{ border: '0px' }} >Cancel</Button>
//                                                     <Button onClick={onClose} variant='primary' border='0px' _focus={{ border: '0px' }}>Submit</Button>
//                                                 </Box>
//                                             </Box>
//                                         </Box>
//                                     </ModalContent>
//                                 </Modal>
//                             </Box>
//                         </Box>
//                     );
//                 })}
//             </Grid>
//         </>
//     );
// }

// export async function getStaticProps() {
//     return {
//         props: {
//             REQUEST_WEBHOOK: process.env.REQUEST_WEBHOOK
//         }
//     }
// }

// // export const getServerSideProps: GetServerSideProps<TemplateData> = async function (ctx) {
// //     const REST = new Api(process.env.APP_URI as string);
// //     const data = await REST.getForms();

// //     if (data.hasError()) return {
// //         props: {
// //             templates: null,
// //             error: data.message
// //         }
// //     };

// //     return {
// //         props: {
// //             templates: data.data
// //         }
// //     };
// // };
