import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { Grid } from '@chakra-ui/react';
import Preview from '../components/Preview';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { FormAndOpenFormTypeBuilder } from "../util/types";
import { Navigation } from '../components/Navigation';
import { useModal } from '../components/SettingsModal';
import { Editor } from '../components/Editor';
import { useScreenWidth } from '../util/width';
import { hotjar } from 'react-hotjar';




export enum OpenFormType {
  button,
  select_menu,
  application_command
}

export default function App() {
  useLayoutEffect(() => {
    if(window.location.href.startsWith('https://form-builder.pages.dev')) window.location.replace('https://create.discordforms.com');
  }, []);


  const {
    control,
    register,
    watch,
    getValues,
    reset,
    setValue,
    formState,
    resetField,
    formState: { errors }
  } = useForm<FormAndOpenFormTypeBuilder>({
    mode: 'onChange'
  });

  //#region Hotjar
  const siteId = 4987367;
  const hotjarVersion = 6;
  useEffect(() => {
    hotjar.initialize({ id: siteId, sv: hotjarVersion });
  }, []);
  //#endregion

  const { fields: formMessageComponents, append: formMessageComponentsAppend, remove: formMessageComponentsRemove, move: formMessageComponentsMove } = useFieldArray({
    control,
    name: "message.components.0.components",
    rules: { minLength: 1 }
  });

  
  useEffect(() => {
    setValue('message', {
      content: 'Fill out the form below',
      components: [{
        type: 1,
        components: []
      }]
    })
    formMessageComponentsAppend({
      type: 2,
      label: 'Open Form',
      style: 1,
      custom_id: '{FormID1}'
    })
    setValue('forms', [
      {
        "pages": [{
          "modal": {
            "title": "Example Form",
            "components": [
              {
                "type": 1,
                "components": [
                  {
                    "type": 4,
                    "label": "Example Text Input",
                    "style": 1,
                    "max_length": 1024
                  }
                ]
              }
            ]
          }
        }]
      }
    ])
  }, [])

  const [displayForm, setDisplayForm] = useState(0);
  const [displayPage, setDisplayPage] = useState(0);
  const [displaySection, setDisplaySection] = useState(1);
  const [stage, setStage] = useState('welcome')
  const SettingsModal = useModal();
  const isNotSmallScreen = useScreenWidth(1070);

  return (
    <>
      <Meta>Home</Meta>
      <Navigation displaySection={displaySection} setDisplaySection={setDisplaySection} modalHandler={SettingsModal.modalHandler} />
      <Grid gridTemplateColumns={isNotSmallScreen ? '1fr 1fr' : '1fr'}>
        {/* @ts-expect-error */}
        <Editor resetField={resetField} displayForm={displayForm} setDisplayForm={setDisplayForm} displayPage={displayPage} setDisplayPage={setDisplayPage} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} displaySection={isNotSmallScreen || displaySection !== 2} stage={stage} setStage={setStage} formMessageComponents={formMessageComponents} formMessageComponentsAppend={formMessageComponentsAppend} formMessageComponentsRemove={formMessageComponentsRemove} formMessageComponentsMove={formMessageComponentsMove}/>
        {/* @ts-expect-error */}
        <Preview message={watch('message')} forms={watch('forms')} select_menu_placeholder={watch('select_menu_placeholder')} application_command={watch('application_command')} displayForm={displayForm} setDisplayForm={setDisplayForm} displayPage={displayPage} setDisplayPage={setDisplayPage} displaySection={isNotSmallScreen || displaySection !== 1} stage={stage} />
      </Grid>



    </>
  );
}
