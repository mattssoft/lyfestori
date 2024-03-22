import { useState } from 'react';
import {
    Button,
    CircularProgress,
    Link
} from '@mui/material';
import {
    required,
    TextInput,
    useTranslate,
    useNotify,
} from 'react-admin';
import Box from '@mui/material/Box';
import LockResetIcon from '@mui/icons-material/LockReset';
import {httpApiUrl} from '../../config'
import { AuthUI } from './AuthUI';

const ResetPasswordRequest = () =>  {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const notify = useNotify();

    const handleSubmit = (auth: FormValues) => {
        
        notify(translate('pwreset.resetNotification'))

        fetch(`${httpApiUrl}/resetpasswordrequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailAddress: auth.email
            }),
        })
        .catch(error => console.error('Error:', error)); // Handling errors
    };

    return (
        <AuthUI 
        handleSubmit={handleSubmit}
        headerIcon={<LockResetIcon />}
        headerText={translate('pwreset.requestHeader')}
        >           
            <Box sx={{ marginTop: '1em' }}>
                <TextInput
                    autoFocus
                    source="email"
                    label={translate('login.email')}
                    disabled={loading}
                    validate={required()}
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
                    {translate("pwreset.requestButton")}
                </Button>
            </Box>   
            <Box sx={{ marginTop: '1em' }}>
                <Link href="#/login">{translate('signup.signinLink')}</Link>
            </Box>                                   
        </AuthUI>
    );
}

export default ResetPasswordRequest