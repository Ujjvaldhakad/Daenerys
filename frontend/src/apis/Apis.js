import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:9000/api",
    withCredentials: true,
})

export const registerUser = (userData) => API.post("/user/register", userData);
export const loginUser = (userData) => API.post("/user/login", userData);