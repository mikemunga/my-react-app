import { redirect } from "react-router";
import axiosInstance from "./axiosInstance";
 export const checkoutAction = async ({ request }) => {
    const formData = await request.formData();
    const rawPhone = formData.get("phone");
    const totalAmount = formData.get("amount");

    let formattedPhone = rawPhone.replace(/[^0-9]/g, '');

    if(formattedPhone.startsWith('0')) {
        formattedPhone ="254" + formattedPhone.subString(1);
    } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")){
        formattedPhone ="254" + formattedPhone
    }

    try {
        const response = await axiosInstance.get('/checkout', {
            phone: formattedPhone,
            amount: totalAmount
        })
        if(response.data.MechantRequestID) {
            return redirect(`/checkout/status?id=${response?.data?.MechantRequestID}`)
        }
        return{error: "Failed to initiate M-Pesa  prompt. Please try again."}
    } catch (error) {
        console.log("Action pipeline failed", error);
        return { error: error.response?.data?.message || "Server connection error."}
    }
 }

