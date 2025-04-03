import { SERVERL_BASE_URL } from "@/config";
import axios from "axios";

const api = axios.create({
  baseURL: SERVERL_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
