import {  Outlet,useLocation} from "react-router";
import { useAuth} from "./useAuthStore";
import { CartAuthWall } from "./Cart";

export  function GuestLayout(){
   return <Outlet/>
}

export function ProtectedRoute () {
 const location = useLocation()
  const {data: user, isLoading} = useAuth();
  if(isLoading) return null;
    if(!user){
        const fullRouteMemory = location.pathname + location.search
        return <CartAuthWall fromPathName ={fullRouteMemory} />
    }
    return <Outlet/>
}
