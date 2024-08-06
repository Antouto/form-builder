import "../styles/App.css";
import "../styles/Json.css";
import "../util/framer-motion.d";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../components/theme";
import { AppProps } from "next/app";
import ColorModeCSS from "../styles/ColorModeCSS";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ColorModeCSS />
        <Component {...pageProps} />
      </ChakraProvider>
      <Analytics/>
    </>
  );
}
