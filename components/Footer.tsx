import React from "react";
import Image from "next/image";
import { Box, Link, Text } from "@chakra-ui/react";
import { UserMention } from "./Mention";

export function Footer() {
    return (
        <Box pt={5} fontSize='sm'>
            <Text>©️ 2023 Forms Discord Bot</Text>
            <Box color='#6c757d'>
                Made with <svg style={{ display: "inline-block", marginLeft: "1px", marginRight: "1px" }} width={15} height={15} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#DD2E44" d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959.17-.721.268-1.469.268-2.242z" /></svg>
                {' '}from <UserMention
                    text="#d0d3d8"
                    avatar='https://github.com/antouto.png'
                >Anthony</UserMention> and <UserMention
                    text="#d0d3d8"
                    avatar='https://github.com/turtlepaw.png'
                >Turtlepaw</UserMention>
                <br />
                This website is <Link href='https://github.com/Antouto/form-builder' target="_blank" rel="noopener noreferrer" color='#00b0f4'>open-source</Link>
            </Box>
        </Box>
    );
}