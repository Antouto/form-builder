import React from "react"
import { Box, Collapse, HStack, Spinner, Text, Tooltip, useColorMode } from '@chakra-ui/react'
import { UseFormGetValues } from "react-hook-form";
import { FormAndMessageBuilder } from "../util/types";
import { createName } from "../util/form";
//@ts-expect-error
import Highlight from "react-highlight"
import { useScreenWidth } from "../util/width";

export interface JSONViewerProperties {
  downloadForm: () => void;
  children: string;
  animations: boolean;
  getValues: UseFormGetValues<FormAndMessageBuilder>;
}

export const DOWNLOAD_SPINNER_TIME = 1000;

function JSONViewer({ children, downloadForm: downloadFile, animations, getValues }: JSONViewerProperties) {
  const [show, setShow] = React.useState(false)
  const { colorMode } = useColorMode();
  const handleToggle = () => setShow(!show)
  const [loading, setLoading] = React.useState(false);
  const downloadForm = () => {
    if (animations == true) setLoading(true);
    downloadFile();
    if (animations == true) setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME)
  }
  const fileName = `${createName({ getValues })}.json`
  const isNotSmallScreen = useScreenWidth(500);

  return (
    <Box style={{ border: `1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`, borderRadius: '4px', background: colorMode === 'dark' ? '#f2f3f5' : '#2f3136', color: colorMode === 'dark' ? '#4f5660' : '#e0e1e5', width: '100%' }}>
      <Collapse startingHeight={147} style={{ overflow: 'scroll', backgroundColor: colorMode == "dark" ? "#f2f3f5" : '#2f3136', borderRadius: '4px', padding: '8px' }} in={show}>
        <Highlight className='json'>{children}</Highlight>
      </Collapse>
      <Box display='flex' alignItems='center' justifyContent='space-between' padding='4px 12px 4px 4px' borderTop={`1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`} color='#b8b9bf'>
        <Box display='flex' alignItems='center' onClick={handleToggle} _hover={{ color: '#e0e1e5' }}>
          <Tooltip hasArrow label={<Box>{show ? 'Collapse' : 'Expand'} ({children.split(/\r\n|\r|\n/).length} Lines)</Box>} placement='top' bg="#181414">
            <Box display='flex' alignItems='center' cursor='pointer'>
              <svg style={{ margin: '8px', transition: 'transform 0.2s', transform: `rotate(${(show ? 0 : 180)}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 10L8 6L4 10" stroke='currentColor' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {show ? 'Collapse' : 'Expand'}
            </Box>
          </Tooltip>
        </Box>
        <HStack>
          {isNotSmallScreen && <Tooltip hasArrow label='Form Configuration File' placement='top' bg="#181414"><Text _hover={{ color: '#e0e1e5' }}>{fileName}</Text></Tooltip>}
          <Tooltip hasArrow label={
            loading ? <Text>Downloading {fileName}</Text> : <Text>Download {fileName}</Text>
          } placement='top' bg="#181414">
            <Box _hover={{ color: '#e0e1e5' }}>
              {!loading && <svg cursor='pointer' onClick={downloadForm} width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"></path></svg>}
              {loading && <Box height='19px'><Spinner size="sm" /></Box>}
            </Box>
          </Tooltip>
        </HStack>
      </Box>
    </Box>
  )
}

export default JSONViewer