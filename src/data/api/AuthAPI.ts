import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';

class AuthAPI extends BaseApi {
  constructor() {
    super();
    this.url = '';
  }

  Auth = async (email: string, password: string): Promise<any> => {
    const response = await api.post<any>(`/login`, {
      username: email,
      password,
    });
    return (response && response.data) || null;
  };

  PasswordRecovery = async (email: string): Promise<any> => {
    const response = await api.post<any>(`/password-recovery`, {
      email,
    });
    return (response && response.data) || null;
  };

  ChangePassword = async (code: string, password: string, repeatPassword: string): Promise<any> => {
    const response = await api.post<any>(`/change-password`, {
      code,
      password,
      repeatPassword,
    });
    return (response && response.data) || null;
  };
}

export default new AuthAPI();
