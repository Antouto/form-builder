import { useState } from "react"
import { Box, Button, Collapse, HStack, Spinner, Text, Tooltip, useColorMode } from '@chakra-ui/react'
import { UseFormGetValues } from "react-hook-form";
import { FormAndOpenFormTypeBuilder } from "../util/types";
import { createName } from "../util/form";
import Highlight from "react-highlight"

export interface JSONViewerProperties {
  downloadForm: () => void;
  children: string;
  getValues: UseFormGetValues<FormAndOpenFormTypeBuilder>;
}

export const DOWNLOAD_SPINNER_TIME = 600;

function JSONViewer({ children, downloadForm: downloadFile, getValues }: JSONViewerProperties) {
  const [show, setShow] = useState(false)
  const { colorMode } = useColorMode();
  const handleToggle = () => setShow(!show)
  const [loading, setLoading] = useState(false);
  const downloadForm = () => {
    setLoading(true);
    downloadFile();
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME)
  }
  const fileName = `${createName({ getValues })}.json`

  return (
    <Box style={{ border: `1px solid ${colorMode === 'dark' ? '#292b2f' : '#e3e5e8'}`, borderRadius: '4px', background: colorMode === 'dark' ? '#2f3136' : '#f2f3f5', color: colorMode === 'dark' ? '#e0e1e5' : '#4f5660', width: '100%' }}>
      <Collapse startingHeight={147} style={{ overflow: 'scroll', backgroundColor: colorMode == "dark" ? "#2f3136" : '#f2f3f5', borderRadius: '4px', padding: '8px', fontSize: '14px' }} in={show}>
        <Highlight className='json'>{children}</Highlight>
      </Collapse>
      <Box display='flex' alignItems='center' justifyContent='space-between' padding='4px 12px 4px 4px' borderTop={`1px solid ${colorMode === 'dark' ? '#292b2f' : '#e3e5e8'}`} color='#b8b9bf'>
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
          {<Tooltip hasArrow label='Form Configuration File' placement='top' bg="#181414"><Text _hover={{ color: '#e0e1e5' }}>{fileName}</Text></Tooltip>}

          <Tooltip hasArrow label={
            <Box>
              {loading ? <Text>Downloading {fileName}</Text> : <Text>Download {fileName}</Text>}
            </Box>
          } placement="top">
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
