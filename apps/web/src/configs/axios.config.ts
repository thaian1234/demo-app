import axios, {
    AxiosError,
    AxiosResponse,
    HttpStatusCode,
    InternalAxiosRequestConfig,
} from "axios";

// import AuthService from "@/features/auth/apis/service";

export const LOCAL_STORAGE = {
    ACCESS_TOKEN: "access_token",
} as const;

export const client = (() => {
    return axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        timeout: 10000,
        withCredentials: true,
    });
})();

client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

let retryCount = 0;

client.interceptors.response.use(
    (res: AxiosResponse) => {
        return res;
    },
    async err => {
        const originalConfig = err.config;
        const status = err.response ? err.response.status : null;

        if (status === HttpStatusCode.Unauthorized && retryCount < 1) {
            retryCount++;
            try {
                const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
                if (!accessToken) {
                    return Promise.reject(err);
                }
                client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                return await client(originalConfig);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    },
);
