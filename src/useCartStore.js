import { create } from "zustand";
import axiosInstance from "./axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuthStore";

export const  useCartStore = create((set, get) => ({
    cartItems: [],
    count:0,

    updateCount: () => set((state)=>(
      {count: state.count +1}
    )),



    fetchGlobalCart : async () => {
        try{
            const response = await axiosInstance.get('/cart');
            set ({cartItems: Array.isArray(response.data)? response.data: [] })

            get().getTotalCartCount()
        } catch (error) {
            console.log('Error fetching cart:', error);
        }
    },


    clearCart: () => set({cartItems: []}),

    getTotalCartCount: () => {
        return get().cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    },



    
    handleUpdateQuantity: async (cartItemId, currentQuantity, changeFactor) => {
        const newQuantity = currentQuantity + changeFactor;
       
        if(newQuantity <=0) {

          set((state) => ({
            cartItemItems: state.cartItems.filter(item => item.cart_item_id !==cartItemId)
          }));

           await axiosInstance.delete(`/cart/${cartItemId}`);
        } else {
          await axiosInstance.put(`/cart/${cartItemId}`, {
            quantity : newQuantity
          });
        }
      await get().fetchGlobalCart();
     await get().getTotalCartCount()
    },

    handleAddToCart: async (productId) => {
      await axiosInstance.post('/cart', {item_id: productId});

      await get().fetchGlobalCart();
    }

  }
))


export default function useCart(){
  const queryClient = useQueryClient();
  const {data: user, isLoading: isAuthLoading} =useAuth();

  const query = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      const {data} = await axiosInstance.get('/cart');
        return data
      },
      enabled: !! user,
  });

  const handleUpdateQuantity = useMutation({
    mutationFn: async ({cartItemId, currentQuantity, changeFactor}) =>{
      const newQuantity = currentQuantity + changeFactor;

      if(newQuantity <=0){
        return axiosInstance.delete(`/cart/${cartItemId}`)
      }else{
        return await axiosInstance.put(`/cart/${cartItemId}`, {
          quantity: newQuantity
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart', user?.id]})
    },
  });
  
const handleAddToCart = useMutation({
  mutationFn: async (productId) =>{
    return await axiosInstance.post('/cart', {item_id: productId})
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['cart', user?.id]})
  }
});


  const cartItems = query?.data || [];
  const totalCount = cartItems.reduce((total, item) => total+(item.quantity || 1), 0);

  return {
    ...query,
    cartItems,
    totalCount,
    user,
    isAuthLoading,
    handleAddToCart: handleAddToCart.mutate,
    isAddingToCart: handleAddToCart.isPending,
    handleUpdateQuantity: handleUpdateQuantity.mutate,
    isUpdatingCartQuantity: handleUpdateQuantity
  }
}