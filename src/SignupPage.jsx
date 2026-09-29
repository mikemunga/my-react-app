
import {Form ,Link, useActionData, useNavigation} from 'react-router';
import axiosInstance from './axiosInstance';
import { queryClient } from './Query';





export const SignupAction =  async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData); 
  try{
  const response= await axiosInstance.post('/auth/signup', data,{skipGlobalErrorHandler:true});

    
  if (response.data?.data?.user)
    queryClient.setQueryData(['authUser'], response.data.data.user);
  return {success: true}
   
  }catch(error){
    return {
    success:false,
    error : error.response?.data?.message || 'Regestration faild. Please try again.',
    errors: error.response?.data?.errors || null,
    }
  }
}
 

export default function SignupPage() {
  const actionData = useActionData();  
  const navigation = useNavigation(); 
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      

      <div className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl border border-gray-100 transition-all sm:p-10">
        
  
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to unlock your personal dashboard
          </p>
        </div>


        {actionData?.error && !actionData?.errors && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-500 text-sm font-medium text-red-700 animate-fadeIn">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-5">
          
          <div className="group flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors group-focus-within:text-blue-600">
              First Name
            </label>
            <input 
              type="text" 
              name="first_name" 
              required
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2
                ${actionData?.errors?.first_name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              placeholder="John"
            />
            {actionData?.errors?.first_name && (
              <p className="text-xs font-medium text-red-600 mt-1 pl-1">
                {actionData.errors.first_name}
              </p>
            )}
          </div>

          <div className="group flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors group-focus-within:text-blue-600">
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              required
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2
                ${actionData?.errors?.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              placeholder="you@example.com"
            />
            {actionData?.errors?.email && (
              <p className="text-xs font-medium text-red-600 mt-1 pl-1">
                {actionData.errors.email}
              </p>
            )}
          </div>

          <div className="group flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors group-focus-within:text-blue-600">
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              required
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2
                ${actionData?.errors?.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              placeholder="••••••••"
            />
            {actionData?.errors?.password && (
              <p className="text-xs font-medium text-red-600 mt-1 pl-1">
                {actionData.errors.password}
              </p>
            )}
          </div>


          <button 
            type="submit" 
            disabled={isSubmitting}
            className="relative flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Sign up'
            )}
          </button>
        </Form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
