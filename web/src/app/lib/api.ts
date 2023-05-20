import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.129.28.183:3333",
});
