import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

export default function useItems(){
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page=parseInt(searchParams.get('page'),9) || 1;

    const query = useQuery({
        queryKey: ['items', {category, search, page}],
        queryFn: async () => {
            const {data} = await axiosInstance.get('/items', {
                params: {category, search, page}
            });
            return data;
        },
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5
    })
    return{...query, page, search,category};
}