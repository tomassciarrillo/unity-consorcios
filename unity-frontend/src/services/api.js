import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unity_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('No se pudo conectar con el servidor. Verificá tu conexión.', {
        id: 'network-error',
      });
    } else {
      const { status } = error.response;

      if (status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, ingresá nuevamente.');
        console.warn('Sesión expirada. Limpiando datos...');
        localStorage.clear();
      } 
      
      else if (status === 500) {
        toast.error('Ocurrió un error interno en el servidor.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;


/*
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unity_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada. Limpiando datos...');
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;

*/