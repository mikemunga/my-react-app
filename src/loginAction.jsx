
import axiosInstance from "./axiosInstance";
import filteredRedirectUrl from "./routerGuard";
import { redirect } from "react-router";
import { queryClient } from "./Query";


export const LoginAction = async  ({request}) => {
const formData = await request.formData();
const data = Object.fromEntries(formData);

  try{
  const response = await axiosInstance.post('/auth/login', data);

  const user = response?.data?.data?.user
  
  if (user){
   queryClient.setQueryData(['authUser'], user);

  }

   const targetDestination = filteredRedirectUrl(data.redirectTo) || '/';
   return redirect(targetDestination)
  

  }catch(error){
   return {
    succsess: false,
    error : error.response?.data?.message || 'Login Failed.'
   }
  }}
