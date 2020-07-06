import axios from 'axios';
import { host, port } from './../config/globals'

export function getFarms(farmerId) {
    const base = `${host}:${port}`
    return axios.get(`${base}/farmer/${farmerId}/farm`)
}


export function createFarm(farmData) {
    const base = `${host}:${port}`
    return axios.post(`${base}/farm`, farmData)
}
