/**
 * This code has been adapted from https://github.com/discohook/site.
 * Read the license here: https://github.com/discohook/site/blob/main/LICENSE
 */
import { createContext, useContext } from "react";
import { computed, observable } from "mobx"

export interface SettingsManager {
    LastWhatsNew: Date | null;
    ShowFixFormButton: boolean;
}

export const DEFAULT_PREFERENCES: SettingsManager = {
    ShowFixFormButton: false,
    LastWhatsNew: null
}


export const SettingsManagerContext = createContext<SettingsManager>({
    ...DEFAULT_PREFERENCES
});

SettingsManagerContext.displayName = "SettingsManagerContext"

export function useSettings() {
    return useContext(SettingsManagerContext);
}

export const SettingsManagerProvider = SettingsManagerContext.Provider;
export class SettingsManagerBuilder {
    @observable settings: SettingsManager = { ...DEFAULT_PREFERENCES }

    load() {
        const settings = this.settings as any

        const storedSettings: Partial<SettingsManager> =
            typeof window === "undefined"
                ? {}
                : JSON.parse(localStorage.getItem("settings") ?? "{}")

        for (const [key, value] of Object.entries(storedSettings)) {
            if (!Object.keys(settings).includes(key)) continue

            settings[key] = value
        }
    }

    dump() {
        const json = JSON.stringify(this.settings)
        localStorage.setItem("settings", json)
    }

    // @computed.struct get theme(): Theme {
    //     const { color, display, fontSize } = this.settings

    //     return {
    //         ...THEMES[color],
    //         appearance: {
    //             color,
    //             display,
    //             fontSize,
    //         },
    //     }
    // }
}