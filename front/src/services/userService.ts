import axios from "axios";
const BASE_URL = "http://localhost:8080/auth";


export const userService = {

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

    async validate() {
        try {
            const response = await axios.get("http://localhost:8080/auth/validate", {
                withCredentials: true,
            });
            return response;
        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    }

}