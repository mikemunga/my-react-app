import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './output.css'
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient} from './Query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'





createRoot(document.getElementById('root')).render(
  
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App/>
    <ReactQueryDevtools initialIsOpen={true}/>
  </QueryClientProvider>
  </StrictMode>
)


