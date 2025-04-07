import { HttpStatusCode } from "axios";

export interface BaseResponse {
    success: boolean;
    statusCode: HttpStatusCode;
    message: string;
}

export interface ApiResponse<T> extends BaseResponse {
    data: T;
}

export interface RequestError {
    message: string;
    code?: string;
    statusCode?: HttpStatusCode;
    response?: unknown;
}
