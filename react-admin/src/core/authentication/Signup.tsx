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
import EmailIcon from '@mui/icons-material/Email';
import {httpApiUrl} from '../../config'
import { AuthUI } from './AuthUI';

const Signup = () =>  {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();

    const handleSubmit = async ({email}) => {


        try {
            const response = await fetch(`${httpApiUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            })

            if (response.status === 409) {
                notify(
                    translate('signup.userExistsError'),
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        },
                        type: "error",
                        autoHideDuration: 5000
                    }

                )
            } 
            
            if (response.status === 200) {   
                notify(
                    translate('signup.notification'),
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        }
                    }
                )            
            }

            if (response.status === 500) {   
                notify(
                    translate('signup.serverError'),
                    { 
                        anchorOrigin:{ 
                            vertical: 'top', 
                            horizontal: 'center' 
                        },
                        type: "error",
                        autoHideDuration: 5000
                    }
                )            
            }


        } catch (e) {
            console.log(e)
        }

        //.catch(error => console.error('Error:', error)); // Handling errors
    };

    return (    
        <AuthUI 
            handleSubmit={handleSubmit}
            headerIcon={<EmailIcon />}
            headerText={translate('signup.header')}
        >
            <Box sx={{ marginTop: '1em' }}>
                <TextInput
                    autoFocus
                    source="email"
                    label={translate('login.email')}
                    disabled={loading}
                    fullWidth
                    variant="outlined"
                    validate={required()}
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
                    {translate('signup.send')}
                </Button>
            </Box>   
            
            <Box sx={{ marginTop: '1em' }}>
                <Link href="#/login">{translate('signup.signinLink')}</Link>
            </Box>
        </AuthUI>                       
    );
}

export default Signup