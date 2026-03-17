import { AxiosResponse } from "axios";
import { APIResponse } from "../models/APIRespsonse";
import request from "../utils/baseURL";
import { Transaction } from "../models/transactionModel";


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

type CreateTransactionRequest = Omit<Transaction, "transactionId">

export const addTransaction = async (
    categoryRequest: CreateTransactionRequest
): Promise<Transaction | null> => {
    try {
        const response: AxiosResponse<Transaction> = await request.post(
            "categories",
            categoryRequest
        )
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}


export const deleteTransaction = async (id: number) => {
    try {
        const response: AxiosResponse<Transaction> = await request.delete(`transactions/${id}`);
        console.log(response.data);
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
): Promise<Transaction | null> => {
    try {
        const response: AxiosResponse<Transaction> = await request.put(
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