import React from "react";

/**
 * @typedef ExternalSVGProps
 * @property {string} [color]
 * @property {string} [className]
 */

/**
 * @param {ExternalSVGProps} props 
 * @returns 
 */
export function ExternalIcon(props) {
    return (
        <svg className={`icon outbound ${props.className === null ? "" : props.className}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15">
            <path fill={props.color || "currentColor"} d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
            <polygon fill={props.color || "currentColor"} points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
        </svg>
    );
}

/**
 * @typedef LinkProps
 * @property {string} href
 * @property {boolean} [blurple]
 * @property {string} children
 * @property {string} [className]
 * @property {boolean} [isExternal]
 * @property {boolean} [newTab]
 */

/**
 * Creates a link with the given props.
 * @param {LinkProps} options
 * @returns {React.ReactNode}
 */
export function Link({ children, href, isExternal, blurple, className, newTab }) {
    if (blurple == null) blurple = true;

    if (
        isExternal || (
            href.startsWith("https://") ||
            href.startsWith("http://")
        )
    ) {
        return (
            <a target="_blank" rel="noreferrer" href={href} className={mergeClassNames(`hover:underline`, blurple === true ? `text-blurple` : "", className)}>
                {children}
                <ExternalIcon />
            </a>
        );
    }
    return (
        <a target="_blank" rel="noreferrer" className={mergeClassNames(`hover:underline`, "text-blurple", className)} href={href}>
            {children}
        </a>
    );
};

export function mergeClassNames(defaults = "", useIfNone, classNames) {
    if ((classNames === null || classNames === undefined) || classNames === "") {
        return `${defaults == null ? "" : (defaults + " ")}${useIfNone}`;
    } else return `${defaults == null ? "" : (defaults + " ")}${classNames}`;
}