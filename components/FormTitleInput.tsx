import { Box, FormLabel, HStack, Text, Tooltip, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Counter from './Counter'
import ErrorMessage from './ErrorMessage'
import { useScreenWidth } from '../util/width'

//@ts-expect-error
export default function FormTitleInput({ index, pageIndex, register, getValues, watch, fixMessage, errors, remove, insert, append, move, fields, setDisplayPage, updateTextInputMaxLength, premium, setPremiumFeatureTarget, onOpenPremium }) {
  const colorMode = useColorMode().colorMode
  const isTinyScreen = !useScreenWidth(450);

  //@ts-expect-error
  function appendPage(data, pageIndex) {
    if (data) {
      insert(pageIndex + 1, data)
    } else {
      append({
        type: 1,
        components: [
          {
            type: 4,
            label: '',
            style: 1,
            max_length: 1024
          }
        ]
      });
    }
    setTimeout(() => {
      if (updateTextInputMaxLength !== undefined) updateTextInputMaxLength();
      fixMessage('message');
    }, 0);
  }

  return (
    <HStack width='100%'>
      {/* <FormLabel htmlFor={`forms[${index}].pages.${pageIndex}.modal.title`} display='flex' alignItems='center'>
        <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text>
        <Counter count={getValues('forms')[index]?.pages?.[pageIndex]?.modal.title?.length} max={45} />
      </FormLabel> */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          {...register(`forms.${index}.pages.${pageIndex}.modal.title`, { required: true, onChange: () => fixMessage('message') })}
          id={`forms[${index}].pages.${pageIndex}.modal.title`}
          maxLength={45}
          style={{ paddingRight: '40px', color: 'white', fontFamily: 'Whitney' }}
        />
        <Text style={{
          fontFamily: 'Whitney',
          fontSize: '12px',
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#bcbcbc',
          pointerEvents: 'none'
        }}>
          {45 - watch(`forms.${index}.pages.${pageIndex}.modal.title`)?.length}
        </Text>
      </div>
      {fields && <>
        {fields.length > 1 && (fields.length === 2 ? pageIndex !== 0 : true) && <Tooltip
          hasArrow
          label={<Box>Move up</Box>}
          placement="top"
          bg="#181414"
        >
          <svg onClick={() => {
            if (pageIndex !== 0) {
              move(pageIndex, pageIndex - 1)
            }
          }} style={{ marginRight: '8px', cursor: pageIndex === 0 ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', transform: `rotate(0deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke={pageIndex === 0 ? '#666' : "#bcbcbc"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Tooltip>}
        {fields.length > 1 && (fields.length === 2 ? pageIndex !== 1 : true) && <Tooltip
          hasArrow
          label={<Box>Move down</Box>}
          placement="top"
          bg="#181414"
        >
          <svg onClick={() => {
            if (pageIndex !== fields.length - 1) {
              move(pageIndex, pageIndex + 1)
            }
          }} style={{ marginRight: '8px', cursor: pageIndex === fields.length - 1 ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', transform: `rotate(180deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke={pageIndex === fields.length - 1 ? '#666' : "#bcbcbc"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Tooltip>}
        {fields.length < 5 && !isTinyScreen && <Tooltip
          hasArrow
          label={<Box>Duplicate</Box>}
          placement="top"
          bg="#181414"
        >

          <svg style={{ marginRight: '8px' }} onClick={() => {
            if (!premium) {
              setPremiumFeatureTarget('multiple_pages')
              onOpenPremium()
              return;
            }
            if (fields.length < 5) {
              appendPage(watch(`forms.${index}.pages.${pageIndex}`), pageIndex)
              setDisplayPage(pageIndex + 1)
            }
          }} width="16px" height="16px" viewBox="0 0 16 16" fill="none"><path d="M3 10H2.5C1.67157 10 1 9.32845 1 8.50002L1 2.5C1 1.67157 1.67158 1 2.50001 1L8.5 1.00002C9.32843 1.00002 10 1.67159 10 2.50002V3.00002M13.4999 6.00008L7.49994 6.00006C6.67151 6.00006 5.99994 6.67164 5.99994 7.50006L5.99993 13.5001C5.99993 14.3285 6.67151 15.0001 7.49993 15.0001H13.4999C14.3284 15.0001 14.9999 14.3285 14.9999 13.5001V7.50008C14.9999 6.67165 14.3284 6.00008 13.4999 6.00008Z" stroke={fields.length === 5 ? '#666' : "#bcbcbc"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </Tooltip>}
        {fields.length > 1 && <Tooltip
          hasArrow
          label={<Box>Remove</Box>}
          placement="top"
          bg="#181414"
        >
          <svg onClick={() => {
            if (fields?.length !== 1) {
              setDisplayPage(pageIndex ? pageIndex - 1 : 0)
              remove(pageIndex)
              updateTextInputMaxLength()
            }
          }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 3L3 13M3 3L13 13" stroke={fields.length === 1 ? '#666' : "#bcbcbc"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </Tooltip>}
      </>}
      {/* <ErrorMessage error={errors.forms?.[index]?.modal?.title} /> */}
    </HStack>
  )
}
