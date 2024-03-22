import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
    Link
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {
    Form,
    required,
    TextInput,
    useTranslate,
    useLogin,
    useNotify,
    PasswordInput,
    useRedirect
} from 'react-admin';

import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import {getBackground} from './Login'
import { AuthUI } from './AuthUI';


const CreateProfile = () =>  {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const redirect = useRedirect();


    const queryParams = new URLSearchParams(useLocation().search)
    const email = queryParams.get("email")
    const invitationToken = queryParams.get("invitationToken")


    const handleSubmit = (form: FormValues) => {

        const {password} = form
        
        fetch('http://localhost:8181/createprofile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                invitationToken
            }),
        })
        .then(response => response.json()) // Parsing the JSON response
        .then(data => {
            if (data.message === "password set") {
                redirect(`/signin`);
            }

        })   // Handling the data from the response
        .catch(error => console.error('Error:', error)); // Handling errors
    };

    const equalToPassword = (value, allValues) => {
        if (value !== allValues.password) {
            return 'The two passwords must match';
        }
    }

    if (!invitationToken || !email) {
        return (
            <AuthUI
                headerIcon={<ErrorOutlineIcon />}
                headerText={translate('signup.error')}
            />              
        )
    }

    return (
        <AuthUI 
            handleSubmit={handleSubmit}
            headerIcon={<PersonAddIcon />}
            headerText={translate('signup.createProfileHeader')}
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
                        <Box>
                    
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
                            {translate('signup.createProfileButton')}
                        </Button>
                    </Box>   
                    <Box sx={{ marginTop: '1em' }}>
                        <Link href="#/login">{translate('signup.signinLink')}</Link>
                    </Box>                                   
        </AuthUI>

    );
}

export default CreateProfile