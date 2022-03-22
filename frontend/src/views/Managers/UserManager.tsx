import { BaseButton, CommandButton, DefaultButton, Dropdown, IColumn, MessageBar, MessageBarType, nullRender, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react'
import { Button, colors, Grid } from '@material-ui/core'
import { useFormik } from 'formik'
import { QueryBuilder } from 'odata-query-builder'
import React, { useEffect, useState } from 'react'
import { GenericTable } from '../../components/GenericTable'
import { Paper } from '../../components/Paper'
import { SuccessButton } from '../../components/SuccessButton'
import { ICreateUserRequest } from '../../domain/api/contracts/createUserRequest'
import { IUserLoginsStatisticsInformation } from '../../domain/api/Data Transfer Objects/userLoginStatisticsInformation'
import { UserApi } from '../../domain/api/requests/UserApi'
import { IMessageBarCustom } from '../../domain/entities/messageBar'
import { IUser } from '../../domain/entities/user'
import { UserType } from '../../domain/enums/UserType'
import { store } from '../../domain/stores/Store'
import { theme } from '../../domain/utils/theme'

export const UserManager = () => {
  let columns: IColumn[] = [
    { key: 'id', name: 'ID', fieldName: 'id', minWidth: 200, maxWidth: 200, isResizable: true },
    { key: 'name', name: 'First Name', fieldName: 'firstName', minWidth: 10, maxWidth: 100, isResizable: true },
    { key: 'lastName', name: 'Last Name', fieldName: 'lastName', minWidth: 10, maxWidth: 100, isResizable: true },
    { key: 'view', name: 'View', fieldName: 'view', minWidth: 10, maxWidth: 100, isResizable: true },

  ]
  const [selectedUserType, setSelectedUserType] = useState<UserType>(UserType.Student);
  const [users, setUsers] = useState<IUser[]>([])
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({ message: '', type: MessageBarType.success, visable: false });
  useEffect(() => {
    (async () => {

    })()
  }, [])

  let formik = useFormik<ICreateUserRequest>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      userType: selectedUserType,

    },
    onSubmit: async (values) => {
      console.log(values)
      try {
        store.GeneralStore.dimmerOpenboolean = true;
        let res = await UserApi.post(values);
        formik.resetForm()
        setMessageBar({ ...messageBar, message: 'User has been created.' })
        setTimeout(() =>
          setMessageBar({ ...messageBar, message: '' })
          , 5000)
          formik.errors ={}
      } catch (error) {
        //@ts-ignore
        console.log(error.response)
        formik.errors.email = "Email already exists"
      } finally {
        store.GeneralStore.dimmerOpenboolean = false;
      }
    }
  });
  return (
    <div>
      <h1>Users</h1>
      <Grid container spacing={theme.containerSpacing}>
        <Grid item sm={12} lg={7} >
          <Paper>
            <Dropdown options={[
              { key: UserType.AcademicPrinciple, text: 'Academic Principle' },
              { key: UserType.Admin, text: 'Admin' },
              { key: UserType.ExternalModerator, text: 'External Moderator' },
              { key: UserType.Facilitator, text: 'Facilitator' },
              { key: UserType.Student, text: 'Student' },
            ]} label='User types'
              onChange={async (e, item) => {
                //@ts-ignore
                setSelectedUserType(item?.key)
                //@ts-ignore
                let users = await UserApi.getUserInRole(item?.key, false)
                //@ts-ignore
                setUsers(users)
              }}
              selectedKey={selectedUserType}
            />
            <GenericTable columns={columns} data={users.map(item => {
              return {
                ...item,
                view: <DefaultButton>View</DefaultButton>
              }
            })} loadingTableItems={false} filterFileds={["firstName", "lastName", "id"]} />
          </Paper>
        </Grid>

        <Grid item sm={12} lg={5}>
          <Paper>
            <h2>Create New User</h2>
            <SuccessButton text='Batch Import' />
            <br />
            <small style={{ color: 'red', fontWeight: 'bolder' }}>To be implemented</small>
            <form onSubmit={formik.handleSubmit}>
              <TextField value={formik.values.email} errorMessage={formik.errors.email} onChange={formik.handleChange} name='email' label='Email' />
              <TextField value={formik.values.firstName} onChange={formik.handleChange} name='firstName' label='First Name' />
              <TextField value={formik.values.lastName} onChange={formik.handleChange} name='lastName' label='Last Name' />
              <TextField value={formik.values.phoneNumber} onChange={formik.handleChange} name='phoneNumber' label='Phone Number' />
              <Dropdown
                //@ts-ignore
                onChange={(e, option) => formik.setValues({ ...formik.values, userType: option?.key })} selectedKey={formik.values.userType} options={[
                  { key: UserType.AcademicPrinciple, text: 'Academic Principle' },
                  { key: UserType.Admin, text: 'Admin' },
                  { key: UserType.ExternalModerator, text: 'External Moderator' },
                  { key: UserType.Facilitator, text: 'Facilitator' },
                  { key: UserType.Student, text: 'Student' },
                ]} label='Type Of User' />
              <br />
              <div style={{ marginTop: '10px',marginBottom:'10px' }} hidden={messageBar.message === ''}>
                <MessageBar dismissButtonAriaLabel="Close" messageBarType={MessageBarType.success}  >
                  {messageBar.message}
                </MessageBar>
              </div>
              <PrimaryButton type='submit' text='Submit' />
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
