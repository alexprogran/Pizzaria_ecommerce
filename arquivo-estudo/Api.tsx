
// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ou URL do seu backend real
});

export default api;

