/**
 * This code has been adapted from https://github.com/discohook/site.
 * Read the license here: https://github.com/discohook/site/blob/main/LICENSE
 */
import { autorun } from "mobx"
import { useEffect } from "react"

export const useAutorun = (fn: () => void) => {
    useEffect(() => autorun(fn))
}