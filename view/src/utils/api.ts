import axios from "axios";

const BASE_URL = "http://localhost:8000";

export async function post(url: string, payload: string) {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
  }
}

export async function get(url: string) {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na requisição:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
  }
}
