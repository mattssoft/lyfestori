import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Button,
    CircularProgress,
    Box
} from '@mui/material';
import {
    required,
    useTranslate,
    useNotify,
    PasswordInput,
    useRedirect
} from 'react-admin';
import LockResetIcon from '@mui/icons-material/LockReset';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {httpApiUrl} from '../../config'
import { AuthUI } from './AuthUI';

const ResetPasswordAction = () =>  {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const redirect = useRedirect();
    const notify = useNotify();
    const queryParams = new URLSearchParams(useLocation().search)
    const email = queryParams.get("email")
    const resetToken = queryParams.get("resetToken")

    const handleSubmit = async (form: FormValues) => {

        const {password} = form
        
        try {
            const response = await fetch(`${httpApiUrl}/pra`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    resetToken
                }),
            })          
            
            if (response.status === 200) {

                notify(
                    "Password reset succesful. Please login using your new password.",
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        },
                        autoHideDuration: 5000
                    }
                )

                setTimeout( () => redirect(`/signin`), 3000);

            }

            if (response.status === 418) {

                notify(
                    "There was an error handling your request. Please try again by requesting a new password reset email.",
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        },
                        autoHideDuration: 2000,
                        type: "error"
    
                    }
                )  
            }            

            if (response.status === 400) {
                const responseText = await response.text()
                notify(
                    responseText,
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        },
                        autoHideDuration: 2000,
                        type: "error"
    
                    }
                )  
            }            
        } catch (e) {
            console.log(e)
        }
    
    };

    const equalToPassword = (value, allValues) => {
        if (value !== allValues.password) {
            return 'The two passwords must match';
        }
    }

    if (!resetToken || !email) {
        return (
            <AuthUI
                headerIcon={<ErrorOutlineIcon />}
                headerText={translate('pwreset.errorUIHeader')}
            />            
        )
    }

    return (

        <AuthUI
            handleSubmit={handleSubmit}
            headerIcon={<LockResetIcon />}
            headerText={translate('pwreset.resetHeader')}
        >
            <Box>
                {translate('pwreset.instruction1')}
            </Box>
            <Box>
                {translate('pwreset.instruction2')}
            </Box>
            <Box>
                {translate('pwreset.instruction3')}
            </Box>
            <Box>
                {translate('pwreset.instruction4')}
            </Box>
            <Box sx={{ marginTop: '1em' }}>
                <PasswordInput
                    autoFocus
                    source="password"
                    label={translate('login.password')}
                    disabled={loading}
                    validate={required()}
                    fullWidth
                    variant="outlined"
                />
            </Box>
            <Box>
                <PasswordInput
                    autoFocus
                    source="verifyPassword"
                    label={translate('pwreset.verifyPassword')}
                    disabled={loading}
                    validate={equalToPassword}
                    fullWidth
                    variant="outlined"
                />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={loading}
                    fullWidth
                >
                    {loading && (
                        <CircularProgress size={25} thickness={2} />
                    )}
                    {translate('pwreset.saveNewPassword')}
                </Button>
            </Box>   
        </AuthUI>
    );
}

export default ResetPasswordAction