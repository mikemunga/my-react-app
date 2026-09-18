import { QueryClient , onlineManager} from "@tanstack/react-query";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      refetchOnReconnect:false,
      refetchOnMount:true,
    }
  }
});

onlineManager.setEventListener((setOnline)=> {
  const handleOnline = () => setOnline(true);
  const handleOffline =() => setOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline',handleOffline)
  }
});