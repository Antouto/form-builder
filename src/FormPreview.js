/* eslint eqeqeq: 0 */
import { Box, Button, Tooltip, Text, useColorMode, Image } from '@chakra-ui/react';
import React from 'react';

function isEmpty(value) {
    return value == null || value == '';
}

function FormPreview({ message, forms, displayForm, setDisplayForm, type }) {
    const { colorMode } = useColorMode();

    if (displayForm < 0) displayForm = 0;

    const MessageText = <Text fontFamily='Whitney'>{message.content || ' '}</Text>;

    const MessageEmbed = <Box mt="0.2rem" bg={colorMode === 'dark' ? '#f2f3f5' : '#2f3136'} borderLeft={`4px solid ${!isEmpty(message.embeds[0]?.color) ? message.embeds[0].color : (colorMode === 'dark' ? "#e3e5e8" : "rgb(32, 34, 37)")}`} maxWidth='520px' borderRadius='4px'>
        <Box padding='0.5rem 1rem 1rem 0.75rem'>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href={isEmpty(message.embeds[0]?.author?.url) ? null : message.embeds[0].author.url} className={!isEmpty(message.embeds[0]?.author?.url) ? "cursor-pointer hover:underline" : "cursor-default"}>
                <Box display='flex' alignItems='center' m='2px 0px 0px'>
                    {!isEmpty(message.embeds[0]?.author?.icon_url) && <Image src={message.embeds[0].author.icon_url} width='24px' height='24px' borderRadius='50%' mr='8px' />}
                    <Box fontFamily='Whitney Bold' fontSize='0.875rem' fontWeight='500' whiteSpace='pre-wrap' >{message.embeds[0]?.author?.name}</Box>
                </Box>
            </a>
            <Box>
                <Text fontFamily='Whitney Semibold' fontSize='0.975rem' mt='3px'>
                    {message.embeds[0]?.title}
                </Text>
                <Text fontSize='0.875rem' color='#c5c5d3'>
                    {message.embeds[0]?.description}
                </Text>
            </Box>
            {!isEmpty(message.embeds[0]?.footer?.text) && (
                <Box display='flex' alignItems='center' mt='8px'>
                    {!isEmpty(message.embeds[0]?.footer?.icon_url) && <Image src={message.embeds[0].footer.icon_url} width='24px' height='24px' borderRadius='50%' mr='8px' />}
                    <Text fontFamily='Whitney Bold' fontSize='0.80rem' color='#fbfbfb'>{message.embeds[0]?.footer?.text}</Text>
                </Box>
            )}
        </Box>
    </Box>;

    let Rendered = MessageText;
    if (type == "content") Rendered = MessageText;
    else if (type == "embed") Rendered = MessageEmbed;
    else Rendered = (<>
        {MessageText}
        {MessageEmbed}
    </>)

    return (
        <Box overflowY='scroll' p='16px 16px 16px 16px' maxHeight='calc(100vh - 48px);'>
            <Box>
                <Box display='flex'>
                    <Image className='cursor-pointer' src='https://cdn.discordapp.com/attachments/944646735643410482/953304477102915624/unknown.png' width='40px' height='40px' clipPath='circle(50%)' mt='5px' mr='16px' />
                    <Box>
                        <Box display='flex' alignItems='center'>
                            <Text fontFamily='Whitney Bold' _hover={{ textDecoration: 'underline' }} className='cursor-pointer'>Forms</Text>
                            <Box display='flex' backgroundColor='#5865F2' borderRadius='.1875rem' ml='4px' height='.9375rem' width='39px'>
                                <Tooltip hasArrow label={
                                    <Box>
                                        Verified Bot
                                    </Box>
                                } placement='top' shouldWrapChildren bg="#18191c" borderRadius={6} padding='6px 12px'>
                                    <svg width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg>
                                </Tooltip>
                                <Text fontFamily='Whitney Bold' fontSize='.625rem'>BOT</Text>
                            </Box>
                            <Text fontFamily='Whitney Bold' fontSize='0.75rem' color='#a3a6aa' ml='.5rem' alignSelf='flex-end' mb='1px'>Today at {new Date().getHours() < 10 ? '0' : ''}{new Date().getHours()}:{new Date().getMinutes() < 10 ? '0' : ''}{new Date().getMinutes()}</Text>
                        </Box>
                        <Box>
                            {Rendered}
                            <Box p='4px 0'>
                                {forms.map((form, index) => (<Button key={Math.random()} onClick={() => setDisplayForm(index)} m='4px 8px 4px 0' variant={form.button.style == 1 ? 'primary' : (form.button.style == 2 ? 'secondary' : (form.button.style == 3 ? 'success' : 'danger'))}>{form.button.label}</Button>))}
                            </Box>
                        </Box>
                    </Box>
                </Box>


            </Box>
            {/* <Box display='flex' alignItems='center' justifyContent='space-between' m='8px'>
                <Button disabled={displayForm < 1} onClick={() => setDisplayForm(displayForm - 1)}><HiChevronLeft /></Button>
                Form {displayForm + 1} Preview
                <Button disabled={displayForm > forms.length - 2} onClick={() => setDisplayForm(displayForm + 1)}><HiChevronRight /></Button>

            </Box> */}
            <Box display='flex' mt='30px'>
                <Box border={`1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`} borderRadius='3px' width='440px' height='fit-content' maxHeight='720px'> {/* overflowY='scroll' */}
                    <Box display='flex' height='fit-content' justifyContent='space-between' alignItems='center' p='16px'>
                        <Box display='flex' alignItems='center' height='24px'>
                            <img src="https://cdn.discordapp.com/attachments/944646735643410482/953304477102915624/unknown.png" alt="Forms Logo" width="24px" height='24px' style={{ clipPath: 'circle(50%)', marginRight: '8px' }} />
                            <Text fontSize='24px' color={colorMode === 'dark' ? '#060607' : 'white'} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{forms[displayForm]?.modal.title}</Text>
                        </Box>
                        <Box display='flex' p='4px' cursor='pointer'>
                            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#b9bbbe" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </Box>
                    </Box>
                    <Box>
                        {forms[displayForm]?.modal.components.map(actionRow => (
                            <Box key={Math.random()} m='0 1em 1em'>
                                <Text textTransform='uppercase' fontFamily='Sofia Sans' fontWeight='extrabold' fontSize='14px' mb='8px' color={colorMode === 'dark' ? '#4f5660' : '#b9bbbe'}>
                                    {actionRow.components[0].label}
                                    {actionRow.components[0].required && <span style={{ color: '#ed4245', paddingLeft: '4px' }}>*</span>}
                                </Text>
                                <Box as={actionRow.components[0].style === '1' ? 'input' : 'textarea'} bg={colorMode === 'dark' ? '#e3e5e8' : '#202225'} fontSize='16px' resize='none' border='0px' _focus={{ border: '0px' }} placeholder={actionRow.components[0].placeholder} defaultValue={actionRow.components[0].value} />
                            </Box>
                        ))}
                    </Box>
                    <Box bg={colorMode === 'dark' ? '#f2f3f5' : '#2f3136'} p='16px' display='flex' justifyContent='flex-end' alignItems='center'>
                        <Button variant='link' color={colorMode === 'dark' ? '#747f8d' : 'white'} border='0px' _focus={{ border: '0px' }} >Cancel</Button>
                        <Button variant='primary' border='0px' _focus={{ border: '0px' }}>Submit</Button>
                    </Box>
                </Box>
            </Box>
            <Box mt='12px'>
                <Box display='flex'>
                    <Image _hover={{ cursor: "pointer" }} src='https://cdn.discordapp.com/embed/avatars/1.png' width='40px' height='40px' clipPath='circle(50%)' mt='5px' mr='16px' />
                    <Box>
                        <Box display='flex' alignItems='center'>
                            <Text fontFamily='Whitney Bold' _hover={{ textDecoration: 'underline', cursor: "pointer" }}>Webhook</Text>
                            <Box display='flex' backgroundColor='#5865F2' color='white' borderRadius='.1875rem' ml='4px' height='.9375rem' p='0px 4px 0px 5px'>
                                <Text fontFamily='Whitney Bold' fontSize='.625rem'>BOT</Text>
                            </Box>
                            <Text fontFamily='Whitney Bold' fontSize='0.75rem' color='#a3a6aa' ml='.5rem' alignSelf='flex-end' mb='1px'>Today at {new Date().getHours() < 10 ? '0' : ''}{new Date().getHours()}:{new Date().getMinutes() < 10 ? '0' : ''}{new Date().getMinutes()}</Text>
                        </Box>
                        <Box bg={colorMode === 'dark' ? '#f2f3f5' : '#2f3136'} borderLeft={colorMode === 'dark' ? '4px solid #e3e5e8' : '4px solid rgb(32, 34, 37)'} maxWidth='520px' borderRadius='4px'>
                            <Box padding='0.5rem 1rem 1rem 0.75rem'>
                                <Box display='flex' alignItems='center' m='8px 0px 0px'>
                                    <Image src='https://cdn.discordapp.com/embed/avatars/5.png' width='24px' height='24px' borderRadius='50%' mr='8px' />
                                    <Box fontFamily='Whitney Bold' fontSize='0.875rem' fontWeight='500' whiteSpace='pre-wrap' >User#0000</Box>
                                </Box>
                                <Box>
                                    {forms[displayForm]?.modal.components.map(actionRow => (
                                        <Box key={Math.random()}>
                                            <Text fontFamily='Whitney Black' fontSize='0.875rem' mt='8px'>
                                                {actionRow.components[0].label}
                                            </Text>
                                            <Text fontSize='0.875rem' color={actionRow.components[0].value ? 'white' : '#a3a6aa'}>
                                                {actionRow.components[0].value || '(Answer will be displayed here)'}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                                <Box display='flex' alignItems='center' mt='8px'>
                                    <Image src='https://cdn.discordapp.com/emojis/882601305871360040.png' width='20px' height='20px' mr='8px' borderRadius='50%' />
                                    <Text fontFamily='Whitney Bold' fontSize='0.75rem' color='#fbfbfb'>643945264868098049</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <img alt='' className='pt pb-small' src='https://cdn.discordapp.com/attachments/944646735643410482/953299030669152256/forms_demo.png' />
            <Text fontSize='0.875rem' color='#a3a6aa' className='text-center'>
                Forms Demo Image
            </Text>
        </Box>
    );
}

export default FormPreview;