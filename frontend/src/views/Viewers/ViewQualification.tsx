import { Dialog, Dropdown, MessageBar, MessageBarType, DialogContent, DialogFooter, PrimaryButton, ProgressIndicator, TextField, Toggle, DefaultButton, DialogType, ContextualMenu } from '@fluentui/react';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import { QueryBuilder } from 'odata-query-builder';
import { useEffect, useState, } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { DangerButton } from '../../components/DangerButton';
import { DialogGlass } from '../../components/DialogGlass';
import { GenericTable } from '../../components/GenericTable';
import { Paper } from '../../components/Paper';
import { IModuleCreateRequest } from '../../domain/api/contracts/moduleCreateRequest.';
import { ModuleApi } from '../../domain/api/requests/ModuleApi';
import { NqfLevelApi } from '../../domain/api/requests/NqfLevelApi';
import { QualificationApi } from '../../domain/api/requests/QualificationApi';
import { IMessageBarCustom } from '../../domain/entities/messageBar';
import { IModule } from '../../domain/entities/module';
import { INqfLevel } from '../../domain/entities/nqfLevel';
import { IQualification } from '../../domain/entities/qualification';
import { store } from '../../domain/stores/Store';
import { theme } from '../../domain/utils/theme';

export const ViewQualification = () => {
  let columns = [
    {
      key: "column1",
      name: "Id",
      fieldName: "id",
      minWidth: 10,
      maxWidth: 20,
      isResizable: true,
    },
    {
      key: "column2",
      name: "Name",
      fieldName: "name",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    }, {
      key: "column4",
      name: "Active",
      fieldName: "active",
      minWidth: 10,
      maxWidth: 50,
      isResizable: true,
    },
    {
      key: "column6",
      name: "Description",
      fieldName: "description",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Action",
      fieldName: "action",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
  ];
  //@ts-ignore
  //#region state
  const { id } = useParams();
  const [qualification, setQualification] = useState<IQualification>()
  const [loadingTableItems, setLoadingTableItems] = useState(false)
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [nqfLevels, setNqfLevels] = useState<INqfLevel[]>([])
  const [addNewModuleOpen, setAddNewModuleOpen] = useState(false)
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({ message: '', type: MessageBarType.success, visable: false });
  const [messageBarAddModuleDone, setMessageBarAddModuleDone] = useState('')
  const [modules, setModules] = useState<IModule[]>([])
  const [currentFilter, setCurrentFilter] = useState<'0' | '1' | '2'>('0')
  const history = useHistory()

  //#endregion

  //#region Functions
  function setModulesData(key: '0' | '1' | '2', moduleFilter?: IModule[] | null) {
    setCurrentFilter(key)
    let data: IModule[] = []
    if (moduleFilter) {
      data = moduleFilter
    } else {
      data = qualification?.modules!
    }
    console.log(`key`, key)
    switch (key) {
      case '1':
        data = data.filter(x => x.active)
        setModules(data)
        break;
      case '2':
        data = data.filter(x => !x.active)
        setModules(data)
        break;

      default:
        setModules(data)

        break;
    }
  }

  useEffect(() => {
    (async function getApi() {
      try {
        setLoadingTableItems(true)
        let query = new QueryBuilder().expand('Modules').toQuery();
        let res = await QualificationApi.get("/" + id + query);
        let nqfs = await NqfLevelApi.getAll('');
        setQualification(res);
        setNqfLevels(nqfs)
        setModulesData(currentFilter, res.modules)
      } catch (error) {

      } finally {
        setLoadingTableItems(false)

      }
    })();
  }, []);


  const update = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true
      await QualificationApi.update(qualification!)
      setUpdateErrorMessage("")
      setMessageBar({
        message: "Updated!",
        type: MessageBarType.success,
        visable: true
      });
      setTimeout(() => {
        setMessageBar({
          message: "Updated!",
          type: MessageBarType.success,
          visable: false
        });
      }, 3000);
    } catch (error) {
      setUpdateErrorMessage("Chosen name is already in use.")
    } finally {
      store.GeneralStore.dimmerOpenboolean = false;
    }
  }
  let formik = useFormik<IModuleCreateRequest>({
    initialValues: {
      active: true,
      description: '',
      name: '',
      //@ts-ignore
      qualificationId: useParams().id

    },
    onSubmit: async (values) => {
      try {
        store.GeneralStore.dimmerOpenboolean = true;
        let id = await ModuleApi.post(values)
        setQualification({ ...qualification!, modules: [{ ...values, id: id, activities: [] }, ...qualification!.modules] })
        setModulesData(currentFilter, [{ ...values, id: id, activities: [] }, ...qualification!.modules])
        setAddNewModuleOpen(false);
        formik.resetForm()
        setMessageBarAddModuleDone("Module has been added!");
        setTimeout(() => { setMessageBarAddModuleDone('') }, 5000)
      } catch (error) {
        //@ts-ignore
        formik.errors.name = error.response?.data.message
      }
      finally {
        store.GeneralStore.dimmerOpenboolean = false;
      }
    },
    validateOnChange: false,
    validate: values => {
      let errors: any = {}
      if (values.name.split(' ').join('') === '') {
        errors.name = 'Required'
      }

      return errors
    },


  })
  //#endregion

  if (!qualification) return <ProgressIndicator label="Loading Data Item" />;
  return (
    <div>
      <h1>Qualification</h1>
      <DialogGlass open={addNewModuleOpen} subText='The module wil be added to the current qualification.After module has been created, activties can be added to the module' title='Add new Module'>
        <TextField label='Name' name='name' errorMessage={formik.errors.name} value={formik.values.name} onChange={formik.handleChange} />
        <TextField
          value={formik.values.description}
          onChange={formik.handleChange}
          name='description'
          resizable={true}
          label="Description"
          multiline
        />

        <DialogFooter>
          <DangerButton text="Cancel" onClick={() => {
            setAddNewModuleOpen(false)
            formik.resetForm()
          }} />

          <PrimaryButton type='submit' onClick={() => {
            formik.handleSubmit()
          }
          } text="Submit" />
        </DialogFooter>
      </DialogGlass>
      <Grid spacing={theme.containerSpacing} container>
        <Grid item xs={12} md={3} lg={3}>
          <Paper>
            <TextField label='Name' value={qualification.name} onChange={(e) => {
              setQualification({
                ...qualification,
                name: e.currentTarget.value,
              })
            }}
              errorMessage={updateErrorMessage}
            />
            <TextField label='Description' value={qualification.description} onChange={(e) => {
              setQualification({
                ...qualification,
                description: e.currentTarget.value
              })
            }}
              errorMessage={updateErrorMessage}
              multiline
            />
            <Dropdown options={nqfLevels.map(item => {
              return {
                key: item.id,
                text: item.name
              }
            })} label='NQF Level'
              onChange={(e, item) => {
                setQualification({
                  id: qualification.id,
                  modules: qualification.modules,
                  name: qualification.name,
                  //@ts-ignore
                  nqfLevelId: item?.key!,
                  active: qualification.active
                })
              }}
              selectedKey={qualification.nqfLevelId}

            />
            <Toggle label='Active' onText='Visable' offText='Hidden' checked={qualification.active} onChange={(e, state) => {
              setQualification({
                ...qualification,
                //@ts-ignore
                active: state
              })
            }} />

            <div style={{ marginTop: '10px' }} hidden={!messageBar.visable}>
              <MessageBar dismissButtonAriaLabel="Close" messageBarType={messageBar.type}  >
                {messageBar.message}
              </MessageBar>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <PrimaryButton label='Update' onClick={() => update()} color='Primary' >Update</PrimaryButton>
            </div>

          </Paper>
        </Grid>

        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            <h2>Modules</h2>
            <div>
              <PrimaryButton label='Add Module' onClick={() => setAddNewModuleOpen(true)} style={{ right: 0 }}>
                Add Module
              </PrimaryButton>


              <div style={{ marginTop: '10px' }} hidden={messageBarAddModuleDone === ''}>
                <MessageBar dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}  >
                  {"Module has been created for this Qualification."}
                </MessageBar>
              </div>
            </div>
            <GenericTable data={modules.map(item => {
              return { ...item, action: <DefaultButton onClick={() => history.push('/QualificationManager/Module/' + item.id)} text='View' />, }
            })}
              filterFileds={["name"]} loadingTableItems={loadingTableItems} columns={columns} >
              <Dropdown
                style={{ width: '200px', marginRight: '10px' }}
                label="Active Filter"
                options={
                  [
                    { key: '0', text: 'All' },
                    { key: '1', text: 'Active' },
                    { key: '2', text: 'InActive' },

                  ]
                }
                onChange={(e, value) => {
                  //@ts-ignore
                  setModulesData(value?.key)
                }}
              />
            </GenericTable>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
