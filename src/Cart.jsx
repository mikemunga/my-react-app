
import {  useNavigate, useSearchParams} from "react-router";
import useCart from './useCartStore.js'
import { ButtonPortal } from "./portal.jsx";


 export   function CartList(){
    const {data:cartItems = [], user, isLoading, handleUpdateQuantity, totalCount, subtotal} = useCart()
    const navigate = useNavigate();
    if(isLoading){
        return <div className="flex justify-center items-center">Loading your Cart...</div>
    }
    if(!user){
    return <CartAuthWall/>
    }


   return(
   <div className="mt-30 px-3">
        <div>
          <div className="flex justify-between items-baseline flex-col gap-2 sm:flex-row">
           <h2 style={{}}>
               Shopping Basket ({totalCount} {totalCount ===1 ? 'Item' : 'Items'})
          </h2>
          <p>Subtotal:<span>{subtotal}</span></p>
          </div>

        {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16  px-4 max-w-md mx-auto animate-fade-in ">
         <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6  text-red-500 animate-pulse">
          <svg xmlns="http://w3.org" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
       </div>

         <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          Your shopping basket is empty
         </h3>
         <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
         Looks like you haven't added anything to your cart yet. Explore our top categories to find something you love.
         </p>
         <button 
         onClick={() => navigate('/')} 
         className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-md shadow-red-100 hover:bg-red-600 active:scale-98 transition-all duration-200    select-none tracking-wide text-sm"
          >
          Continue Shopping
         </button>
        </div>
       ): (
          cartItems.map(item => (
          <div key={item.cart_item_id}>
             <div key={item.cart_item_id} className="flex flex-row sm:flex-row items-start sm:items-center gap-4 py-5 border-b border-gray-100 last:border-b-0 w-full">
            
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-50 ">
                 <img src={item.image} alt={item.id} 
                 className="w-full h-full object-contain mix-blend-multiply"/>
                 </div>

                 <div className=" min-w-0 w-full flex flex-col sm:flex-row sm:items-center   sm:justify-between gap-3">
                  <h4 style={{margin: '0 0 8px 0', fontSize: '15px',  color: '#262626'}}>{item.title}</h4>
                 <p style={{margin :'0 0 12px', fontSize: '13px', color: '#8c8c8c'}}>Category: {item.category}</p>
                  </div>

                 <div className="flex items-center gap-1 self-start sm:self-center bg-gray-50 p-0.5  rounded-md border border-gray-200" >
                   <button onClick={()=> handleUpdateQuantity({cartItemId: item.cart_item_id, currentQuantity: item.quantity, changeFactor: -1})} 
                   className="w-8 h-8 flex items-center justify-center rounded text-gray-600 font-semibold hover:bg-white hover:text-black active:scale-95 transition-all select-none"
                  aria-label="Decrease quantity"
                   > - </button>
                            
                 <span className="w-8 text-center text-sm font-bold text-gray-800 select-none">
                    {item.quantity}
                 </span>
                <button 
                   onClick={() => handleUpdateQuantity({ cartItemId: item.cart_item_id , currentQuantity: item.quantity, changeFactor: 1 })}
                   className="w-2 h-2 flex items-center justify-center rounded text-gray-600 font-semibold hover:bg-white hover:text-black px px-2 active:scale-95 transition-all select-none"
                   aria-label="Increase quantity">
                          +
                 </button>
                  </div>
                 </div>
                  </div> ))
               )}    
          </div> 
      
        {cartItems.length > 0 && (
        <div> 
        <ButtonPortal>
                <div className="fixed bottom-3 left-0.5 right-0.5 z-50 flex items-center justify-center bg-slate-700  backdrop-blur-md rounded-3xl shadow-xl-in border-2 border-indigo-500 sm:hidden" > 
                     <div>
                      <button className="px-5 py-2.5 bg-green-300 text-slate-800 font-bold rounded-xl hover:bg-green-400 transition-all active:scale-95 shadow-md shadow-green-900/10">
                        Check Out
                      </button> 
                    </div>
                </div>, 
               </ButtonPortal>


               <ButtonPortal>
                <div className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center justify-between gap-6 p-4 w-full max-w-3xl bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl shadow-slate-950/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Subtotal</span>
                    <span className="text-xl font-bold text-white">{subtotal}</span>
                  </div>
              
                  <div className="flex items-center gap-3">
                    <button 
                      className="flex items-center gap-2 px-8 py-3 .bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-bold rounded-xl hover:from-emerald-300 hover:to-green-400 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-green-500/20"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </ButtonPortal>
        </div>
        )}

       </div>
    )
}


export  function CartAuthWall() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const originPath = searchParams.get('redirectTo') || '/';
   const encodedOrigin = encodeURIComponent(originPath);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full px-4 select-none animate-fade-in pt-50">

      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
        

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-5">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://w3.org">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
          </svg>
        </div>

    
        <h2 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight mb-2">
          Your Cart is waiting!
        </h2>
        <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-6">
          Please log in or create an account to view and manage your shopping cart items.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full mb-6">
          
    
          <button
            onClick={() => navigate(`/login?redirectTo=${encodedOrigin}`)}
            className="h-11 px-6 bg-red-500 hover:bg-red-600 active:scale-98 text-white font-bold text-sm rounded-xl tracking-wide transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            Sign In
          </button>
          
        
        <button
            onClick={() => navigate(`/signup?redirectTo=${encodedOrigin}`)}
            className="h-11 px-6 bg-zinc-50 hover:bg-zinc-100 active:scale-98 text-zinc-800 font-bold text-sm rounded-xl border border-zinc-200 transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            Create Account
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-zinc-400 hover:text-red-500 transition-colors duration-200 cursor-pointer underline underline-offset-4"
        >
          Continue Browsing
        </button>
      </div>
    
    </div>
  );
}




export default CartList