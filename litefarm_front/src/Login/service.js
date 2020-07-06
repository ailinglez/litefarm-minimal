import axios from 'axios';
import { host, port } from './../config/globals'

export function signup(signupData) {
    const base = `${host}:${port}`
    return axios.post(`${base}/farmer`, signupData)
}

export function login(loginData) {
    const base = `${host}:${port}`
    return axios.post(`${base}/farmer/login`, loginData)
        .then(({data}) => {
            localStorage.setItem('bearer_token', data.token);
            setDefaultHeaders('Bearer ' + data.token)
            return ;
        })
}

export function setDefaultHeaders(token) {
    axios.defaults.headers.common['Authorization'] = token;
}