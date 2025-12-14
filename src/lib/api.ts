import axios from "axios";

const api = axios.create({
  baseURL: "/api", // dev proxy 사용 권장
  withCredentials: true, // httpOnly 쿠키 자동 포함
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
