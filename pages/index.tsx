import React, {
  useEffect, useRef, useState,
  // useLayoutEffect
} from 'react';
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
  // useLayoutEffect(() => {
  //   if(window.location.href.startsWith('https://form-builder.pages.dev')) window.location.replace('https://create.discordforms.com');
  // }, []);


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
    mode: 'onChange',
    defaultValues: {
      message: {
        content: 'Fill out the form below',
        components: [{
          type: 1,
          components: [{
            type: 2,
            label: 'Open Form',
            style: 1,
            custom_id: '{FormID1}'
          }]
        }]
      },
      forms: [
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
      ]
    }
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

  const [openFormType, _setOpenFormType] = useState("button");

  const setOpenFormType = (type: string, setContent = true) => {
    _setOpenFormType(type);
    switch (type) {
      case "button":
        setValue('application_command', undefined)
        setValue("select_menu_placeholder", undefined);
        if (setContent) {
          setTimeout(() => {
            setValue("message.components",
              [{
                type: 1,
                components: getValues('forms').map((form, i) => (
                  {
                    type: 2,
                    label: 'Open form',
                    style: 1,
                    custom_id: `{FormID${i + 1}}`
                  }
                ))
              }]
            );
          }, 1);
        }

        getValues("forms").forEach((form, i) => {
          setValue(`forms.${i}.select_menu_option`, undefined);
        });
        break;
      case "select_menu":
        setValue('message.components', undefined)
        setValue('application_command', undefined)
        getValues("forms").forEach((form, i) => {
          if (setContent) {
            setValue(`forms.${i}.select_menu_option`, {
              label: form.pages[0].modal.title,
              description: "",
            });
          }
        });
        break;
      case "application_command":
        setValue('message', undefined)
        setValue(`select_menu_placeholder`, undefined);
        setTimeout(() => {
          setValue('message', undefined)
        }, 1);
        getValues("forms").forEach((form, i) => {
          setValue(`forms.${i}.select_menu_option`, undefined);
          //@ts-expect-error
          setValue(`forms.${i}.button`, undefined);
          if (setContent) {
            setValue("application_command", {
              name: "",
            });
          }
        });
        break;
    }
  };

  const [premium, _setPremium] = useState(false);
  const [submissionType, _setSubmissionType] = useState(['bot'])
  const [submissionChannel, _setSubmissionChannel] = useState(['existing'])

  function setPremium(value: any) {
    _setPremium(value)
    if (!value) {
      _setSubmissionType(submissionType.map((value, i) => {
        setValue(`forms.${i}.webhook_url`, undefined);
        return 'bot';
      }))
      _setSubmissionChannel(submissionChannel.map((value, i) => {
        setValue(`forms.${i}.submit_channel`, undefined);
        setValue(`forms.${i}.submit_thread`, undefined);
        return 'existing';
      }))
      getValues('forms').forEach((form, index) => {
        setDisplayPage(0)
        setValue(`forms.${index}.pages`, [getValues(`forms.${index}.pages.0`)])
        setValue(`forms.${index}.cooldown`, undefined)
        //@ts-expect-error
        getValues(`forms.${index}.submit_components`)?.forEach((action_row, ii) => {
          //@ts-expect-error
          getValues(`forms.${index}.submit_components.${ii}.components`)?.forEach((component, iii) => {
            //@ts-expect-error
            setValue(`forms.${index}.submit_components.${ii}.components.${iii}.logic.REQUIRED_PERMISSIONS`, undefined)
          })
        })
      })
    }
  }

  function setPreset(preset?: string) {
    switch (preset) {
      case 'application': {
        _setSubmissionChannel(['existing'])
        setValue('forms.0.submit_channel', undefined)
        setValue('forms.0.submit_thread', undefined)

        //@ts-expect-error
        setValue('forms.0.submit_components', [{
          type: 1,
          components: [
            {
              type: 2,
              label: 'Accept',
              style: 3,
              logic: {
                DM_SUBMITTER: { content: 'Your submission to **{FormTitle}** has been accepted!' },
                REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW: true,
                UPDATE_COMPONENT: { label: 'Accepted' }
              }
            },
            {
              type: 2,
              label: 'Deny',
              style: 4,
              logic: {
                DM_SUBMITTER_WITH_MODAL_INPUT: {
                  modal: {
                    title: 'Deny Submission',
                    components: [
                      {
                        type: 1,
                        components: [
                          {
                            type: 4,
                            style: 2,
                            label: 'Reason for denial'
                          }
                        ]
                      }
                    ]
                  },
                  message: {
                    content: 'Sorry! Your submission to **{FormTitle}** has been denied.\n\n**Reason:** {TextInputValue1}'
                  }
                },
                REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW: true,
                UPDATE_COMPONENT: { label: 'Denied' }
              }
            }
          ]
        }])
        setStage('openFormType')
        break;
      }
      case 'ticket': {
        setValue('forms.0.submit_thread', undefined)

        setPremium(true)
        _setSubmissionChannel(['new'])
        setValue('forms.0.submit_channel', {
          name: 'ticket-{SubmissionNumber}',
          type: 0,
          permission_overwrites: [
            {
              id: '{ServerID}',
              type: 0,
              deny: 1024
            },
            {
              id: '{ApplicationID}',
              type: 1,
              allow: 19456
            },
            {
              id: '{UserID}',
              type: 1,
              allow: 52224
            }
          ]
        })
        //@ts-expect-error
        setValue('forms.0.submit_components', [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Close Ticket',
                emoji: {
                  name: '🔒'
                },
                style: 2,
                logic: {
                  UPDATE_COMPONENT: {
                    label: 'Ticket Closed'
                  },
                  UPDATE_THIS_CHANNEL: {
                    name: '🔒-{ChannelName}',
                    permission_overwrites: [
                      {
                        id: '{ServerID}',
                        type: 0,
                        deny: 1024
                      },
                      {
                        id: '{ApplicationID}',
                        type: 1,
                        allow: 19456
                      },
                      {
                        id: '{UserID}',
                        type: 1,
                        deny: 2048
                      }
                    ]
                  },
                  SEND_MESSAGE_TO_THIS_CHANNEL: {
                    content: '**{ChannelName}** closed by **{InteractionUserName}**'
                  }
                }
              },
              {
                type: 2,
                label: 'Delete Ticket',
                emoji: {
                  name: '🗑️'
                },
                style: 4,
                logic: {
                  DELETE_THIS_CHANNEL: true
                }
              }
            ]
          }
        ])
        setStage('openFormType')
        break;
      }
      case 'thread_ticket': {
        setValue('forms.0.submit_channel', undefined)

        setPremium(true)
        _setSubmissionChannel(['new_thread'])
        setValue('forms.0.submit_thread', {
          name: 'ticket-{SubmissionNumber}',
          type: 12,
          add_submitter: true
        })
        //@ts-expect-error
        setValue('forms.0.submit_components', [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Close Ticket',
                emoji: {
                  name: '🔒'
                },
                style: 2,
                logic: {
                  UPDATE_COMPONENT: {
                    label: 'Ticket Closed'
                  },
                  UPDATE_THIS_CHANNEL: {
                    name: '🔒-{ChannelName}',
                    locked: true,
                    archived: true
                  },
                  SEND_MESSAGE_TO_THIS_CHANNEL: {
                    content: '**{ChannelName}** closed by **{InteractionUserName}**'
                  }
                }
              },
              {
                type: 2,
                label: 'Delete Ticket',
                emoji: {
                  name: '🗑️'
                },
                style: 4,
                logic: {
                  DELETE_THIS_CHANNEL: true
                }
              }
            ]
          }
        ])
        setStage('openFormType')
        break;
      }
      default: setStage('openFormType')
    }
  }

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true


      const urlParams = new URLSearchParams(window.location.search)

      const urlData = urlParams.get('data')
      const urlPreset = urlParams.get('preset')

      if (urlPreset) setPreset(urlPreset)
      if (urlData) {
        const { data } = JSON.parse(Buffer.from(decodeURIComponent(urlData), 'base64').toString('utf-8'))
        reset(data)
        if (data.application_command) {
          setOpenFormType("application_command", false);
        } else if (data.forms[0].select_menu_option) {
          setOpenFormType("select_menu", false);
          setTimeout(() => {
            setValue('message.components', undefined)
          }, 1);
        } else {
          setOpenFormType("button", false);
        }

        //@ts-expect-error
        let newSubmissionType = []
        //@ts-expect-error
        let newSubmissionChannel = []
        //@ts-expect-error
        data.forms.forEach((form, i) => {
          if (form.webhook_url || Number.isInteger(form.cooldown) || form.pages.length > 1) setPremium(true)
          if (form.submit_channel) {
            setTimeout(() => {
              //@ts-expect-error
              if (form.submit_channel?.parent_id === '') setValue(`forms.${i}.submit_channel.parent_id`, undefined)

              //@ts-expect-error
              if (getValues(`forms.${i}.submit_channel.permission_overwrites`)) getValues(`forms.${i}.submit_channel.permission_overwrites`).forEach((overwrite, ii) => {
                console.log('overwrite', overwrite)
                //@ts-expect-error
                if (overwrite.allow === '') setValue(`forms.${i}.submit_channel.permission_overwrites.${ii}.allow`, undefined)
                //@ts-expect-error
                if (overwrite.deny === '') setValue(`forms.${i}.submit_channel.permission_overwrites.${ii}.deny`, undefined)
              })
            }, 1);
          }
          if (form.submit_components) {
            //@ts-expect-error
            form.submit_components.forEach((action_row, ii) => {
              if (action_row.components) {
                //@ts-expect-error
                action_row.components.forEach((component, iii) => {
                  if (component?.logic && component?.logic?.REQUIRED_PERMISSIONS) setPremium(true)
                  setTimeout(() => {
                    if (component?.logic?.UPDATE_THIS_CHANNEL?.permission_overwrites) {
                      //@ts-expect-error
                      getValues(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites`).forEach((overwrite, iiii) => {
                        //@ts-expect-error
                        if (overwrite.allow === '') setValue(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.allow`, undefined)
                        //@ts-expect-error
                        if (overwrite.deny === '') setValue(`forms.${i}.submit_components.${ii}.components.${iii}.logic.UPDATE_THIS_CHANNEL.permission_overwrites.${iiii}.deny`, undefined)
                      })
                    }
                  }, 1)
                })
              }
            })
          }



          if (form.webhook_url) {
            newSubmissionType.push('webhook_url')
          } else {
            newSubmissionType.push('bot')
          }

          if (form.submit_channel) {
            newSubmissionChannel.push('new')
          } else if (form.submit_thread) {
            newSubmissionChannel.push('new_thread')
          } else {
            newSubmissionChannel.push('existing')
          }
        });
        //@ts-expect-error
        _setSubmissionType(newSubmissionType)
        //@ts-expect-error
        _setSubmissionChannel(newSubmissionChannel)

        setStage('editor')

      }

    }

  }, [])

  const [displayForm, setDisplayForm] = useState(0);
  const [displayPage, setDisplayPage] = useState(0);
  const [displaySection, setDisplaySection] = useState(1);
  const [stage, setStage] = useState('welcome') //server_selection
  const SettingsModal = useModal();
  const isNotSmallScreen = useScreenWidth(1070);


  useEffect(() => {


    try {
      window.history.pushState(null, '', `?data=${encodeURIComponent(Buffer.from(JSON.stringify({
        version: '1',
        data: watch()
      })).toString('base64'))}`)
    } catch (e) { console.error(e) }
  }, [watch()])

  return (
    <>
      <Meta>Home</Meta>
      <Navigation displaySection={displaySection} setDisplaySection={setDisplaySection} modalHandler={SettingsModal.modalHandler} setStage={setStage} />
      <Grid gridTemplateColumns={isNotSmallScreen ? '1fr 1fr' : '1fr'}>
        {/* @ts-expect-error */}
        <Editor resetField={resetField} displayForm={displayForm} setDisplayForm={setDisplayForm} displayPage={displayPage} setDisplayPage={setDisplayPage} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} displaySection={isNotSmallScreen || displaySection !== 2} stage={stage} setStage={setStage} formMessageComponents={formMessageComponents} formMessageComponentsAppend={formMessageComponentsAppend} formMessageComponentsRemove={formMessageComponentsRemove} formMessageComponentsMove={formMessageComponentsMove} openFormType={openFormType} setOpenFormType={setOpenFormType} setPremium={setPremium} premium={premium} submissionType={submissionType} _setSubmissionType={_setSubmissionType} submissionChannel={submissionChannel} _setSubmissionChannel={_setSubmissionChannel} setPreset={setPreset} />
        {/* @ts-expect-error */}
        <Preview message={watch('message')} forms={watch('forms')} select_menu_placeholder={watch('select_menu_placeholder')} application_command={watch('application_command')} displayForm={displayForm} setDisplayForm={setDisplayForm} displayPage={displayPage} setDisplayPage={setDisplayPage} displaySection={isNotSmallScreen || displaySection !== 1} stage={stage} />
      </Grid>
    </>
  );
}
