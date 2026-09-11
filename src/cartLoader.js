import axiosInstance from "./axiosInstance";

export async function cartLoader ({request}){
    const url = new URL(request.url);
    
    const redirectTo = url.searchParams.get('redirectTo') || ''
    try{
        const response = await axiosInstance.get('/cart');
        return {
            items: response.data,
            redirectTo: redirectTo
        }
    }catch(error){
        return {
            items: [],
            redirectTo :redirectTo
        }
    }
}
