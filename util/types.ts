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

export interface ButtonComponent {
    type: 2,
    label: string;
    url?: string;
    style: 1|2|3|4|5;
    custom_id?: string;
}

export interface ActionRow {
    type: 1;
    components: Array<ButtonComponent>
}

export interface FormOpenFormTypeBuilder {
    content?: string;
    embeds?: Embed[];
    components?: ActionRow[];
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

export interface Page {
    modal: ModalBuilder;
}

export interface FormBuilder {
    webhook_url?: string;
    submit_channel_id?: string;
    submit_channel?: object;
    cooldown?: number;
    application_command?: ApplicationCommandBuilder;
    select_menu_option?: SelectMenuBuilder;
    pages: Page[];
    submit_message?: FormOpenFormTypeBuilder;
    submit_components?: ActionRow;
    guild_submit_message?: FormOpenFormTypeBuilder;
    dm_submit_message?: FormOpenFormTypeBuilder;
}

export interface FormAndOpenFormTypeBuilder {
    message?: FormOpenFormTypeBuilder;
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