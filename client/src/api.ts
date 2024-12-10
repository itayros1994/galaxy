import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001", // Ensure this matches the server's port
});

export const fetchMeteors = (params: any) => API.get("/meteors", { params });
export const fetchYears = () => API.get("/years");
