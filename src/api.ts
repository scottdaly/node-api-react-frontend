import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // adjust this to your API URL
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  name: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
    name,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const getUserInfo = async () => {
  const response = await api.get("/api/user");
  return response.data;
};

export default api;
