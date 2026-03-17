import { AxiosResponse } from "axios";
import { APIResponse } from "../models/APIRespsonse";
import request from "../utils/baseURL";
import { Category } from "../models/categoryModel";

type CreateCategoryRequest = Omit<Category, "categoryId">
type UpdateCategoryRequest = Omit<Category, "userId"> // backend might infer user or keep it

export const getCategory = async (id: number): Promise<APIResponse<Category[]>> => {
    try {
        const response: AxiosResponse<APIResponse<Category[]>> = await request.get(`categories/user/${id}`);
        return response.data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Lỗi khi lấy sản phẩm",
            data: []
        };
    }
}


export const addCategory = async (
    categoryRequest: CreateCategoryRequest
) => {
    try {
        const response: AxiosResponse<APIResponse<Category>> = await request.post(
            "categories",
            categoryRequest
        )
        return response.data;
    } catch (error) {
        console.log(error)
        return null
    }
}


export const deleteCategory = async (id: number) => {
    try {
        const response: AxiosResponse<APIResponse<Category>> = await request.delete(`categories/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export const updateCategory = async (
    id: number,
    categoryRequest: UpdateCategoryRequest
) => {
    try {
        const response: AxiosResponse<APIResponse<Category>> = await request.put(
            `categories/${id}`,
            categoryRequest
        )
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}