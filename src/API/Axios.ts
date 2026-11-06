import axios, { HttpStatusCode } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

type refreshTokenResponseType = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token: string | null = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};


 api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; 
      isRefreshing = true;
 
      try {
        const response = await api.post<refreshTokenResponseType>(
          "/api/Authentication/refreshtoken"
        );

        if (response.status === HttpStatusCode.Ok) {
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (axios.isAxiosError(refreshError) && refreshError.response) {
          const responseData: refreshTokenResponseType =
            refreshError.response.data;

          if (
            refreshError.response.status === HttpStatusCode.BadRequest 
          ) {
            const msg = responseData.message;

            if (msg === "Please login in order to get the tokens.") {
              window.location.href="/login";
            } else if (msg === "Please verify your email first.") {
              window.location.href="/error";
            } else if (msg === "Your account has been disabled.") {
              window.location.href=`/error?errorCode=503&message=${encodeURIComponent(msg)}`
            } else if (msg === "Sign up to access the services.") {
              window.location.href="/signup";
            }
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
