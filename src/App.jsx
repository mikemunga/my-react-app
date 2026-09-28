import { createBrowserRouter,Link, RouterProvider,  Outlet,  Form, useNavigate, isRouteErrorResponse, useSearchParams, useRouteError, NavLink, redirect, useRevalidator, useLocation, useNavigation} from "react-router";
import SignupPage,{ SignupAction } from './SignupPage';
import LoginPage from './LoginPage';
import { Toaster } from "sonner";
import axiosInstance from "./axiosInstance";
import { LoginAction } from "./loginAction";
import ProductDetails from "./ProductDetails";
import { productDetailsLoader } from "./ProductDetails.Loader";
import {  useEffect, useState } from "react";
import { GuestLayout } from "./ProtectedRoute.jsx";
import filteredRedirectUrl from "./routerGuard.jsx";
import { AnimatePage } from "./AnimatedPage.jsx";
import { rootAuthLoader } from "./AuthRoothLoader";
import  Cartlist from './Cart.jsx';
import { fetchCurrentUser } from "./useAuthStore.js";
import { queryClient } from "./Query.js";
import useItems from "./useItems.js";
import useCart from "./useCartStore.js";
import Div from "./practicetailwind.jsx";


const authRedirectLoader = async ({request}) => {
  //cart fetching logic on mount/ refresh by checking the user state.
let user = queryClient.getQueryData(['authUser']);

if(!user) {
  try{
    user = await fetchCurrentUser();

    if(user) {
      queryClient.setQueryData(['authUser'], user);
    }
  } catch (error){
    user=null;
  }

}

const url = new URL(request.url);
const isAuthPath = url.pathname === '/login' || url.pathname === '/signup';

  if (user && isAuthPath) {
    const destinationParam = url.searchParams.get('redirectTo');
    const targetDestination = filteredRedirectUrl(destinationParam) || '/';
    return redirect(targetDestination)
  }
 return { user };
}
 


const router = createBrowserRouter([

    {
      HydrateFallback: HydrateFallback,
      errorElement: <GlobalErrorElement/>,
      children:[
       {
     id: 'root',
     path: '/',
     element: <RootLayout/>,
     loader: async () => {
     const user = await rootAuthLoader();
     return {
      user
      }
      },
       children: [
      {
      index: true,
      element: <MyShop/>,
      },
      {
        path: 'cart',
        element: <Cartlist/>,
      },

      {
        path :'product/:id',
        element: <ProductDetails />,
        loader :productDetailsLoader,
      },
      ]
    },
      {
        element : <GuestLayout />,
        children : [
        {
           path :'login',
        element: <LoginPage />,
        loader: authRedirectLoader,
        action :  LoginAction,
        },
          {
            path : 'signup',
            element : <SignupPage />,
            loader: authRedirectLoader,
            action : SignupAction,
         }
        ]
      }
      ]
    },

  {
    path: '*',
    element : (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight: '60vh', textAlign:'center', padding:'20px'}}>
        <h1 style={{color: '#1e293b', fontSize:'32px', marginBottom:'10px'}}>Page Not Found</h1>
        <p style={{color :'#64748b', marginBottom:'20px'}}>The requested page doesn't exist.</p>
        <Link to ='/' style={{textDecoration: 'none', background:'#1e293b', color:'white', padding:'8px 16px', borederRadious:'8px', fontWeight :'500'}}>
        Go Back Home</Link>
      </div>
    )
  },
  {
    path:'/div',
    element: <Div/>
  }

])


export default  function App(){
  return(
    <>
  
     <Toaster position = 'top-right' richColors/>
     <RouterProvider router={router}
     />
    
    </>
  )
}

function MyShop() {
  const {data: items=[], error, page } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All Products';
  const [searchWord, setSearchWord] = useState(searchParams.get('search') || '')
  const currentSearchQuery = searchParams.get('search') || '';
  const navigation = useNavigation();
  const isLoadingItem = navigation.state === 'loading'

  
  useEffect(() => {
    setSearchWord(currentSearchQuery);
  }, [currentSearchQuery])


  const handleSearch =  (e) => {
   e.preventDefault();

   const newParams = new URLSearchParams(searchParams);
   const trimmedSearch = searchWord.trim();
  
   if(trimmedSearch){
    newParams.set('search', trimmedSearch);
   }else {
    newParams.delete('search');
   }
   newParams.set(page, '1')
   setSearchParams(newParams);
  }
 

  if (error){
    return <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Something went wrong. Please check your connection.</div>
  }


  const buildPath = (category) => {
    const params = new URLSearchParams();
    if(category) params.set('category',category);

    return `/?${params.toString()}`;
  }
 
  const getLinkStyle = ({ isActive }) => ({
    textDecoration :'none',
    fontWeight: isActive ? 'bold' : 'normal',
    color : isActive ? '#da222' : '#b42f2f',
    paddingBottom : isActive ? '2px solid #da222' : 'none',

  });

if (isLoadingItem) {
  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full select-none">
      <div className="flex items-center gap-1.5 h-16">
        
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500/80 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
        
      
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
      
        <span className="w-1.5 h-full bg-red-500/60 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
  
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>

      </div>
    </div>
  );
}
  return (

   <div className="pt-30">
  
  <header className="text-center mb-8 md:mb-12 pt-4 select-none">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 capitalize inline-block relative pb-3">
     {currentCategory}
     <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-500 rounded-full"></span>
     </h1>
     <p className="text-xs md:text-sm text-zinc-500 font-medium mt-3 tracking-wide  uppercase">
     Curated Collection
     </p>
   </header>


<section className="flex justify-center w-full mb-8 md:mb-12 px-4">
  <Form 
    method="get" 
    className="flex w-full max-w-xl md:max-w-2xl items-center shadow-xs rounded-full bg-white border-2 border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 transition-all duration-200"
  >
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://w3.org">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input
        type="text"
        name="searchQuery"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        placeholder="Search for items, brands..."
        className="w-full h-12 pl-11 pr-4 bg-transparent text-zinc-900 placeholder-zinc-400 text-base font-medium rounded-l-full outline-hidden"
      />
    </div>
    <button
      onClick={handleSearch}
      type="submit" 
      className="h-12 px-6 md:px-8 bg-red-500 hover:bg-red-600 active:scale-98 font-bold text-white text-sm md:text-base rounded-r-full tracking-wide transition-all duration-150 cursor-pointer select-none"
    >
      Search
    </button>
  </Form>
</section>




  
   
    
  <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium p-20 justify-between">
  <NavLink 
    to={buildPath('')} 
    className={({ isActive }) => 
    `relative pb-1 transition-colors duration-200 select-none     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
   }`}>
    Explore
  </NavLink>

  <NavLink 
    to={buildPath('electronics')} 
    className={({ isActive }) => 
    `relative pb-1 transition-colors duration-200 select-none   after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300   hover:after:scale-x-100 ${
     isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
    }` }>
    Electronics
    </NavLink>

  <NavLink 
     to={buildPath('jewelery')} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
       }`}>
      Jewelry
  </NavLink>

  <NavLink 
      to={buildPath("men's clothing")} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
      }` }>
    Men's Clothing
  </NavLink>

    <NavLink 
      to={buildPath("women's clothing")} 
      className={({ isActive }) => 
        `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
        isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
        }`}>
     Women's Clothing
   </NavLink>

   <NavLink 
      to={buildPath("groceries")} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
      }`}>
       Groceries
     </NavLink>
</nav>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {items && items.length > 0 ? (
          
            items.map((item) => (
            
              <Link
              to = {`/product/${item.id}`}
              key={item.id} style={{
                ...cardStyle,
                transform: 'translateY(0px) scale(1)',
                boxShandow : '0 4px 6px rgba(0, 0, 0, 0.15)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-n-out'
                }}
                onMouseEnter ={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                  e.currentTarget.style.boxShadow ='0 12px 20px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow ='0 4px 6px rgba(0, 0, 0, 0.15)';
                }}
                >
                
                <div style={{ height: '200px', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={item?.image || 'https://placeholder.com'} alt={item?.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
               
              
                <div style={{ padding: '12px 5px' }}>
                   <div style={{marginBottom:'0px'}}><p>{item.title}</p></div>
                  <p style={{ fontSize: '14px', color: '#333', margin: '0 0 8px 0', height: '40px', overflow: 'hidden' }}>{item.name || item.item_details}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF4747' }}>KSH {item.price}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>⭐ {item.rating || '4.5'}</span>
                  </div>
                  
                </div>
                
              </Link>
              
            ))
          ) : (
            <div className="col-span-full text-center py-12 px-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs max-w-md mx-auto w-full select-none animate-fade-in">
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://w3.org">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                No products found
              </h3>

              <p className="text-xs md:text-sm text-zinc-500 font-medium mt-1">
                No products match your criteria. Try adjusting your keywords or clearing the search bar.
              </p>
            </div>

          )}
        </div>
    </div>
      

  );
}

const cardStyle = { background: '#fff', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0' };



export function RootLayout() {
  const {page, data: items=[], isLoading} = useItems()
  const {totalCount, user} = useCart()
  const navigate = useNavigate();
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoadingDetails = location.state?.loading;
 
 


  const revalidator = useRevalidator();
  
  const handleLogout = async()=>{
   try {
    await axiosInstance.post('/auth/logout');
   } catch (error) {
    console.log('Logout request failed:', error);
   } finally {
    localStorage.removeItem('authToken')
    queryClient.setQueryData(['authUser'], null);
    queryClient.removeQueries();
    revalidator.revalidate();
    navigate('/')
   }
  }

  const handleNextPage = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page',(page + 1).toString());
    setSearchParams(newParams)
  }


if (isLoadingDetails) {
  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full select-none">
      <div className="flex items-center gap-1.5 h-16">
        
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500/80 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
        
      
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
      
        <span className="w-1.5 h-full bg-red-500/60 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
  
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>

      </div>
    </div>
  );
}



 if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full select-none">
      <div className="flex items-center gap-1.5 h-16">
        

        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500/80 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
      
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500/60 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0.4s' }}></span>
        
        <span className="w-1.5 h-full bg-blue-500 rounded-full origin-center animate-wave-down" style={{ animationDelay: '0.2s' }}></span>
        
        <span className="w-1.5 h-full bg-red-500 rounded-full origin-center animate-wave-up" style={{ animationDelay: '0s' }}></span>
      </div>
    </div>
  );
}


return (



 <div  className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans   antialiased selection:bg-red-500/10"> 
   <header>
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-auto min-h-[3.5rem py-3 sm:p-y-0 sm:h-[4.5rem] px-[clamp(1rem,4vw,2.5rem)] bg-zinc-900 text-white shadow-md flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-3 sm:gap-4">

      <NavLink 
      to="/" 
      className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight whitespace-nowrap bg-linear-to-r from-red-500 via-zinc-100 to-white bg-clip-text text-transparent transition-all duration-300 hover:text-red-400 select-none"
      style={{ backgroundPosition: 'right center' }}
        >
      Easy Shop Store 
      </NavLink> 



   <div className="flex justify-between gap-2 sm:gap-10 items-baseline px-2 sm:px-4  md:px-6 w-full">
      <Link 
      to="/" 
      className="relative inline-block text-sm md:text-base font-semibold text-slate-300 active:text-white pb-1 select-none transition-colors duration-200 lg:hover:text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 lg:hover:after:origin-bottom-left lg:hover:after:scale-x-100"
       >
      Home
      </Link>

     <nav className="flex items-center gap-4 md:gap-6"> 
     <Link 
      to="/cart" 
      className="relative flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 font-semibold text-zinc-800 shadow-sm border border-zinc-200/50 transition-all duration-200 hover:bg-zinc-200/70 hover:shadow active:scale-95 text-xs md:text-sm">

      <span className="text-base">🛒</span>
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
        {totalCount}
      </span>
      </Link>

       {!user && (
      <Link 
        to="/signup" 
        className="rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold text-teal-600 transition-colors duration-200 hover:bg-teal-50"
       >
        Sign In
       </Link>
        )}

       {user && (
        <button
        onClick={handleLogout}
        className="text-xs md:text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors duration-200 cursor-pointer"
      > 
        Log Out 
      </button>
       )}
     </nav> 
    </div>

    </div>
</header>




      <OfflineBanner />
      
      
        <main>
        <AnimatePage key ={location.pathname}>
        <div>
        <Outlet />
        </div>
        </AnimatePage>
       
        {location.pathname === '/' && items.length > 0 && (
          <div>
          <span>Current Page: {page} </span>
          <button
        disabled={items.length < 8}
        onClick={handleNextPage}
        >Next</button>
        </div>
        )}
       
      </main>
  <div className="w-full bg-zinc-900 text-zinc-400 py-10 mt-auto border-t border-zinc-900  select-none h-25 px-2.5">
      <footer >
       <div className="flex flex-col items-center md:items-start gap-1">
         <p className="text-xs text-zinc-500 font-medium">
          Handcrafted with precision by <span className="text-red-400 font-bold">Michael M. Munga</span>
          </p>
           </div>
           <div className="flex flex-col items-center md:items-end gap-1 text-center    md:text-right">
           <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Production Build
          </p>
            <p className="text-xs text-zinc-500 font-medium">
            Released 7 Jan 2026
           </p>
         </div>
     </footer>
     </div>
 </div>
  );
}





export function HydrateFallback () {
  return (
   
       <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9'}}>
        <main style={{flex:1, display:'flex', justifyContent:'center', alignItems:'center', paddingTop: '80px'}}>
          <div style={{textAlign: 'center', fontFamily: 'sans-serif', color: '#666'}}>
            <h3>Booting GlobalStore Systems...</h3>
            <h3>Please wait while we establish your secure session data....</h3>
          </div>
        </main>
       </div>
  );
}




export function GlobalErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Unexpected System Error.';
  let message = 'An error occurred while synchronizing store systems.';
  console.log('Caught app crash:', error)
     
   if(isRouteErrorResponse(error)){
     if(error.status === 404){
     title ='Page Not Found.';
     message="The requested page doesn't exist.";
    }else {
      title =` Error ${error.status}`;
     message = error.statusText || message
     }
    }else if(error instanceof Error){
  message = error.message;
   }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcfcfc', padding: '20px', fontSize:'1rem' }}>
      <div style={{ maxWidth: '450px', width: '100%', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#222', marginBottom: '10px' }}>{title}</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.5' }}> <span style={{color: '#ad3636'}}>{message}</span></p>
       
      <button onClick={()=> navigate('/')}>
        Return to Home page
      </button>
      </div>
    </div>
  );
}


export function OfflineBanner () {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect (() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('isOnline', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('isOnline', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  }, []);

  if(isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom:0,
      left: 0,
      right: 0,
      backgroundColor: '#e74c3c',
      color: 'white',
      textAlign: 'center',
      padding: '10px',
      fontWeight:'600',
      zIndex: 9999,
      fontFamily:'sans-serif',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1'
    }}>
      🌐 You are currently offline. Some features may  be unavailable.
    </div>
  )
}


