import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "/api/",
  timeout: 5000,
  headers: {
    "x-auth-token": localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
});

export const registerInstance = axios.create({
  baseURL: "/api/",
  timeout: 5000,
  headers: {
    "x-auth-token": null,
    "Content-Type": "application/json",
  },
});
