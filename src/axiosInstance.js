import axios from "axios";
import {toast} from 'sonner'
const activeRequests= new Map();

//helper function deterministicallt serialize objects regardless of key order
function stableStringify(obj){
    if(!obj || typeof obj !== 'object') return JSON.stringify(obj);
    //sort keys alphabetically
    return JSON.stringify(
        Object.keys(obj)
        .sort()
        .reduce((result, key)=>{
            result[key]=obj[key];
            return result;
        }, {})
    );
}

function generateRequestKey(config) {
const method = config.method ? config.method.toUpperCase():'GET';
const url = config.url || '';
const params = config.params ? stableStringify(config.params): '';

let data='';
if(config.data){

    if(typeof FormData !== 'undefined' && config.data instanceof FormData){
        const formDataParts=[];
        //Sort the entries if you need deterministic Formdata behaviour
        for (const[ key, value] of config.data.entries()){
            if(typeof File !== 'undefined' && value instanceof File){
                formDataParts.push(`${key}:[File]${value.name}_${value.size}`);
            } else {
                formDataParts.push(`${key}:${value}`);
            }
        }
        data=`FORMDATA[${formDataParts.sort().join(",")}]`;
    } else {
        try{
            data= typeof config.data === 'string'? config.data :stableStringify(config.data);
        } catch (error){
            console.warn(" Key generator fallback activated due to stringify failure:", error)
            data='SERIALIZATION_FAILURE';
        }
        
    }
   }
   return `${method}_${url}_PARAMS:${params}_BODY:${data}`;
}

//independent custom axios instance
const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true
});

//request interceptors guard against duplicates
axiosInstance.interceptors.request.use(
    (config)=>{   
        //only intercept repeatable read operations (GET)
        if(config.method?.toLowerCase() === 'get'){
            const requestKey = generateRequestKey(config);
            if(activeRequests.has(requestKey)){
                const oldController = activeRequests.get(requestKey);
                oldController.abort();
                activeRequests.delete(requestKey);
            }
            const currentController = new AbortController();
            activeRequests.set(requestKey, currentController);
            config.signal = currentController.signal;
        }
        return config;
    },
    (error) => {

        if (axios.isCancel(error)){
            console.log('Duplicate request intentionally aborted by client. Suppressing UI error');
            return new Promise(() => {})
        }
        const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
        toast.error(errorMessage);
        console.log(errorMessage);
        return Promise.reject(error);
    }
)
export default axiosInstance;

//response inteceptor

axiosInstance.interceptors.response.use(
    (response)=>{
        if(response.config?.method?.toLocaleLowerCase() == 'get'){
            const requestKey  = generateRequestKey(response.config);
            activeRequests.delete(requestKey);
        }
        const method = response.config.method?.toLocaleLowerCase();
        if(method !== 'get'){
            const successMessage = response.data?.message || 'Operation succesful!';
            toast.success(successMessage)
        }

        return response;
    },
    (error)=>{
        if(error.code ==='ERR_CANCELED' || error.message === 'canceled'){
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const backendData = error.response?.data;

        if(error.config?.skipGlobalErrorHandler){
            return Promise.reject(error);
        }

        if(status === 401 || status === 403) {
            return Promise.reject(error);
        }

        if( status === 400  && backendData?.errors && typeof backendData.errors === 'object'){
          
            const errorMessages = Object.values(backendData.errors);

            errorMessages.forEach(err => {
               if(typeof err === 'string') {
                toast.error(err, {
                    autoClose: 100,
                    closeOnclick: true,
                    pauseOnHover: true
                });
               }
            });
            return Promise.reject(error);
        }
        if(status) {
            const fallbackMessage = typeof backendData === 'string'
            ? backendData
            :backendData?.message || 'Something went wrong. Please try again.';

            toast.error(fallbackMessage);
        }

        return Promise.reject(error)
})