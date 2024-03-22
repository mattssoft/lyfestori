/*

    Reusale UI wrapper / helper component for auth pages that adds some basic styling and a locales dropdown

*/

import {
    Avatar,
    Box,
    Card,
} from '@mui/material';
import { Form } from 'react-admin';
import { styles } from './styles'
import {LocalesMenuButton} from 'react-admin'

export const AuthUI = ({handleSubmit, headerIcon, headerText, children}) => {

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box sx={styles.mainBox}>
                <Card sx={styles.mainCard}>

                    {/* LOCALES */}
                    <Box sx={styles.localesBox}>
                        <LocalesMenuButton/>
                    </Box>

                    {/* HEADER */}
                    <Box sx={styles.boxCenteredContent}>
                        <Avatar sx={styles.graphiteAvatar}>
                            {headerIcon}
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                           ...styles.boxCenteredContent,
                            color: theme => theme.palette.grey[700],
                        }}
                    >
                        {headerText}
                    </Box>
                    
                    {/* CHILDREN */}
                    <Box sx={{ padding: '0em 2em 2em 2em' }}>
                        {children}
                    </Box>

                </Card>
            </Box>
        </Form>
    );    

}

