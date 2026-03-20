import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost/lunaria-backend/api/",
    withCredentials: true
});

export default API;