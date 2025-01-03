export type ColorString = number | "{UserAccentColour}";

export interface Guild {
  permissions: number;
  name: string;
  id: string;
  icon: string;
}

export interface EmbedAuthor {
  name: string;
  url: string;
  icon_url: string;
}

export interface EmbedFooter {
  text: string;
  icon_url: string;
}

export interface EmbedField {
  name: string;
  value: string;
}

export interface Embed {
  author?: EmbedAuthor;
  title?: string;
  description?: string;
  color?: ColorString;
  image?: { url: string };
  footer?: EmbedFooter;
  fields?: EmbedField[];
}

interface Emoji {
  name?: string;
  id?: string;
}

export interface ButtonComponent {
  type: number;
  label: string;
  url?: string;
  style: number; //1 | 2 | 3 | 4 | 5;
  custom_id?: string;

  emoji?: Emoji;

  // Logic
  logic?: {
    UPDATE_THIS_CHANNEL?: {
      permission_overwrites?: PermissionOverwrites[];
      name?: string;
      locked?: boolean;
      archived?: boolean;
    };
    REQUIRED_PERMISSIONS?: any;
    FORWARD_SUBMISSION?: number;
    DM_SUBMITTER?: {
      content: string;
    };
    DM_SUBMITTER_WITH_MODAL_INPUT?: object;
    REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW?: boolean;
    UPDATE_COMPONENT?: object;
    DELETE_THIS_CHANNEL?: boolean;
    SEND_MESSAGE_TO_THIS_CHANNEL?: {
      content: string;
    };
  };
}

export interface ActionRow {
  type: 1;
  components: ButtonComponent[];
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
  emoji?: {
    id: string;
  };
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

export interface PermissionOverwrites {
  id: string;
  type: number;
  allow?: number | string;
  deny?: number | string;
}

export interface FormBuilder {
  webhook_url?: string;
  submit_channel_id?: string;
  submit_channel?: {
    parent_id?: string;
    permission_overwrites: PermissionOverwrites[];
    name: string;
    type?: number;
  };
  submit_thread?: {
    name: string;
    add_submitter?: boolean;
    type: number;
    invitable?: boolean;
  };
  // I don't know if this is supposed to be here...
  button?: {
    label: string;
  };
  cooldown?: number;
  application_command?: ApplicationCommandBuilder;
  select_menu_option?: SelectMenuBuilder;
  pages: Page[];
  submit_message?: FormOpenFormTypeBuilder;
  submit_components?: ActionRow[];
  guild_submit_message?: FormOpenFormTypeBuilder;
  dm_submit_message?: FormOpenFormTypeBuilder;

  on_submit?: {
    ADD_ROLE_TO_SUBMITTER: any;
    REMOVE_ROLE_FROM_SUBMITTER: any;
  };
}

export interface FormAndOpenFormTypeBuilder {
  message?: FormOpenFormTypeBuilder;
  select_menu_placeholder?: string;
  application_command?: {
    name: String;
    description?: String;
  };
  forms: FormBuilder[];
}

export enum ToastStyles {
  Success = "success",
  Info = "info",
  Warning = "wraning",
  Error = "error",
  Loading = "loading",
}
