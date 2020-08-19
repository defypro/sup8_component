import axios, {AxiosRequestConfig} from "axios";
import config from "../config";
import qs from "qs";
import {message} from "antd";

const _axios = axios.create({
    baseURL: config.apiURL,
});
setAuthorization();

_axios.interceptors.request.use(
    config => {
        // config.transformRequest = [
        //     function (data) {
        //         if (data)
        //             return qs.stringify(data)
        //     }
        // ];
        // // config.withCredentials = true;
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

_axios.interceptors.response.use(
    response => {
        console.log('%c Request Success:', 'color: #4CAF50; font-weight: bold', response);
        return response
    },
    error => {
        console.log('%c Request Error:', 'color: #EC6060; font-weight: bold', error.response);
        if (!error['response']) {
            return Promise.reject(error)
        }
        switch (error.response.status) {
            case 403:
                window.location.href = '/';
                break;
            case 401:
                window.location.href = '/login';
                break;
            case 422:
                message.error(error.response.data.errors);
                break;
            case 412:
                window.location.href = '/login';
                break;
        }
        return Promise.reject(error.response);
    }
);


export interface IAPIResponse<T = any> {
    result: T,
    success: boolean,
    error: any
}

export interface IAPIPromise<T = any> extends Promise<IAPIResponse<T>> {
}

export interface IParams {
    isQuery?: boolean | object,

    [key: string]: any
}

export function POST<T = any>(path: string, params?: IParams): IAPIPromise<T> {
    if (params && params.isQuery === true) {
        const {isQuery} = params;
        let query = '';
        const paramsTemp = typeof isQuery === 'boolean' ? params : isQuery;
        Object.keys(paramsTemp).forEach(function (key) {
            if (key !== 'isQuery') {
                query += key + '=' + paramsTemp[key] + '&';
            }
        });
        if (query.length > 0) {
            query = '?' + query.substr(0, query.length - 1);
        }
        path += query;
    }
    return new Promise((resolve, reject) => {
        _axios({
            url: path,
            method: 'POST',
            data: params
        }).then(({data}) => {
            resolve({
                result: data.result,
                error: data.error,
                success: data.success
            });
        }).catch(e => {
            reject(e);
        });
    });
}

export function GET<T = any>(path: string, params?: IParams, options?: AxiosRequestConfig): IAPIPromise<T> {
    return new Promise((resolve, reject) => {
        _axios({
            url: path,
            method: 'GET',
            params,
            ...options
        }).then(({data}) => {
            resolve({
                result: data.result || data,
                error: data.error,
                success: data.success
            });
        }).catch(e => {
            reject(e);
        });
    });
}

export function setAuthorization(authorization = '') {
    // if (!authorization) authorization = auth.token();
    // _axios.defaults.headers.common.Authorization = `Bearer ${authorization}`;
    // auth.login(authorization);
}