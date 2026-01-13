import api from "./jwt";
import type { LoginData, RegisterData, VerifyData } from "../user/auth.types";

export const userServices = {
    register: (data: RegisterData) => api.post('/api/auth/register', data),
    login: (data: LoginData) => api.post('/api/auth/login', data),
    verify: (data: VerifyData) => api.post('/api/auth/verify', data),
    userDetails: (email: FormData) => api.post('/api/auth/getUserDetails', email),
    //resend: (email: string) => api.post('/api/auth/resend'),
    validate:() => api.get("/api/auth/validate") //Do czego to??
};