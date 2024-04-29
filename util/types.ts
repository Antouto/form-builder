export type ColorString = `#${string}` | number;

export interface EmbedAuthor {
    name: string;
    url: string;
    icon_url: string;
}

export interface EmbedFooter {
    text: string;
    icon_url: string;
}

export interface Embed {
    author?: EmbedAuthor;
    title?: string;
    description?: string;
    color?: ColorString;
    image?: { url: string };
    footer?: EmbedFooter;
}

export interface FormMessageBuilder {
    content?: string;
    embeds?: Embed[];
}

export interface ButtonBuilder {
    label: string;
    style: number;
}

export interface SelectMenuBuilder {
    description: string;
    label: string;
}

export interface ModalComponentBuilder {
    type: number;
    label: string;
    style: number;
    placeholder?: string;
    value?: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
}

export interface ModalActionRowBuilder {
    type: number;
    components: ModalComponentBuilder[];
}

export interface ModalBuilder {
    title: string;
    components: ModalActionRowBuilder[];
}

export interface ApplicationCommandBuilder {
    name: string;
    description?: string;
}

export interface FormBuilder {
    webhook_url: string;
    button: ButtonBuilder;
    application_command?: ApplicationCommandBuilder;
    select_menu_option?: SelectMenuBuilder;
    modal: ModalBuilder;
    submit_message?: FormMessageBuilder;
    guild_submit_message?: FormMessageBuilder;
    dm_submit_message?: FormMessageBuilder;
}

export interface FormAndMessageBuilder {
    message?: FormMessageBuilder;
    select_menu_placeholder?: string;
    application_command?: {
        name: String,
        description?: String
    };
    forms: FormBuilder[];
}

export enum ToastStyles {
    Success = "success",
    Info = "info",
    Warning = "wraning",
    Error = "error",
    Loading = "loading"
}