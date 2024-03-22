import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Box,
    CircularProgress,
    Link
} from '@mui/material';
import {
    required,
    TextInput,
    useTranslate,
    useLogin,
    useNotify,
} from 'react-admin';
import {AuthUI} from './AuthUI'
import LockIcon from '@mui/icons-material/Lock';



const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const notify = useNotify();
    const login = useLogin();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(
            auth,
            '/'
        ).catch((error: Error) => {
            setLoading(false);
            notify(
                typeof error === 'string'
                    ? error
                    : typeof error === 'undefined' || !error.message
                    ? 'ra.auth.sign_in_error'
                    : error.message,
                {
                    type: 'error',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
        });
    };

    return (
        <AuthUI 
            handleSubmit={handleSubmit}
            headerIcon={<LockIcon />}
            headerText={translate('login.header')}
        >
            <>
                <Box sx={{ marginTop: '1em' }}>
                    <TextInput
                        autoFocus
                        source="username"
                        label={translate('login.email')}
                        disabled={loading}
                        validate={required()}
                        fullWidth
                        variant="outlined"
                    />
                </Box>
                <Box sx={{ marginTop: '1em' }}>
                    <TextInput
                        source="password"
                        label={translate('login.password')}
                        type="password"
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
                        {translate('login.logIn')}
                    </Button>
                </Box>

                <Box sx={{ marginTop: '1em' }}>
                    <Link href="#/signup">{translate('login.register')}</Link>
                </Box>

                <Box sx={{ marginTop: '1em' }}>
                    <Link href="#/resetpasswordrequest">{translate('login.forgotPassword')}</Link>
                </Box>     
          
            </>
        </AuthUI>
    )
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
    username?: string;
    password?: string;
}
