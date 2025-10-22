import axios from "axios";
const BASE_URL = "http://localhost:8080/auth";


export const userService = {

    async register(name: string, email: string, password: string) {

        try {
            const response = await axios.post(
                BASE_URL + "/register",
                {
                    name,
                    email,
                    password
                }
            );
            return {
                success: true,
                data: response.data,
                message: response.data.message,
                status: response.status,
            };

        } catch (error: any) {
            return {
                success: false,
                data: error.response?.data || "Erro desconhecido ao cadastrar",
                status: error.response?.status || 500,
            };
        }

    },

    async login(email: string, password: string) {

        try {
            const response = await axios.post(
                BASE_URL + "/login",
                { email, password },
                { withCredentials: true }
            );
            console.log("Login bem-sucedido:", response.data);
            return response.data
        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    },

    async logout() {

        try {
            const response = await axios.post(
                BASE_URL + "/logout",
                {},
                { withCredentials: true }
            );
            return response

        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    },

    async validate() {
        try {
            const response = await axios.get(BASE_URL + "/validate", {
                withCredentials: true,
            });
            return response;
        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    }

}