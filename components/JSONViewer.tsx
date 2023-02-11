import React from "react"
import { Box, Collapse, HStack, Spinner, Text, Tooltip, useColorMode } from '@chakra-ui/react'
import { MdOutlineFileDownload } from 'react-icons/md'

export interface JSONViewerProperties {
  downloadForm: () => void;
  children: string;
}

export const DOWNLOAD_SPINNER_TIME = 1000;

function JSONViewer({ children, downloadForm: downloadFile }: JSONViewerProperties) {
  const [show, setShow] = React.useState(false)
  const { colorMode } = useColorMode();
  const handleToggle = () => setShow(!show)
  const [loading, setLoading] = React.useState(false);
  const downloadForm = () => {
    setLoading(true);
    downloadFile();
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME)
  }

  return (
    <Box style={{ border: `1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`, borderRadius: '4px', background: colorMode === 'dark' ? '#f2f3f5' : '#2f3136', color: colorMode === 'dark' ? '#4f5660' : '#b9bbbe', width: '100%' }}>
      <Collapse startingHeight={147} style={{ overflow: 'scroll', backgroundColor: '#2f3136', borderRadius: '4px', padding: '8px' }} in={show}>
        <pre>
          <code>{children}</code>
        </pre>
      </Collapse>
      <Box display='flex' alignItems='center' justifyContent='space-between' color={colorMode === 'dark' ? '#4f5660' : '#b9bbbe'} padding='4px 12px 4px 4px' borderTop={`1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`}>
        <Box display='flex' alignItems='center' onClick={handleToggle}>
          <Tooltip hasArrow label={
            <Box>
              {show ? 'Collapse' : 'Expand'} ({children.split(/\r\n|\r|\n/).length} Lines)
            </Box>
          } placement='top' shouldWrapChildren bg="#18191c" borderRadius={6} >
            <svg style={{ margin: '8px', cursor: 'pointer', transition: 'transform 0.2s', transform: `rotate(${(show ? 0 : 180)}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 10L8 6L4 10"
                stroke={colorMode === 'dark' ? '#4f5660' : '#b9bbbe'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Tooltip>
          {show ? 'Collapse' : 'Expand'}
        </Box>
        <HStack>
          <Text>form.json</Text>
          <Tooltip hasArrow label={
            <Box>
              Download
            </Box>
          } placement='top' shouldWrapChildren bg="#18191c" borderRadius={6}>
            {!loading && <MdOutlineFileDownload cursor='pointer' onClick={downloadForm} size={24} color='#46c46e' />}
            {loading && <Spinner color='#46c46e' size="sm" />}
          </Tooltip>
        </HStack>
      </Box>
    </Box>
  )
}

export default JSONViewer