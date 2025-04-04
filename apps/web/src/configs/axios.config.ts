import axios, {
    AxiosError,
    AxiosResponse,
    HttpStatusCode,
    InternalAxiosRequestConfig,
} from "axios";
// import Cookies from "js-cookie";

// import AuthService from "@/features/auth/apis/service";

// const COOKIES_STORAGE = {
//     ACCESS_TOKEN: "access_token",
//     REFRESH_TOKEN: "refresh_token",
// } as const;

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
        return res; // Simply return the response
    },
    async err => {
        const originalConfig = err.config;
        const status = err.response ? err.response.status : null;

        if (status === HttpStatusCode.Unauthorized && retryCount < 3) {
            retryCount++;
            try {
                // await AuthService.refresh();
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
