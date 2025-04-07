import { client } from "@/configs/axios.config";
import { ApiResponse, BaseResponse, RequestError } from "@/types/api-response";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

async function axiosRequest<T = unknown>(options: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const onSuccess = (response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
        return response.data;
    };

    const onError = (error: AxiosError<BaseResponse>): never => {
        const errorResponse: RequestError = {
            message: error.response?.data?.message || error.message || "An unknown error occurred",
            code: error.code,
            statusCode: error.response?.status,
            response: error.response?.data,
        };

        if (process.env.NODE_ENV !== "production") {
            console.error("[API Request Error]:", errorResponse);
        }

        throw errorResponse;
    };

    try {
        const response = await client(options);
        return onSuccess(response);
    } catch (error) {
        return onError(error as AxiosError<BaseResponse>);
    }
}

export default axiosRequest;
