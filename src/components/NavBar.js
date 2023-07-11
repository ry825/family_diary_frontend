import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { withCookies } from 'react-cookie';

const NavBar = (props) => {

    const Logout = () => {
        props.cookies.remove('jwt-token');
        window.location.href = '/'
    }

    return (
    
        <AppBar position='static'>
            <Toolbar color='primary'>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Diary
                </Typography>
                
                <Button color='inherit' onClick={()=>Logout()}>
                    <LogoutIcon/>
                </Button>
                
            </Toolbar>
        </AppBar>
    )
}

export default withCookies(NavBar)