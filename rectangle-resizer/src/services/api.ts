import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7221/api", // Replace with your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
