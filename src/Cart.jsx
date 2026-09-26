
import {  useNavigate, useSearchParams} from "react-router";
import useCart from './useCartStore.js'


 export   function CartList(){
    const {data:cartItems = [], user, isLoading, handleUpdateQuantity, totalCount} = useCart()
    const navigate = useNavigate();
    if(isLoading){
        return <div style={{padding:'40px', textAlign:'center'}}>Loading your Cart...</div>
    }
    if(!user){
    return <CartAuthWall/>
    }


    return(
        <div style={{display:'grid', gridTemplateColumns:cartItems.length > 0 ? '2fr 1fr': '1fr', gap: '30px', fontFamily: 'sans-serif', paddingTop: '150px'}}>
            <div style={{backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.5'}}>
                <h2 style={{margin: '0 0 20px 0', fontSize: '20px', borderBottom: '2px solid #f0f0f0', padding: '15px'}}>
                    Shopping Basket ({totalCount} {totalCount ===1 ? 'Item' : 'Items'})
                </h2>

                {cartItems.length === 0 ?(
                    <div style={{textAlign: 'center', padding: '40px 0'}}>
                        <p style={{fontSize: '16px', color: '#8c8c8c', margin: '0 0 20px 0'}}>Your Shooping Basket is completely empty.</p>
                        <button onClick={()=>navigate('/')} style={{padding: '10px 20px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderEndEndRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}>
                            Continue Shopping
                        </button>
                        </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.cart_item_id} style={{display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                            <img src={item.image} alt={item.id} style={{width: '90px', height: '90px', objectFit: 'contain'}}/>

                            <div style={{flex: 1}}>
                                <h4 style={{margin: '0 0 8px 0', fontSize: '15px',  color: '#262626'}}>{item.title}</h4>
                                <p style={{margin :'0 0 12px', fontSize: '13px', color: '#8c8c8c'}}>Category: {item.category}</p>

                                <button onClick={()=> handleUpdateQuantity({cartItemId: item.cart_item_id, currentQuantity: item.quantity, changeFactor: -1})} 
                                
                                 style={{width: '28px', height: '28px', borderRadius:'4px', border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', fontWeight: 'bold'}}> - </button>
                            
                    
                                <span style={{fontWeight: 'bold', maxWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>

                                 <button onClick={()=> handleUpdateQuantity({cartItemId: item.cart_item_id, currentQuantity: item.quantity, changeFactor: 1})}
                                 

                                 style=      {{width: '28px', height: '28px', borderRadius:'4px', border: '1px solid #d9d9d9',  background: '#fff', cursor: 'pointer', fontWeight: 'bold'}}> + </button>
                            </div>
                        </div>
                    ))
                )}

             </div>

              
                {cartItems.length > 0 && (
                    <div style={{backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05', height: 'fit-container'}}>
                    <h3 style={{margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px'}}>Order Checkout Summary</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 0 12px 0', color: '#595959'}}>
                        <span>Basket SubTotal:</span>
                        <span>Ksh</span>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 0 12px 0', color: '#595959'}}>
                        <span>Shipping Fees:</span>
                        <span style={{color: '#52c41a', fontWeight: 'bold'}}>FREE</span>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #d9d9d9', padding: '15px', marginBottom: '24px'}}>

                        <span style={{fontSize: '16px', fontWeight: 'bold'}}>Estimated Total</span>
                        <span style={{fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f'}}>Ksh </span>
                    </div>
                    <button style={{width: '100%', padding:'14px', backgroundColor: '#ff4d4f' , color: '#fff,', border:'none', borderRadius:'4px',cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'}}>
                        Secure Checkout M-PESA
                    </button>
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