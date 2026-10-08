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
import { NotFoundElement } from "./notFoundElement.jsx";

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
    element: NotFoundElement
  },
 
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
   newParams.set('page', '1')
   setSearchParams(newParams);
  }
 

   const handleNextPage = () => {
    const newParams = new URLSearchParams(searchParams);
    const nextPage = (page || 1) + 1;
    newParams.set('page', nextPage.toString());
    setSearchParams(newParams);
  };

if (error) {
  return (
    <div 
      role="alert" 
      aria-live="assertive"
      aria-atomic="true"
      className="flex w-full min-h-50 flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-6 text-center dark:border-red-950/30 dark:bg-red-950/10"
    >
      <div className="flex flex-col items-center space-y-2 max-w-sm">
    
        <svg 
          className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>

        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Something went wrong. Please check your connection.
        </p>
      </div>
    </div>
  );
}


  const buildPath = (category) => {
    const params = new URLSearchParams();
    if(category) params.set('category',category);

    return `/?${params.toString()}`;
  }

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
  <nav className="hidden sm:flex items-center font-small justify-between gap-6 xl:gap-8 p-[clamp(1rem,1.5vw,5rem)]">
  <NavLink 
    to={buildPath('')} 
    className={({ isActive }) => 
    `relative pb-1 transition-colors duration-200 select-none     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
   }`}>
    Explore
  </NavLink>

  <NavLink 
    to={buildPath('electronics')} 
    className={({ isActive }) => 
    `relative pb-1 transition-colors duration-200 select-none   after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300   hover:after:scale-x-100 ${
     isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
    }` }>
    Electronics
    </NavLink>

  <NavLink 
     to={buildPath('jewelery')} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
       }`}>
      Jewelry
  </NavLink>

  <NavLink 
      to={buildPath("men's clothing")} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
      }` }>
    Men's Clothing
  </NavLink>

    <NavLink 
      to={buildPath("women's clothing")} 
      className={({ isActive }) => 
        `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
        isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
        }`}>
     Women's Clothing
   </NavLink>

   <NavLink 
      to={buildPath("groceries")} 
      className={({ isActive }) => 
      `relative pb-1 transition-colors duration-200 select-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-zinc-900 font-bold after:scale-x-100' : 'text-zinc-500 hover:text-zinc-900'
      }`}>
       Groceries
     </NavLink>
</nav>


      <div className="grid grid-cols-2 px-2 md:grid-cols-3 gap-2">
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
                
                <div className="relative aspect-square w-full bg-gray-50 p-3 flex items-center justify-center oveflow-hidden group">
                  <img src={item?.image || 'https://placeholder.com'} alt={item?.name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"/>
                </div>
               
                <div className="absolute bottom-2 right-2 fex-items-center gap-0.5 rounded-full bg-white/90 px-2 py0.5 text-[10px] font-semibold text-gray-700 backdrop-blu-xs shadow-xs">
                    <span>⭐ {item.rating || '4.5'}</span>
                    </div>
            
                <div className="flex flex-1 flex-col p-3 justify-between">
                   <div className="line-clamp-2 min-h-10 text-sm font-medium text-gray-800 leading-snug"><p>{item.title}</p></div>
                  <h3>{item.name || item.item_details}</h3>
                </div>

                <div className="mt-2 items-baseline justify-between gap-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-900 text-[10px]">
                      Ksh
                      </span>
                    <span className="trxt-base font-bold text-gray-900 leading-tight">
                      {Number(item?.price).toLocaleString()}
                    </span>
                  </div>
                  <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors active:bg-blue-600"
                   aria-label="Add to cart"
                  >
                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                 </svg>
                  </button>
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

        <div className="p-2">
        <span>Current Page: {page} </span>
        <button
        onClick={handleNextPage}
        className="bg-blue-900 text-white px-2 rounded-1xl text-1xl hover:bg-blue-600 transition-colors duration-300"
         disabled={items.length < 8}
        >Next</button>
        </div>
        

    </div>
  );
}

const cardStyle = { background: '#fff', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0' };



export function RootLayout() {
  const { isLoading} = useItems()
  const {totalCount, user} = useCart()
  const navigate = useNavigate();
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoadingDetails = location.state?.loading;
  const currentCategory = searchParams.get('category') || 'all';

 const CATEGORIES = [
    { value: 'all', label: 'All Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'jewelery', label: 'Jewelry' },
    { value: 'men\'s clothing', label: 'Men\'s Clothing' },
    { value: 'women\'s clothing', label: 'Women\'s Clothing' },
    { value: 'groceries', label:'Groceries'}
  ];

  
  const handleDropdownChange = (selectedValue) => {
    const nextParams = new URLSearchParams(searchParams);
    
    if (selectedValue) {
      nextParams.set('category', selectedValue);
    } else {
      nextParams.delete('category'); 
    }
    
    nextParams.set('page', '1'); 
    setSearchParams(nextParams);
  };


  
  const handleLogout = async()=>{
   try {
    await axiosInstance.post('/auth/logout');
   } catch (error) {
    console.log('Logout request failed:', error);
   } finally {
    
    queryClient.setQueryData(['authUser'], null);
    queryClient.removeQueries();
    navigate('/')
   }
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
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-auto min-h-[3.5rem py-3 sm:p-y-0 sm:h-18  px-[clamp(1rem,4vw,2.5rem)] bg-zinc-900 text-white shadow-md flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-3 sm:gap-4">

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
      className="relative inline-block text-sm md:text-base font-semibold text-slate-300 active:text-white pb-1 select-none transition-colors duration-200 lg:hover:text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-red-500 after:transition-transform after:duration-300 lg:hover:after:origin-bottom-left lg:hover:after:scale-x-100"
       >
      Home
      </Link>

  <div className="sm:hidden w-40  rounded-2xl px-2 border-2 border-white">
    <select value={currentCategory}
    onChange={(e) => handleDropdownChange(e.target.value)}>
    {CATEGORIES.map((cat) => (
      <option className=" bg-slate-200 backdrop-blur-10xl text-slate-900 font-semibold border-0 font-stretch-extra-condensed" key={cat.value} value={cat.path}>
        {cat.value}
      </option>
    ))}
    </select>
  </div>

    


     <nav className="flex items-center gap-4 md:gap-6"> 
     <Link 
      to="/cart" 
      className="relative flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 font-semibold text-zinc-800 shadow-sm border border-zinc-200/50 transition-all duration-200 hover:bg-zinc-200/70 hover:shadow active:scale-95 text-xs md:text-sm">

      <span className="text-base">🛒</span>
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-5 text-center">
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
      </main>
  </div>
  );
}



export function HydrateFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <header className="h-16 w-full border-b border-slate-200/50 bg-white/50 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/50" aria-hidden="true" />

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div 
          className="flex flex-col items-center space-y-4 text-center max-w-sm"
          role="status" 
          aria-live="polite"
          aria-atomic="true"
        >
          <svg 
            className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" 
            xmlns="http://w3.org" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>

          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Connecting to GlobalStore
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please wait while we securely set up your application session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}




export function GlobalErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Unexpected System Error';
  let message = 'An error occurred while synchronizing store systems.';
  
     
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page Not Found';
      message = "The requested page doesn't exist or has been moved.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <div className="h-1.5 w-full bg-red-600 dark:bg-red-500" aria-hidden="true" />
      
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      
        <article 
          className="flex w-full max-w-md flex-col items-center text-center"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400" aria-hidden="true">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          
          <p className="mt-3 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            {message}
          </p>

          <div className="mt-8 w-full sm:max-w-xs">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Return to Home page
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}



export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

  
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed bottom-0 left-0 right-0 z-9999 animate-slide-up bg-red-600 px-4 py-3 text-white shadow-2xl dark:bg-red-700 sm:py-3.5 mt-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center space-x-3 text-center">
      
        <svg 
          className="h-5 w-5 shrink-0 text-red-100" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.004 9.004 0 018.716 2.253M12 3a9.004 9.004 0 00-8.716 2.253m0 0A9.015 9.015 0 0112 12a9.015 9.015 0 018.716-6.747M12 12c2.485 0 4.5 4.03 4.5 9s-2.015 9-4.5 9m0-18c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9" />
        </svg>
        
        <p className="text-sm font-semibold tracking-wide sm:text-base">
          You are currently offline. Some features may be unavailable.
        </p>
      </div>
    </div>
  );
}


