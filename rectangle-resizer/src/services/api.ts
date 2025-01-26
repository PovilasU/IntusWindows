import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000/api", // Replace with your backend's URL
  baseURL: "http://localhost:7221/api", // Replace with your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
