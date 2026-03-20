import { AxiosResponse } from "axios";
import { APIResponse } from "../models/APIRespsonse";
import request from "../utils/baseURL";
import { Transaction } from "../models/transactionModel";


export const getTransactionByUserId = async (id: number): Promise<APIResponse<Transaction[]>> => {
    try {
        const response: AxiosResponse<APIResponse<Transaction[]>> = await request.get(`transactions/user/${id}`);
        return response.data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Lỗi khi lấy giao dich",
            data: []
        };
    }
}
export const getTransaction = async () => {
    try {
        const response: AxiosResponse<APIResponse<Transaction>> = await request.get("transactions")
        if (response.data.success) {
            return response.data;
        }
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Lỗi khi lấy sản phẩm",
            data: []
        };
    }
}


export const addTransaction = async (
    transactionRequest: Transaction
)  => {
    try {
        const response: AxiosResponse<APIResponse<Transaction>> = await request.post(
            "transactions",
            transactionRequest
        )
        return response.data;
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deleteTransaction = async (id: number) => {
    try {
        const response: AxiosResponse<APIResponse<Transaction>> = await request.delete(`transactions/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

type UpdateTransactionRequest = Omit<Transaction, "userId"> // backend might infer user or keep it

export const updateTransaction = async (
    id: number,
    transactionRequest: UpdateTransactionRequest
) => {
    try {
        const response: AxiosResponse<APIResponse<Transaction>> = await request.put(
            `transactions/${id}`,
            transactionRequest
        )
        console.log(transactionRequest);
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

