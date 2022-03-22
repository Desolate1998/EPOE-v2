import { ActionButton, MaskedTextField, PrimaryButton, Text, TextField } from '@fluentui/react'
import { useFormik } from 'formik'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { IRegister } from '../domain/api/contracts/register'
import { pageSetup } from '../domain/utils/pageSetup'
import registerImage from '../resources/images/Background_login.jpg'
import { isMobile } from 'react-device-detect';
import { emailValidation } from '../domain/utils/regexHelper'
import { removeMask } from '../domain/utils/removeMask'
import { useStore } from '../domain/stores/Store'

const Register = () => {
    const history = useHistory()
    const { AuthenticationStore } = useStore()
    const formik = useFormik<IRegister>({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            phoneNumber: ''
        },
        onSubmit: values => {
            AuthenticationStore.register()

        },
        validateOnChange: false,
        validate: values => {
            let errors: any = {}
            if (values.firstName.split(' ').join('') === '') {
                errors.firstName = 'Required'
            }
            if (values.lastName.split(' ').join('') === '') {
                errors.lastName = 'Required'
            }

          
            if (removeMask(values.phoneNumber).length < 10) {
                errors.phoneNumber = 'Invalid number'
            }
            if (!removeMask(values.phoneNumber)) {
                errors.phoneNumber = 'Required'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 8) {
                errors.password = 'Password must be 8 or more characters long'
            }


            return errors
        }

    })
    pageSetup({
        pageName: 'Register', backgroundImage: registerImage, backgroundColor: ` background: rgb(255, 255, 255);
    background: linear-gradient(56deg, rgba(255, 255, 255, 0.9864320728291317) 0%, rgba(238, 250, 249, 1) 35%, rgba(240, 209, 246, 1) 63%, rgba(196, 252, 248, 1) 100%);` })

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        
               
            <div style={{ padding: '10px', boxShadow: '0px 0px 5px 0px black', width: '500px', borderRadius: '3px', backdropFilter: 'blur(100px)' }}>
        

                <Text variant='xxLarge' style={{ fontWeight: 'normal' }}>Register</Text>

                <form onSubmit={formik.handleSubmit}  >
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-around' }}>
                        <TextField
                            name='firstName'
                            value={formik.values.firstName}
                            style={{ width: 240 }}
                         
                            label='First Name'
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.firstName}
                        />
                        <TextField
                            name='lastName'
                            value={formik.values.lastName}
                            style={{ width: 240 }}
       
                            label='Last Name'
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.lastName}
                        />
                    </div>
                    <TextField
                        name='email'
                        value={formik.values.email}
                        label='Email'
                     
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.email}
                    />
                    <MaskedTextField
                        mask="(999) 999 - 9999"
                        name='phoneNumber'
                        value={formik.values.phoneNumber}
                        label='Phone Number'
              
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.phoneNumber}
                    />

                    <TextField
                        name='password'
                        value={formik.values.password}
                        label='Password'
                        type='password'
                
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.password}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}  >
                        <PrimaryButton  type='submit' text='Submit' style={{ width: '40%' }} />
                    </div>

                    <ActionButton  style={{ width: '40%' }} iconProps={{ iconName: 'back' }} allowDisabledFocus onClick={() => history.push('/login')}>
                        Already have an account?
                    </ActionButton>
                </form>
                
                <button onClick={()=>{
                    //@ts-ignore
                    AuthenticationStore.register()}}>Admin Account</button>
            </div>
        </div>
    )
}
export default observer(Register)       