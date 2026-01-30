import api from '../utils/api';

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  
  register: (data: any) => 
    api.post('/auth/register', data),
  
  adminLogin: (data: { email: string; password: string }) => 
    api.post('/admin/login', data),
};