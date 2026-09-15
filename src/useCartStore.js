
import axiosInstance from "./axiosInstance";
import { useAuth} from "./useAuthStore";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";






export default function useCart() {
  const queryClient= useQueryClient()
    const {data: user, isLoading:isAuthLoading} = useAuth();

    const query= useQuery({
        queryKey: ['cart', user?.id],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/cart');
            return data;
        },

        enabled: !! user,
    });
    
    const handleAddToCart = useMutation({
      mutationFn: async (productId) => {
        return await axiosInstance.post('/cart', {item_id: productId})
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cart', user?.id]});
      }
    });

    const handleUpdateQuantity = useMutation({
      mutationFn: async ({cartItemId, currentQuantity, changeFactor}) => {
        const newQuantity = currentQuantity + changeFactor;

        if(newQuantity <=0) {
          return await axiosInstance.delete(`/cart/${cartItemId}`)
        }else{
          return await axiosInstance.put(`/cart/${cartItemId}`, {
            quantity: newQuantity
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cart', user?.id]})
      },
    });

    const carItems = query?.data || [];
    const totalCount = carItems.reduce((total, item) => total+(item.quantity || 1), 0);

    return {
      ...query,
      carItems,
      totalCount,
      user,
      isAuthLoading,

      handleAddToCart: handleAddToCart.mutate,
      isAddingToCart: handleAddToCart.isPending,
      handleUpdateQuantity: handleUpdateQuantity.mutate,
      isUpadatingCartQuantity: handleUpdateQuantity
    }

  }