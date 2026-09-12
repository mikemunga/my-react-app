
import axiosInstance from "./axiosInstance";
import filteredRedirectUrl from "./routerGuard";
import { redirect } from "react-router";
import { queryClient } from "./Query";
import { useCartStore} from "./useCartStore";


export const LoginAction = async  ({request}) => {
const formData = await request.formData();
const data = Object.fromEntries(formData);

  try{
  const response = await axiosInstance.post('/auth/login', data,{skipGlobalErrorHandler:true});

  const user = response?.data?.data?.user
  
  if (user){
   queryClient.setQueryData(['authUser'], user);
   const fetchGlobalCart = useCartStore.getState().fetchGlobalCart;
    await fetchGlobalCart();
  }

   const targetDestination = filteredRedirectUrl(data.redirectTo) || '/';
   return redirect(targetDestination)
  

  }catch(error){
   return {
    succsess: false,
    error : error.response?.data?.message || 'Login Failed.',
    errors: error.response?.data?.errors || null,
   }
  }}
