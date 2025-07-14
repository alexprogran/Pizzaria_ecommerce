import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Configuração da requisição:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
    });
    
    return config;
}); 

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Erro na requisição:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        return Promise.reject(error);
    }
); 