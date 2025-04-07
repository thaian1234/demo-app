export interface BaseResponse {
    success: boolean;
    statusCode: number;
    message: string;
}

export interface ApiResponse<T> extends BaseResponse {
    data: T;
}

export interface RequestError {
    message: string;
    code?: string;
    statusCode?: number;
    response?: unknown;
}
