import axios, {
    AxiosError,
    AxiosResponse,
    HttpStatusCode,
    InternalAxiosRequestConfig,
} from "axios";

// import AuthService from "@/features/auth/apis/service";

const LOCAL_STORAGE = {
    ACCESS_TOKEN: "access_token",
} as const;

export const client = (() => {
    return axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/v1`, //TODO: Sửa port thành 5000 or 8000
        headers: {
            Accept: "application/json",
            toJSON: true,
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
        config.headers["Content-Type"] = "application/json";
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

        if (status === HttpStatusCode.Unauthorized && retryCount < 3) {
            retryCount++;
            try {
                const accessToken = "";
                // const accessTokenFromStorage = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
                // TODO: Refresh token here
                // localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessTokenFromStorage);
                // await AuthService.refresh();
                client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                return await client(originalConfig);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    },
);

export const AxiosMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    OPTIONS: "OPTIONS",
    PATCH: "PATCH",
};
