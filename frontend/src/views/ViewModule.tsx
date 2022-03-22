import { Dialog, Dropdown, MessageBar, MessageBarType, DialogContent, DialogFooter, PrimaryButton, ProgressIndicator, TextField, Toggle, DefaultButton, DialogType } from '@fluentui/react';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import { QueryBuilder } from 'odata-query-builder';
import { useEffect, useState, } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { DangerButton } from '../components/DangerButton';
import { DialogGlass } from '../components/DialogGlass';
import { GenericTable } from '../components/GenericTable';
import { Paper as CustomPaper } from '../components/Paper';

import { IActivityCreateRequest } from '../domain/api/contracts/activityCreateRequest';
import { IModuleCreateRequest } from '../domain/api/contracts/moduleCreateRequest.';

import { ActivityApi } from '../domain/api/requests/ActvityApi';
import { ModuleApi } from '../domain/api/requests/ModuleApi';
import { NqfLevelApi } from '../domain/api/requests/NqfLevelApi';
import { QualificationApi } from '../domain/api/requests/QualificationApi';
import { IActivity } from '../domain/entities/activity';
import { IMessageBarCustom } from '../domain/entities/messageBar';
import { IModule } from '../domain/entities/module';

import { store } from '../domain/stores/Store';
import { theme } from '../domain/utils/theme';



export const ViewModule = () => {
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
  const [id] = useState(useParams().id)
  const [module, setModule] = useState<IModule>()
  const [loadingTableItems, setLoadingTableItems] = useState(false)
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [addNewActivity, setAddNewActivity] = useState(false)
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({message: '',type: MessageBarType.success,visable: false});
  const [messageBarAddModuleDone, setMessageBarAddModuleDone] = useState('')
  const [actvities, setActvities] = useState<IActivity[]>([])
  const [currentFilter, setCurrentFilter] = useState<'0' | '1' | '2'>('0')
  const history = useHistory()

  //#endregion

  //#region Functions
  function setActvityData(key: '0' | '1' | '2',activityFilter?:IActivity[]|null) {
    setCurrentFilter(key)
    let data:IActivity[]=[]

  if(activityFilter)
  {
    data = activityFilter
  }else{
    data=module?.activities!
  }
  console.log(`key`, key)
    switch (key) {
      case '1':
        data = data.filter(x => x.active)
        setActvities(data)
        break;
      case '2':
        data = data.filter(x => !x.active)
        setActvities(data)
        break;

      default:
        setActvities(data)

        break;
    }
   


    console.log(actvities)
  }

  useEffect(() => {
    (async function getApi() {
      try {
        setLoadingTableItems(true)
        let query = new QueryBuilder().expand('Activities').toQuery();
        let res = await ModuleApi.get("/" + id + query);
        setModule(res);
        setActvityData(currentFilter,res.activities)
      } catch (error) {

      } finally {
        setLoadingTableItems(false)

      }
    })();
  }, []);


  const update = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true
      await ModuleApi.update(module!)
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


  let formik = useFormik<IActivityCreateRequest>({
    initialValues: {
      active: true,
      description: '',
      name: '',   
      moduleId:id 
    },
    onSubmit: async (values) => {
      try {
        store.GeneralStore.dimmerOpenboolean = true;
        let id =await ActivityApi.post(values)
        setModule({...module!,activities:[{...values,id:id},...module!.activities]})
        setActvityData(currentFilter,[{...values,id:id},...module!.activities])
        setAddNewActivity(false);
        formik.resetForm()
        console.log('rd')
        setMessageBarAddModuleDone("Module has been added!");
        setTimeout(()=>{setMessageBarAddModuleDone('')},5000)
        formik.errors={}
        console.log(formik.errors)
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

  if (!module) return <ProgressIndicator label="Loading Data Item" />;
  return (
    <div>
      <h1>Module</h1>
      <DialogGlass open={addNewActivity} title= "Add new Activity" subText='The activity wil be added to the current module.After the activity has been created'>
   
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
            setAddNewActivity(false)
            formik.resetForm()
          }} />

          <PrimaryButton type='submit' onClick={() => {
            formik.handleSubmit()
          }
          } text="Submit" />
        </DialogFooter>
        </DialogGlass>
      <Grid spacing={1} container>
        <Grid item xs={12} md={3} lg={3}>
          <CustomPaper>
            <TextField label='Name' value={module.name} onChange={(e) => {
              setModule({
                ...module,
                name: e.currentTarget.value,
              })
            }}
              errorMessage={updateErrorMessage}
            />
            <TextField label='Description' value={module.description} onChange={(e) => {
              setModule({
                ...module,
                description: e.currentTarget.value
              })
            }}
     
              multiline
            />

            <Toggle label='Active' onText='Visable' offText='Hidden' checked={module.active} onChange={(e, state) => {
              setModule({
               ...module,
                //@ts-ignore
                active: state
              })
            }} />
         
            <div style={{marginTop:'10px'}} hidden={!messageBar.visable}>
              <MessageBar dismissButtonAriaLabel="Close" messageBarType={messageBar.type}  >
                {messageBar.message}
              </MessageBar>
            </div>
          
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <PrimaryButton label='Update' onClick={() => update()} color='Primary' >Update</PrimaryButton>
            </div>

          </CustomPaper>
        </Grid>

        <Grid item xs={12} md={9} lg={9}>
          <CustomPaper>
            <h2>Activities</h2>
            <div>
              <PrimaryButton label='Add Module' onClick={() => setAddNewActivity(true)} style={{ right: 0 }}>
                Add Activity
              </PrimaryButton>
         
       
              <div style={{marginTop:'10px'}} hidden={messageBarAddModuleDone===''}>
              <MessageBar dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}  >
                {"Module has been created for this Qualification."}
              </MessageBar>
            </div>
            </div>
            <GenericTable data={actvities.map(item=>{
              return {...item,action:<DefaultButton onClick={() => history.push('/QualificationManager/Module/'+id+'/Activity/' + item.id)} text='View' />,}
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
                  setActvityData(value?.key)
                }}
              />
            </GenericTable>
          </CustomPaper>
        </Grid>
      </Grid>
    </div>
  );
}
