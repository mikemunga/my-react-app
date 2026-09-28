import { create } from 'zustand';
import axiosInstance from './axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from './useCartStore';


export const useAuthStore = create ((set) => ({
    user: null,
    loading : true,

    setUser: (user) => set({user}),
    setLoading: (loading) => set({ loading }),

    logout: async () => {
        set ({ loading : true});
        try {
            await axiosInstance.post('/auth/logout');
            return true;
        }catch (error) {
            console.log('Logout endpoint failed:', error);
            return false
        } finally {
            set({ user : null, loading: false})
        }
    },
}))



export async function fetchCurrentUser() {

    const token = localStorage.getItem('authToken');


    if(!token){
        return null;
    }
    
    try{
        const response = await axiosInstance.get('/auth/me');
        if(!response.data || !response.data?.user) {
            console.log('no user')
            throw new Error('No user session found')
        }

        const user = response.data?.user;

        if(user) {
            const fetchGlobalCart = useCartStore.getState().fetchGlobalCart;
            await fetchGlobalCart();
        }
   
        return response.data?.user;
     } catch (error) {
       // localStorage.removeItem('authToken');
        return null;
     }
    
    }


  
    export function useAuth() {
    const tokenOnmount = localStorage.getItem('authToken')
    return useQuery({                              
        queryKey: ['authUser'],
        queryFn: fetchCurrentUser,
        retry: false,
        enabled: !!tokenOnmount,
        staleTime: 1000 * 60 * 5,
        
    })
}