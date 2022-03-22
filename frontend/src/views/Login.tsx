import {
    PrimaryButton, TextField, Text, ActionButton, MessageBar, MessageBarType, Checkbox
} from '@fluentui/react';
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom';
import { pageSetup } from '../domain/utils/pageSetup';
import loginImage from '../resources/images/Background_login.jpg'
import { useFormik } from 'formik'
import { ILoginModel } from '../domain/api/contracts/login';
import { useStore } from '../domain/stores/Store';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';






const Login = () => {
const [rememberMe, setRememberMe] = useState(false)

    const formik = useFormik<ILoginModel>({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: values => {
            AuthenticationStore.login(values,rememberMe);
        },
        validateOnChange: false,
        validateOnBlur: false,
        validate: values => {
            let errors: any = {

            }
            if (!values.email) {
                errors.email = 'Required'
            }
            if (!values.password) {
                errors.password = 'Required'
            }
            return errors;
        }
    });

    const history = useHistory()
    const { AuthenticationStore } = useStore()
    pageSetup({ pageName: 'Login', backgroundImage: loginImage })

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>

            <div style={{ padding: '10px', backgroundColor:isMobile?'rgba(255,255,255,.9)':'' , boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px', backdropFilter: 'blur(200px)', width: '500px', borderRadius: '5px' }}>

                <form onSubmit={formik.handleSubmit} noValidate>
                    <Text variant='xxLarge' style={{ color:isMobile?'black': 'white', fontWeight:  'normal' }}>Login</Text>
                    <TextField label="Email" name='email' errorMessage={formik.errors.email}
                        onChange={formik.handleChange}
                        value={formik.values.email} required />
                    <TextField
                        required
                        label="Password"
                        type="password"
                        name='password'
                        errorMessage={formik.errors.password}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"

                    />
                                 <br />
                      <Checkbox label='Remember me' onChange={(e)=>setRememberMe(!rememberMe)}/>
                    <br />
                    {
                        AuthenticationStore.errored ? (
                            <MessageBar messageBarType={MessageBarType.blocked}
                                truncated={true}>
                                {AuthenticationStore.message}
                            </MessageBar>
                        ) : ''

                    }


                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}  >
                        <PrimaryButton type='submit' text='Login' style={{ width: '40%' }} />
                        
                    </div>

                </form>
            </div>


        </div>
    )
}


export default observer(Login);
