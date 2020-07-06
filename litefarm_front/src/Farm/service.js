import axios from 'axios';
import { host, port } from './../config/globals'

export function createField(fieldData) {
    const base = `${host}:${port}`;
    return axios.post(`${base}/field`, fieldData)
}

export function getFields(farmId) {
    const base = `${host}:${port}`;
    return axios.get(`${base}/farm/${farmId}/fields`)
}