import { DefaultButton, IColumn, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react'
import { Grid } from '@material-ui/core'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GenericTable } from '../../components/GenericTable'
import { Paper } from '../../components/Paper'
import { ICampusCreateRequest } from '../../domain/api/contracts/campusCreateRequest'
import { CampusApi } from '../../domain/api/requests/CampusApi'
import { ICampus } from '../../domain/entities/campus'
import { store } from '../../domain/stores/Store'
import { theme } from '../../domain/utils/theme'

export const CampusManager = () => {
  const history=useHistory()
  let columns: IColumn[] = [
    { key: 'id', name: 'ID', fieldName: 'id', minWidth: 10, maxWidth: 50, isResizable: true },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 10, maxWidth: 100, isResizable: true },
    { key: 'action', name: 'Action', fieldName: 'action', minWidth: 10, maxWidth: 100, isResizable: true },
  ]

  const [loading, setLoading] = useState(false)
  const [campuses, setCampuses] = useState<ICampus[]>([])
  const [messageBarCreated, setMessageBarCreated] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {

        let res = await CampusApi.getAll();
        setCampuses(res)


      } catch (error) {

      } finally {
        setLoading(false);
      }

    })()

  }, [])


  const formik = useFormik<ICampusCreateRequest>({
    initialValues: {
      name: ''
    },
    onSubmit: () => {

    },
    validate:async (values) => {
      try {
        store.GeneralStore.dimmerOpenboolean=true;
        let id = await CampusApi.post(values);
        setCampuses([...campuses,{id:id,name:values.name}])

        
      } catch (error) {
        formik.errors.name="Name already exists"
      }finally{
        store.GeneralStore.dimmerOpenboolean=false;
      }

    },
    validateOnChange: false,

  });

  return (
    <div>
      <h1>Campuses</h1>
      <Grid container spacing={theme.containerSpacing}>
        <Grid item sm={12} lg={7} >
          <Paper>
            <GenericTable
              columns={columns}
              data={campuses.map(item=>{
                return{
                  name:item.name,
                  id:item.id,
                  action: <DefaultButton onClick={() => history.push('/CampusManager/Campus/' + item.id)} text='View' />,
 
                }
              })}
              loadingTableItems={loading}
              filterFileds={["name"]} />
          </Paper>
        </Grid>
        <Grid item sm={12} lg={5}>
          <Paper>
            <form onSubmit={formik.handleSubmit}>
              <TextField name='name' value={formik.values.name} errorMessage={formik.errors.name} onChange={formik.handleChange} label='Name' />
              <br />
              {
                messageBarCreated ? (<MessageBar messageBarType={MessageBarType.success}
                  truncated={true}>
                  Campus has been created
                </MessageBar>) : ''
              }
              <br />
              <PrimaryButton type='submit' text='Submit' style={{ width: '40%' }} />
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
