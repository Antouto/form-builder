import { Box, HStack, Text } from "@chakra-ui/react";
import { InfoIcon } from "./Icons";

export function ChannelIdHint() {
  return (
    <Box
      style={{
        display: "flex", // Enable flexbox
        flexDirection: "column", // Stack items vertically
        justifyContent: "center", // Vertically center the content
        background:
          "color-mix(in oklab, hsl(199.524 calc(1 * 100%) 49.412% / 0.1) 100%, hsl(var(--theme-base-color-hsl, 0 0% 0%) / 0.1) var(--theme-base-color-amount, 0%))",
        borderColor:
          "color-mix(in oklab, hsl(199.524 calc(1 * 100%) 49.412% / 1) 100%, var(--theme-text-color, black) var(--theme-text-color-amount, 0%))",
        borderWidth: "1px",
        borderRadius: "4px",
      }}
      px={3}
      py={3}
      my={2}
    >
      <HStack pl={2}>
        <InfoIcon size={24} />
        <Text fontSize={12} pl={2}>
          <Text fontSize={15}>How to obtain the Channel ID</Text>
          Go to your Discord User Settings → Advanced → Enable Developer Mode
          <br /> Right-click your channel → Copy Channel ID
        </Text>
      </HStack>
    </Box>
  );
}
