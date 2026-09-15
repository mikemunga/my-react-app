import { create } from 'zustand';
import axiosInstance from './axiosInstance';
import { useQuery } from '@tanstack/react-query';
//import { useCartStore } from './useCartStore';


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
    
        const response = await axiosInstance.get('/auth/me');
        if(!response.data || !response.data?.user) {
            console.log('no user')
            throw new Error('No user session found')
        }
   
        return response.data?.user;

    }


export function useAuth() {
    return useQuery({                              
        queryKey: ['authUser'],
        queryFn: fetchCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
        
    })
}



