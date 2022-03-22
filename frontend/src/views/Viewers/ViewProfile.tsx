import { DefaultButton, DialogContent, DialogFooter, Icon, MessageBar, MessageBarType, Persona, PersonaSize, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react'
import { ButtonBase, DialogActions, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { DangerButton } from '../../components/DangerButton'
import { DialogGlass } from '../../components/DialogGlass'
import { Paper } from '../../components/Paper'
import { SuccessButton } from '../../components/SuccessButton'
import { UserApi } from '../../domain/api/requests/UserApi'
import { IUser } from '../../domain/entities/user'
import { store, useStore } from '../../domain/stores/Store'
import { IMessageBarCustom } from '../../domain/entities/messageBar'
import config from '../../appConfig.json'
import { setTimeout } from 'timers'


export const ViewProfile = () => {
  
  
  const [user, setUser] = useState<IUser>()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedPhotoSrc, setUploadedPhotoSrc] = useState<any>();
  const [changePasswordDialog, setChangePasswordDialog] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
  const [messageBarChangePassword, setMessageBarChangePassword] = useState<IMessageBarCustom>({
    message: '',
    type: MessageBarType.info,
    visable: false
  })
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>();
  const [messageBarProfilePicture, setMessageBarProfilePicture] = useState<IMessageBarCustom>({
    message: '',
    type: MessageBarType.info,
    visable: false
  });
  

  useEffect(() => {
    (async () => {
      let res = await UserApi.me()
      setUser(res)
    })()
  }, [])


  const updatePassword = async()=>{
     if(confirmNewPassword!==newPassword){
      setMessageBarChangePassword({
        message:"Passwords does not match",
        type:MessageBarType.error,
        visable:true
      });
      setTimeout(()=>{setMessageBarChangePassword({...messageBarChangePassword,visable:false})},5000);
     }else{
       if(newPassword.length>7){
         
       }
       try {
         store.GeneralStore.dimmerOpenboolean =true
         let data = new FormData();
         data.append("password",newPassword)
         await UserApi.updatePassword(data);
         setMessageBarChangePassword({
          message:"Password was successfully updated",
          type:MessageBarType.success,
          visable:true
        });

      setTimeout(()=>{setMessageBarChangePassword({...messageBarChangePassword,visable:false})},5000);
       } catch (error) {
        setMessageBarChangePassword({
          message:"Something went wrong while updating password.",
          type:MessageBarType.error,
          visable:true
        });

      setTimeout(()=>{setMessageBarChangePassword({...messageBarChangePassword,visable:false})},5000);

       }finally{
        store.GeneralStore.dimmerOpenboolean =false

       }
     }
  }

  const updateProfilePicture = async () => {
    let form = new FormData()
    console.log(uploadedPhoto);
    form.append('image', uploadedPhoto!);
    try {
      store.GeneralStore.dimmerOpenboolean = true;
      let res = await UserApi.uploadProfileImage(form)
      AuthenticationStore.user.profilePicture = null
      AuthenticationStore.user.profilePicture = res;
    } catch (error) {
      setMessageBarProfilePicture({
        message:"Failed To Update Profile Picture",
        type:MessageBarType.error,
        visable:true
      })
        setTimeout(()=>{setMessageBarProfilePicture({...messageBarProfilePicture,visable:false})},5000)

    } finally {
      setMessageBarProfilePicture({
        message:"Profile Picture Updated, changes might only be effected on next launch or refresh",
        type:MessageBarType.success,
        visable:true
      })
        setTimeout(()=>{setMessageBarProfilePicture({...messageBarProfilePicture,visable:false})},5000)

      store.GeneralStore.dimmerOpenboolean = false;

    }
  }


  const { AuthenticationStore } = useStore()


  let fileUploadRef: HTMLElement | null;
  if (!user) return <ProgressIndicator label="Loading User Infromation" />;
  return (
    <div >
      <DialogGlass open={dialogOpen} subText={''} title={'Update Profile Picture'}>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <Persona size={PersonaSize.size120} imageUrl={uploadedPhotoSrc ? uploadedPhotoSrc : config.profilePicturesUrl + AuthenticationStore.user.profilePicture} />
          <Persona size={PersonaSize.size40} imageUrl={uploadedPhotoSrc ? uploadedPhotoSrc : config.profilePicturesUrl + AuthenticationStore.user.profilePicture} />
          <Persona size={PersonaSize.size24} imageUrl={uploadedPhotoSrc ? uploadedPhotoSrc : config.profilePicturesUrl + AuthenticationStore.user.profilePicture} />

          {
            messageBarProfilePicture.visable && (
              <MessageBar messageBarType={messageBarProfilePicture.type}    >
                {messageBarProfilePicture.message}
              </MessageBar>
            )
          }
          <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <br />
            <label htmlFor="profileUpload">
              <ButtonBase
                onClick={() => fileUploadRef?.click()}
                style={{
                  padding: '5px',
                  borderRadius: '8px'
                }}><Icon iconName='cloudUpload' color='red' styles={{
                  root: {
                    color: '#0078D4',
                    marginRight: '10px'
                  }
                }}

                />Upload Photo</ButtonBase>
            </label>
            <input accept="image/png, image/gif, image/jpeg" type="file" id='profileUpload' hidden ref={ref => fileUploadRef = ref}
              onChange={(e) => {
                //@ts-ignore
                var file = e.target.files[0]
                setUploadedPhoto(file)
                const reader = new FileReader();
                reader.onload = () => {
                  setUploadedPhotoSrc(reader.result)
                }
                if (file) {
                  reader.readAsDataURL(file)
                  setUploadedPhotoSrc(reader.result)
                } else {
                  setUploadedPhotoSrc('')
                }
              }}

            />
            <ButtonBase
            onClick={()=>UserApi.removeProfilePicture()}
              disabled={uploadedPhotoSrc === ''}
              style={{
                padding: '5px',
                borderRadius: '5px',
                backgroundColor: '#e63946',
                color: uploadedPhotoSrc === '' || AuthenticationStore.user.profilePicture == null ? 'grey' : 'white'
              }} ><Icon iconName='trash' color='red' styles={{
                root: {
                  color: uploadedPhotoSrc === '' || AuthenticationStore.user.profilePicture == null ? 'grey' : 'white',
                  marginRight: '10px',

                }
              
              }}
              
              /> Remove Photo</ButtonBase>
          </div>
          </div>
        <DialogFooter>
          <DefaultButton onClick={() => {
            setDialogOpen(false)
            setUploadedPhoto(null)
            setUploadedPhotoSrc('')

          }}>Close</DefaultButton>
          <PrimaryButton onClick={updateProfilePicture}>Save</PrimaryButton>
        </DialogFooter>
      </DialogGlass>

      <DialogGlass open={changePasswordDialog} subText='' title='Change Password'>
        <TextField label='New Password' type='password' onChange={(e)=>setNewPassword(e.currentTarget.value)}/>
        <TextField label='Confirm New Password' type='password' onChange={(e)=>setConfirmNewPassword(e.currentTarget.value)}/>
        <br />
        {
            messageBarChangePassword.visable && (
              <MessageBar messageBarType={messageBarChangePassword.type}>
                {messageBarChangePassword.message}
              </MessageBar>
            )
          }
        <DialogActions>
          <DefaultButton onClick={()=>setChangePasswordDialog(false)}>Close</DefaultButton>
          <PrimaryButton onClick={updatePassword} >Submit</PrimaryButton>
        </DialogActions>
      </DialogGlass>
      <h2>Your Info</h2>
      <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
        <Paper style={{ borderRadius: '5px', padding: '0', margin: '0', width: '80%' }}>
          <h2 style={{ marginLeft: '10px' }}>Public Info</h2>
          <div style={{ borderBottom: '1px solid lightgrey' }}>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
              <Persona size={PersonaSize.size120} imageUrl={config.profilePicturesUrl + AuthenticationStore.user.profilePicture} styles={{ root: { marginRight: '20px' } }} />
              <div>
                <p style={{ fontSize: '14px' }}>
                  Personalize your account with a photo. Your profile photo will appear publicly for everyone.
                </p>
                <PrimaryButton onClick={() => { setDialogOpen(true) }}>Manage Photo</PrimaryButton>
              </div>
            </div>
          </div>
          <div style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'grey', fontWeight: 'normal', marginBottom: '0' }}>Full Name</h3>
              {user.firstName + ' ' + user.lastName}
            </div>
          </div>
        </Paper>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
        <Paper style={{ borderRadius: '5px', padding: '0', marginTop: '20px', width: '80%' }}>
          <div style={{ padding: '10px' }}>
            <h2>Security</h2>
            <h3 style={{ color: 'grey', fontWeight: 'normal', marginBottom: '0' }}>Email</h3>
            {user.email} <Icon iconName='edit' style={{ cursor: 'pointer' }} />
            <h3 style={{ color: 'grey', fontWeight: 'normal', marginBottom: '0' }}>Password</h3>
            <PrimaryButton iconProps={{ iconName: 'lock' }} onClick={()=>setChangePasswordDialog(true)}>Change Password</PrimaryButton>
          </div>
        </Paper>
      </div>
    </div>
  )
}
