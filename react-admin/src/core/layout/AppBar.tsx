import React from 'react'

import { 
    UserMenu, 
    Logout, 
    AppBar,
    useUserMenu,
    useTranslate
} from 'react-admin';

import {useNavigate} from 'react-router-dom'

import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export const CustomAppBar = () => (
    <AppBar 
        color="primary"
        userMenu={
            <UserMenu>
                <EditUserProfile />
                <Logout />
            </UserMenu>
        }
    >
    </AppBar>
)

// pass the ref to allow Material UI to manage the keyboard navigation
const EditUserProfile = React.forwardRef((props, ref) => {
    const { onClose } = useUserMenu();
    const navigate = useNavigate();
    const t = useTranslate();


    return (
        <MenuItem
            onClick={() => {
                onClose()
                navigate("/user");
            }}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
        >
            <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('appBar.userMenu.editUserProfile')}</ListItemText>
        </MenuItem>
    );
});
