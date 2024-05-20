import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Grid } from '@chakra-ui/react';
import Preview from '../components/Preview';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { FormAndOpenFormTypeBuilder, FormBuilder, FormOpenFormTypeBuilder } from "../util/types";
import { Navigation } from '../components/Navigation';
import { useModal } from '../components/SettingsModal';
import { Editor } from '../components/Editor';
import { useScreenWidth } from '../util/width';
import { debounce } from 'lodash';
import { hotjar } from 'react-hotjar';





export enum OpenFormType {
  button,
  select_menu,
  application_command
}

export default function App() {
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

  const siteId = 4987367;
  const hotjarVersion = 6;

  useEffect(() => {
    hotjar.initialize({ id: siteId, sv: hotjarVersion });
  }, []);

  const { fields: formMessageComponents, append: formMessageComponentsAppend, remove: formMessageComponentsRemove, move: formMessageComponentsMove } = useFieldArray({
    control,
    //@ts-expect-error
    name: "message.components.0.components",
    rules: { minLength: 1 }
  });



  useEffect(() => {
    setValue('message', {
      content: 'Fill out the form below',
      //@ts-expect-error
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
                  "placeholder": "Write text here",
                  "max_length": 1024
                }
              ]
            }
          ]
        }
      }
    ])
  }, [])



  const [displayForm, setDisplayForm] = useState(0);
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
        <Editor resetField={resetField} displayForm={displayForm} setDisplayForm={setDisplayForm} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} displaySection={isNotSmallScreen || displaySection !== 2} stage={stage} setStage={setStage} formMessageComponents={formMessageComponents} formMessageComponentsAppend={formMessageComponentsAppend} formMessageComponentsRemove={formMessageComponentsRemove} formMessageComponentsMove={formMessageComponentsMove}/>
        {/* @ts-expect-error */}
        <Preview message={watch('message')} forms={watch('forms')} select_menu_placeholder={watch('select_menu_placeholder')} application_command={watch('application_command')} displayForm={displayForm} setDisplayForm={setDisplayForm} displaySection={isNotSmallScreen || displaySection !== 1} stage={stage} />
      </Grid>



    </>
  );
}
