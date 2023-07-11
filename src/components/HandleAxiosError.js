import {useEffect} from 'react'
import { withCookies } from 'react-cookie';
import axios, {AxiosError} from 'axios';


export const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

const HandleApiError = (props) => {
    useEffect(() => {
        const responseInterceptor = axiosClient.interceptors.response.use(
            (response) => {
                return response;
            },
            (error: AxiosError) => {
                if(error.response && error.response.status === 401) {
                    props.cookies.remove('jwt-token');
                    window.location.href = '/'
                }
                return Promise.reject(error);
            } 
        );
        return () => {
            axiosClient.interceptors.response.eject(responseInterceptor);
        };
    },[])

}

export default withCookies(HandleApiError)