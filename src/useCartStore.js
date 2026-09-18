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
   const queryKey = ['cart', user?.id];

  const query = useQuery({
    queryKey,
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
        const { data } = axiosInstance.delete(`/cart/${cartItemId}`);
        return data;
      }else{
        const { data } = axiosInstance.put(`/cart/${cartItemId}`, {
          quantity: newQuantity
        });
        return data
      }
    },


    onMutate: async({cartItemId, currentQuantity, changeFactor}) => {
      await queryClient.cancelQueries({queryKey});
      const previousCart = queryClient.getQueryData(queryKey);

      const newQuantity = currentQuantity + changeFactor;
      queryClient.setQueryData(queryKey, (oldData) => {
        if(!oldData) return [];

        if(newQuantity <=0) {
          return oldData.filter((item) => item.cart_item_id !==cartItemId)
        }

        return oldData.map((item) => item.cart_item_id === cartItemId? {...item, quantity: newQuantity} : item)
      });

      return {previousCart};
    },

    onError: (err, variables, context) => {
      if(context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
    },
    
    onSuccess: (serverData) => {
      if(serverData) {
        queryClient.setQueryData(queryKey, serverData)
      }
    }
  });



  
const handleAddToCart = useMutation({
  mutationFn: async (productId) =>{
    const {data} = axiosInstance.post('/cart', {item_id: productId});
    return data;
  },

onMutate: async (productId) => {
  await queryClient.cancelQueries({queryKey});
  const previousCart = queryClient.getQueryData(queryKey);

  queryClient.setQueryData(queryKey, (oldData = []) => {
    const existingItem = oldData.find((item) => item.product_id === productId);

    if(existingItem) {
      return oldData.map((item) => item.product_id === productId ? {...item, quantity: item.quantity + 1} : item);
    }

    return [
      ...oldData,
      {
        cart_item_id: `temp-${Date.now()}`,
        product_id: productId,
        quantity: 1,
      },
    ];
  });
  return {previousCart}
},

onError: (serverItem) => {
queryClient.setQueryData(queryKey, (oldData) => {
  const safeOldData = oldData || [];

  if(Array.isArray(serverItem)) {
    return serverItem;
  }
  const itemExists = safeOldData.some((item) => item.product_id === serverItem?.product_id);

  if(itemExists) {
    return safeOldData.map((item) => item.product_id === serverItem?.product_id ? serverItem : item);
  }

  const filteredList = safeOldData.filter((item) => !String(item.cart_item_id).startsWith('temp-'));
  return [...filteredList, serverItem]
})
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