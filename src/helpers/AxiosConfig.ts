import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import global from '@/data/global';

class AxiosConfig {
  private static instance: AxiosConfig;

  public axios: AxiosInstance;

  private errorMessage = {
    serverDown: 'Probablemente tenemos inconvenientes con nuestro servidor o revise su conexion a internet.',
    authorization: 'No se pudo acceder al sistema',
  };

  private constructor() {
    // this.errorMessage = new Error();
    this.axios = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });

    // request header
    this.axios.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const configAux = config;

        const Authorization = (global?.auth?.authenticate ? `Bearer ${global?.auth?.token}` : '');

        configAux.headers = {
          'Content-Type': 'application/json',
        };
        if (Authorization) {
          configAux.headers.Authorization = Authorization;
        }
        return configAux;
      },

      (error: any) => ({
        status: -1,
        message: 'Error',
      }),
    );

    // response parse
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,

      (error: any) => {
        let errorObj = {};
        if (error.response && error.response.status && [401, 404].indexOf(error.response.status) > -1) {
          if (error.response.status === 401 && typeof global.logOut === 'function') {
            global.logOut();
          }
          window.location.href = `/error?code=${error.response.status}`;
        } else if (error.response && error.response.status && error.response.status >= 400
          && error.response.status < 500 && error.response.data && error.response.data.observations) {
          errorObj = {
            status: error.response.status,
            message: error.response.data.message,
            observations: error.response.data.observations,
          };
        } else if (error.request && error.request.status === 0) {
          window.location.href = `/error`;
        } else {
          errorObj = {
            status: error.response.status,
            message: 'Error inesperado',
            observations: [this.errorMessage.serverDown],
          };
        }
        return Promise.reject(errorObj);
      },
    );
  }

  public static getInstance(): AxiosConfig {
    if (!AxiosConfig.instance) {
      AxiosConfig.instance = new AxiosConfig();
    }

    return AxiosConfig.instance;
  }
}

export default AxiosConfig.getInstance().axios;
