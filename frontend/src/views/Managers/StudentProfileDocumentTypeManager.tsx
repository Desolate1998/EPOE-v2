import { DefaultButton, Dropdown, IColumn, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react'
import { Grid } from '@material-ui/core'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GenericTable } from '../../components/GenericTable'
import { Paper } from '../../components/Paper'
import { ICreateProfileDocumentTypeRequest } from '../../domain/api/contracts/createProfileDocumentType'
import { ProfileDocumentTypeApi } from '../../domain/api/requests/ProfileDocumentType'
import { IMessageBarCustom } from '../../domain/entities/messageBar'
import { IProfileDocumentType } from '../../domain/entities/ProfileDocumentType'
import { store } from '../../domain/stores/Store'
import { theme } from '../../domain/utils/theme'

export const StudentProfileDocumentTypeManager = () => {
  let columns: IColumn[] = [
    { key: 'id', name: 'ID', fieldName: 'id', minWidth: 10, maxWidth: 50, isResizable: true },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 10, maxWidth: 100, isResizable: true },
    { key: 'description', name: 'Description', fieldName: 'description', minWidth: 10, maxWidth: 100, isResizable: true },
    { key: 'column3', name: 'Active ', fieldName: 'active', minWidth: 10, maxWidth: 50, isResizable: true, },
    { key: 'column4', name: 'Action', fieldName: 'action', minWidth: 10, maxWidth: 100, isResizable: true }
  ]
  const [profileDocumentTypes, setProfileDocumentTypes] = useState<IProfileDocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({ message: '', type: MessageBarType.success, visable: false });
  const [profileDocumentTypesFiltred, setprofileDocumentTypesFiltred] = useState<IProfileDocumentType[]>([])
  const [activeFilter, setActiveFilter] = useState<'0' | '1' | '2'>('0')


  let history = useHistory()
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        let res = await ProfileDocumentTypeApi.getAll();
        setProfileDocumentTypes([...res]);
        setprofileDocumentTypesFiltred([...res])
      } catch (error) {

      } finally {
        setLoading(false)
      }
    })();
  }, [])

  let formik = useFormik<ICreateProfileDocumentTypeRequest>({
    initialValues: {
      description: '',
      name: '',

    }, onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        store.GeneralStore.dimmerOpenboolean = true;
        await ProfileDocumentTypeApi.post(values);

        setMessageBar({ message: "New Profile Document Type Has Been Created", visable: true, type: MessageBarType.success })
        setTimeout(() => { setMessageBar({ ...messageBar, visable: false }) }, 5000)
        formik.setFieldValue('name', '');
        resetForm()
        setErrors({})
        setTimeout(() => { setMessageBar({ ...messageBar, visable: false }) }, 500)
        let res = await ProfileDocumentTypeApi.getAll();
        setProfileDocumentTypes([...res]);
        setprofileDocumentTypesFiltred([...res])
      } catch (error) {
        setMessageBar({ message: "The name is already in use", visable: true, type: MessageBarType.error })
        setTimeout(() => { setMessageBar({ ...messageBar, visable: false }) }, 5000)
      } finally {
        store.GeneralStore.dimmerOpenboolean = false;

      }
    }, validate: (values) => {
      let errors: any = {}
      if (values.name.length < 1) {
        errors.name = "Name cannot be empty."
      }
      return errors;
    },
    validateOnChange: false,
  })


  function setActiveFilterData(activeKey: '0' | '1' | '2' | null) {
    if (activeKey == null) {
      activeKey = activeFilter
    }

    var data = profileDocumentTypes
    if (activeKey === '1') {
      data = data.filter(x => x.active);
    } else if (activeKey === '2') {
      data = data.filter(x => !x.active)
    }

    setprofileDocumentTypesFiltred([...data])
  }
  return (
    <div>
      <h1>Profile Documents Manager</h1>
      <Grid container spacing={theme.containerSpacing}>
        <Grid item sm={12} lg={7} >
          <Paper>
            <GenericTable columns={columns} data={profileDocumentTypesFiltred.map(item => {
              return {
                ...item,
                action: <DefaultButton onClick={()=>history.push('/StudentProfileDocumentsManager/'+item.id)}>View</DefaultButton>
              }
            })} filterFileds={["name", "description", "active", "id"]} loadingTableItems={loading}>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                <Dropdown
                  style={{ width: '200px', marginRight: '10px' }}
                  label="Active Filter"
                  selectedKey={activeFilter}
                  options={
                    [
                      { key: '0', text: 'All' },
                      { key: '1', text: 'Active' },
                      { key: '2', text: 'InActive' },
                    ]
                  }
                  onChange={(e, value) => {
                    //@ts-ignore
                    setActiveFilter(value.key)
                    //@ts-ignore
                    setActiveFilterData(value.key)
                  }}
                />
              </div>
            </GenericTable>
          </Paper>
        </Grid>
        <Grid item sm={12} lg={5}>
          <Paper>
            <h2>Create New Profile Document</h2>
            <form onSubmit={formik.handleSubmit}>
              <TextField onChange={formik.handleChange} name='name' errorMessage={formik.errors.name} label='Name' />
              <TextField name='description' onChange={formik.handleChange} multiline label='Description' />
              <br />
              {
                messageBar.visable && (
                  <MessageBar messageBarType={messageBar.type}  >
                    {messageBar.message}
                  </MessageBar>
                )
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
