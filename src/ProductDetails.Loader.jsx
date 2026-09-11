import axiosInstance from "./axiosInstance";
export async function productDetailsLoader ({params}) {
    try {
        const response = await axiosInstance.get(`/item/${params.id}`);
        return response.data;
    }catch (error){
        console.log(error.message);
        return null;
    }
}
