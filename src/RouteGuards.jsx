
import { Navigate } from "react-router";
import { useAuth } from "./useAuthStore";


export function ProtectedRoute ({ children }) {
    const {data:user, isLoading} = useAuth();

    if(isLoading) {
        return(
            <div style={{padding: '50px', textAlign: 'center'}}>
                <h3>Verifying  your active session....</h3>
            </div>
        )
    }

    return user? children: <Navigate to='/signup' replace/>
}



