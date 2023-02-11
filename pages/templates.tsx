/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { useForm } from "react-hook-form";
import {
    Box,
    VStack,
    Grid,
    Text,
    Button,
    Heading,
    useToast,
    HStack, cssVar,
    Spinner,
    Center,
    Badge,
    Tooltip
} from '@chakra-ui/react';
import { DOWNLOAD_SPINNER_TIME } from '../components/JSONViewer';
import ErrorMessage from '../components/ErrorMessage';
import _DefaultValues from '../DefaultValues.json';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { EmbedAuthor, EmbedBuilder, EmbedFooter, FormAndMessageBuilder } from "../util/types";
import { useToggle } from '../components/Toggle';
import { Navigation } from '../components/Navigation';
import { MdOutlineFileDownload, MdVisibility } from 'react-icons/md';
import StaffAppForm from "../defaultForms/StaffApp.json";

const DefaultValues = _DefaultValues as FormAndMessageBuilder;
const ClearedValues = _ClearedValues as FormAndMessageBuilder;
const $SwitchBackground = cssVar("switch-bg");

const Defaults = {
    Embed: {
        color: 5793266,
        title: "Example Form",
        description: "Fill out the form below!",
        author: {
            name: "",
            url: "",
            icon_url: ""
        },
        footer: {
            text: "",
            icon_url: ""
        }
    },
    Message: 'Fill out the form below!'
};

const defaultValues = DefaultValues as FormAndMessageBuilder;

export default function App() {
    const {
        control,
        register,
        watch,
        getValues,
        reset,
        setValue,
        formState,
        formState: { errors }
    } = useForm<FormAndMessageBuilder>({
        mode: 'onChange',
        defaultValues
    });

    const toast = useToast();

    enum ToastStyles {
        Success = "success",
        Info = "info",
        Warning = "wraning",
        Error = "error",
        Loading = "loading"
    }

    function postToast({ title, description, style }: {
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
                borderRadius: "0.3rem"
            },
            position: "bottom",
            duration: 3000,
            isClosable: true,
        });
    }

    const downloadForm = (formData: any, fileName: string) => {
        setTimeout(() => {
            console.log("downloading...")
            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                JSON.stringify(formData, null, 2)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = fileName + ".json";
            link.click();
        }, 500)
    }

    const ShowFixFormButton = useToggle();

    const Forms: {
        data: any;
        formBuilder?: boolean;
        name: string;
        description: string;
        views: number | string;
        downloads: number | string;
        official?: boolean;
    }[] = [{
        description: "Start recruiting staff to your server with this handy form!",
        name: "Staff Applications",
        official: true,
        data: StaffAppForm,
        downloads: "unknown",
        views: "unknown",
        formBuilder: false
    }];

    function FixForm(formData: FormAndMessageBuilder) {
        formData.forms.forEach((form, i) => {
            if (formData.forms[i].button != null) formData.forms[i].button.style = Number(form.button.style);
            form.modal.components.forEach((actionRow) => {
                actionRow.components.forEach((e, index) => {
                    console.log(e)
                    Object.entries(e).map(([k, v]) => {
                        console.log(k, v)
                        if (v === null) return { key: k, value: v };
                        //@ts-expect-error
                        // eslint-disable-next-line eqeqeq
                        if (v == '') e[k] = null;
                        //@ts-expect-error
                        else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
                        return { key: k, value: v };
                    });

                    formData.forms[i].modal.components[index].components[index] = e;
                })
            })
        });

        const Message = formData.message;

        if (Message?.embeds != null && Message.embeds.length > 0) {
            console.log("fixing...")
            Message.embeds.forEach((embed, i) => {
                Object.entries(embed).forEach(([_key, v]) => {
                    const k = _key as keyof EmbedBuilder;
                    if (typeof v == "string") {
                        //@ts-expect-error
                        if (v == null || v === "") formData.message.embeds[i][k] = null;
                    } else if (typeof v == "object") {
                        Object.entries(v).forEach(([_k, v2], i2) => {
                            const k2 = _k as keyof EmbedAuthor | keyof EmbedFooter;
                            //@ts-expect-error
                            if (v2 == null || v2 === "") formData.message.embeds[i][k][k2] = null;
                        })
                    }
                })
            });
        }
    }

    return (
        <>
            <Meta>Templates</Meta>
            <Navigation />
            <Center pt={10}>
                <VStack bgImage="/stars.svg" bgSize="contain" paddingX={150} bgRepeat="no-repeat">
                    {/* <Image src="/stars.svg" alt='Stars' width={5} height={5} /> */}
                    <Badge bgColor="#5865f2" fontWeight="bold" fontSize={20} width="20" borderRadius="full" textAlign="center" textColor="white">NEW</Badge>
                    <Heading>Form Templates</Heading>
                    <Text></Text>
                    <ErrorMessage>There are limited templates at this time and forms can only be approved by admins.</ErrorMessage>
                </VStack>
            </Center>
            <Grid gridTemplateColumns='1fr 1fr' px={50} pt={10}>
                {Forms.map(form => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [loading, setLoading] = useState(false);
                    const handleLoad = () => {
                        setLoading(true);
                        (() => {
                            FixForm(form.data);
                            setTimeout(() => {
                                downloadForm(form.data, form.data.forms[0].modal.title.split(" ").map((e: string) => e.toLowerCase()).join("_"))
                            }, 500);
                        })();
                        setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
                    }

                    return (
                        <Box key={form.name} bgColor="#292b2f" borderRadius="lg" px={5} py={5}>
                            <Heading size="md">Staff Applications</Heading>
                            <Text pt={1} fontSize={17}>
                                Start recruiting staff to your server with this handy form!
                            </Text>
                            <Box pt={5}>
                                <Box display="inline-flex" float="left" pt={3}>
                                    <Box>
                                        <HStack>
                                            <MdVisibility />
                                            <Text>{form.views}</Text>
                                            <MdOutlineFileDownload />
                                            <Text>{form.downloads}</Text>
                                        </HStack>
                                    </Box>
                                </Box>
                                <Box display="inline-block" float="right">
                                    <Tooltip label={(
                                        <ErrorMessage>Forms cannot be previewed currently</ErrorMessage>
                                    )} placement='top' shouldWrapChildren bg="#18191c" borderRadius={6} px={3} py={2}>
                                        <Button _hover={{
                                            bgColor: ""
                                        }} variant="secondary" mr={3} isDisabled>Preview</Button>
                                    </Tooltip>
                                    <Button
                                        variant="success"
                                        onClick={handleLoad}
                                        //width="26"
                                        width={24}
                                    >
                                        {!loading && "Download"}
                                        {loading && <Spinner size="sm" />}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Grid>
        </>
    );
}
