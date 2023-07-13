import React, {useReducer, useContext} from 'react';
import { withCookies } from 'react-cookie';
import Button from '@mui/material/Button';
import axios from 'axios'
import LockIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { START_FETCH, FETCH_SUCCESS, ERROR_CATCHED, INPUT_EDIT, TOGGLE_MODE } from './actionTypes'

const url = process.env.REACT_APP_URL || 'http://127.0.0.1:8000'

const initialState = {
    isLoading: false,
    isLoginView: true,
    error: '',
    credentialsLog: {
        email: '',
        password: ''
    },
};

const loginReducer = (state, action) => {
    switch(action.type){
        case START_FETCH: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case FETCH_SUCCESS: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case ERROR_CATCHED: {
            return {
                ...state,
                error: 'Email or password is not correct',
                isLoading: false,
            };
        }
        case INPUT_EDIT: {
            return {
                ...state,
                [action.inputName]: action.payload,
                error: '',
            };
        }
        case TOGGLE_MODE: {
            return {
                ...state,
                isLoginView: !state.isLoginView,
            };
        }
        default:
            return state;
    }
}

const Login = (props) => {
    const [state, dispatch] = useReducer(loginReducer, initialState);

    const inputChangedLog = () => event => {
        const cred = state.credentialsLog;
        cred[event.target.name] = event.target.value;
        dispatch({
            type: INPUT_EDIT,
            inputName: 'state.credentialLog',
            payload: cred,
        })
    }

    const login = async(event) => {
        event.preventDefault()
        if(state.isLoginView) {
            try {
                dispatch({type: START_FETCH})
                const res = await axios.post(`${url}/authen/jwt/create`, state.credentialsLog ,{
                headers: {'Content-Type': 'application/json'}})
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = '/sns' : window.location.href = '/';
                dispatch({ type: FETCH_SUCCESS})
            } catch {
                dispatch({ type: ERROR_CATCHED});
            }
        } else {
            try {
                dispatch({type: START_FETCH})
                const res = await axios.post(`${url}/api/user/create/`, state.credentialsLog ,{
                headers: {'Content-Type': 'application/json'}})
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = '/sns' : window.location.href = '/';
                dispatch({ type: FETCH_SUCCESS})
            } catch {
                dispatch({ type: ERROR_CATCHED});
            }
        }
    }
    const toggleView = () => {
        dispatch({type: TOGGLE_MODE})
    }

  return (
    <Container maxWidth='xs'>
        <form onSubmit={login}>
            <div className='paper'>
                {state.isLoading && <CircularProgress/>}
                <Avatar className='avatar'>
                    <LockIcon />
                </Avatar>
                <Typography variant='h5'>
                    {state.isLoginView ? 'Login' : 'Register'}
                </Typography>

                <TextField
                    variant='outlined' margin='normal'
                    fullWidth label = 'Email'
                    name='email'
                    value={state.credentialsLog.email}
                    onChange={inputChangedLog()}
                    autoFocus/>

                <TextField
                    variant='outlined' margin='normal'
                    fullWidth
                    name='password'
                    value={state.credentialsLog.password}
                    onChange={inputChangedLog()}
                    label='Password'
                    type='password'/>
                
                <span className='spanError'>{state.error}</span>

                { state.isLoginView
                    ?
                        !state.credentialsLog.password || !state.credentialsLog.email ?
                        <Button className='loginSubmit' type='submit' fullWidth disabled
                            variant='contained' color='primary'>Login</Button>
                        : <Button className='loginSubmit' type='submit' fullWidth
                            variant='contained' color='primary'>Login</Button>
                    :
                        !state.credentialsLog.password || !state.credentialsLog.email ?
                        <Button className='loginSubmit' type='submit' fullWidth disabled
                            variant='contained' color='primary'>Register</Button>
                        : <Button className='loginSubmit' type='submit' fullWidth
                            variant='contained' color='primary'>Register</Button>}

                <span onClick={()=>toggleView()} className='loginSpan'>
                    {state.isLoginView ? 'Create Account' : 'Back to login'}
                </span>

            </div>
        </form>

    </Container>
  )
}

export default withCookies(Login)