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
import WaveBarSpinner from "./WaveBarsSpinner.jsx";


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

 if(isLoadingItem){
  return (
    <div style={{display: 'flex', justifyContent:'center', alignItems: 'center', minHeight: '100vh'}}>
      <WaveBarSpinner text="Loading item details.."/>
    </div>
  )
 }

  return (

    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop:'5px',paddingLeft:'20px',paddingRight:'20px', fontFamily: 'sans-serif', marginTop:'60px' }}>
 
     
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#da2222', fontSize: '2.5rem', fontWeight: 'bold' }}>{currentCategory.charAt(0).toLocaleUpperCase()+ currentCategory.slice(1)}</h1>
      </header>

    
  
      <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
        <Form method="get" style={{ display: 'flex', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            name="searchQuery"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            style={{ flex: 1, padding: '12px 20px', fontSize: '16px', border: '2px solid #FF4747', borderRadius: '25px 0 0 25px', outline: 'none' }}
          />
          <button
          onClick={handleSearch}
          type="submit" style={{ background: '#FF4747', color: 'white', border: 'none', padding: '0 25px', fontSize: '16px', borderRadius: '0 25px 25px 0', cursor: 'pointer' }}>
            Search
          </button>
        </Form>
      </section>
   
      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px'}}>
        <NavLink to={buildPath('')}style={{ getLinkStyle}}> Explore</NavLink>
        <NavLink to={buildPath('electronics')}style={{getLinkStyle}}>Electronics</NavLink>
        <NavLink to={buildPath('jewelery')}style={{getLinkStyle}}>Jewelry</NavLink>
        <NavLink to={buildPath("men's clothing")} style={{getLinkStyle}}>Men's Clothing</NavLink>
        <NavLink to={buildPath("women's clothing")} style={{getLinkStyle}}>Women's Clothing</NavLink>
        <NavLink to={buildPath("groceries")} style={{getLinkStyle}}>Groceries</NavLink>
      </nav>


      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr', gap: '15px', padding:'20px 0', maxWidth:'1200px'
      }}>
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
               
              
                {/* Product Metadata */}
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
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>No products match your criteria.</p>
          )}
        </div>
        </div>
      

  );
}

// Inline styles helper objects
const navLinkStyle = { textDecoration: 'none', color: '#555', fontWeight: '600', padding: '5px 10px', borderRadius: '4px', fontSize: '15px' };
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

if(isLoadingDetails){
   return(
      <div style={{display: 'flex', justifyContent:'center', alignItems:'center', minHeight: '100vh'}}>
        <WaveBarSpinner/>
      </div>
      
    )
}

 if(isLoading){
  return(
    <div style={{display:'flex', justifyContent:'center', minHeight: '100vh'}}>
      <WaveBarSpinner/>
    </div>
  )
 }

  return (
    <div style={{ display:'grid', minHeight:'100vh', position:'relative', gridTemplateColumns:'1fr'}}> 

      <header style={{ backgroundColor: '#1e293b', color: 'white', padding: '20px 40px', position: 'fixed', width: '100%', zIndex: 100, contain: 'layout paint paint', isolation:'isolate', boxShadow:'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6)'}}>

        <div style={{ display :'flex', alignItems: 'baseline', gap: '12px', fontSize: '28px', justifyContent: 'space-around'}}>

          <NavLink to="/" style={{...navLinkStyle, color: 'white', fontSize: '60px', fontWeight: 'bold', textDecoration: 'none' }}>
            Easy Shop Store
          </NavLink>

          <nav>
          
            <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Home</Link>

            <Link to="/cart" style={{ color:  "#1b776d" , textDecoration: 'none' , }}> [🛒{totalCount}] </Link>

            {!user && (<Link to="/signup" style={{ color: "#1b776d" , textDecoration: 'none' , }}> Sign In </Link>)}
           

            <button
            disabled={!user}
            onClick={handleLogout}
            style={{ color:user? "#248d2ff8":"#660e0e1e",borederRadious:'4p', padding:'5px', fontSize:'24px'}}> Log Out </button>
        </nav>

          
        </div>
      </header>

      <OfflineBanner />
      
      
      <main style={{ flex: 1, padding: '20px', maxWidth: '1200px', width:'100%', margin: '40px auto', paddingg: '0 24px', boxSizing: 'border-box' }}>
        <AnimatePage key ={location.pathname}>
        <Outlet />
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

      <footer style={{ background: '#f3f4f6', padding: '15px', textAlign: 'center', borderTop: '2px solid #e5e7eb' , paddingBlock:'24px 0', textAlignLast: 'center' , color: '#6b7280', fontSize: '0.875rem'}}>
        <p>created by Michael M Munga on 2026/01/7.</p>
      </footer>

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
} else if(error instanceof Error){
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


