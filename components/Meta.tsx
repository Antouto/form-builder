import Head from "next/head";
import React, { useEffect, useState } from "react";
import Router from "next/router";

export const Configuration = {
    Color: "#5865f2",
    Title: "Discord Form Builder",
    TagLine: "Create fully customisable in-app forms for discord.",
    Description: "Create custom forms for discord (using in-app modals) and send submissions to a discord channel or google sheets using webhooks.",
    Icon: {
        SVG: "outline.svg",
        Blurple: {
            SVG: "forms.svg",
            PNG: "forms.png",
            PNG_Circle: "forms_circle.png"
        }
    }
}

export interface MetaProperties {
    children: string;
}

export function Meta({ children: Title }: MetaProperties) {
    const [WebsiteURL, SetWebURL] = useState("https://form-builder.pages.dev/");
    useEffect(() => {
        SetWebURL(Router.basePath)
    }, []);
    const PageTitle = `${Configuration.Title} - ${Title == null ? "" : ` ${Title}`}`;
    const EmbedTitle = `${Configuration.Title} - ${Configuration.TagLine}`;
    const Thumbnail = `${WebsiteURL}meta.png`
    return (
        <Head>
            <title>{PageTitle}</title>
            <link rel="icon" href={Configuration.Icon.Blurple.PNG_Circle} />
            {/* Primary Meta Tags */}
            <meta name="title" content={EmbedTitle} />
            <meta name="description" content={Configuration.Description} />
            <meta name="theme-color" content={Configuration.Color} />
            {/* <meta property="og:image" content={Thumbnail} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="250" />
            <meta property="og:image:height" content="250" /> */}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={WebsiteURL} />
            <meta property="og:title" content={EmbedTitle} />
            <meta property="og:description" content={Configuration.Description} />
            <meta property="og:site_name" content={Configuration.Title} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={WebsiteURL} />
            <meta property="twitter:title" content={EmbedTitle} />
            <meta property="twitter:description" content={Configuration.Description} />
            {/* <meta property="twitter:image" content={Thumbnail} /> */}
        </Head>
    );
}