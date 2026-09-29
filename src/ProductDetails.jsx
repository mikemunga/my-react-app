
import {  Link, useLoaderData, useLocation, useNavigate} from "react-router";
import { useAuth } from "./useAuthStore.js";
import { useRef, useState } from "react";
import useCart from './useCartStore.js';

export default function ProductDetails() {
  const product = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdding = location.state?.loading || false;


  const {handleAddToCart, isAddingToCart} = useCart();
  
  const {data: user} =useAuth();
  const [ ishovered, setIsHovered] = useState(false);
  
  const containerRef = useRef(null);
  const zooImref = useRef(null)

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    containerRef.current = e.currentTarget.getBoundingClientRect();
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if(zooImref.current) {
      zooImref.current.style.transform ='scale(1)';
      zooImref.current.style.transformOrigin = 'center center'
    }
  }

   const handleMouseMove = (e) => {
     const rect = containerRef.current;
     if(!rect) return;
     const x = ((e.clientX - rect.left) / rect.width) * 100;
     const y = ((e.clientY - rect.top) /rect.height) * 100;

    if(zooImref.current) {
    zooImref.current.style.transformOrigin =`${x}% ${y}%`;
    zooImref.current.style.transform ='scale(2)';
   }
  }
  

  const onCartClick = () => {

    if(user){
      handleAddToCart(product.id)
      navigate('/')
      return;
    }else {
      const currentMemory = location?.pathname + (location.search || '/');
      navigate(`/cart?redirectTo=${encodeURIComponent(currentMemory)}`)
    }
  }
 
if (isAdding) {
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
     <div className="w-full max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8 pt-24 pb-16 font-sans antialiased text-zinc-900 selection:bg-red-500/10">
     <Link 
      to="/" 
      className="group inline-flex items-center gap-2 text-sm font-bold text-red-500 transition-colors duration-200 hover:text-red-600 mb-8">
      <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span> 
      Back to Catalog
  </Link>
  <div className="flex flex-col mt-5 md:flex-row gap-8 lg:gap-14 items-start w-full">
    <div 
       onMouseMove={handleMouseMove}
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
       className="relative w-full max-w-md md:max-w-[450px] aspect-square flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs cursor-zoom-in mx-auto md:mx-0 shrink-0"
    >
      <img 
        ref={zooImref} 
        src={product?.image} 
        alt={product?.title} 
        className="w-full h-full max-h-[400px] object-contain block transition-transform duration-100 ease-out will-change-transform" 
      />
    </div>

    <div className="flex-1 w-full flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
        {product?.category}
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-tight mb-2">
        {product?.title}
        </h1>
         {product?.name && (
        <p className="text-sm font-medium text-zinc-500 mb-4">{product?.name}</p>
      )}

        <h2 className="text-2xl sm:text-3xl font-black text-red-500 tracking-tight my-4">
          KSH {product?.price?.toLocaleString() || product?.price}
        </h2>
     
      <div className="border-t border-b border-zinc-200/80 py-5 my-4">
         <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-2">
          Product Description
          </h4>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium">
          {product?.description || "No description provided for this item."}
         </p>
      </div>
      
      <button
          onClick={onCartClick}
          type="button"
          disabled={isAddingToCart}
           className={`w-full max-w-xs h-12 font-bold text-sm md:text-base rounded-xl select-none transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer
          ${isAddingToCart 
            ? 'bg-zinc-300 text-zinc-500 shadow-none cursor-not-allowed' 
            : 'bg-red-500 text-white shadow-red-500/10 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-98'
          }
         `}
        >
        {isAddingToCart ? (
          <>
            <span className="animate-pulse"></span> Adding to Basket...
          </>
        ) : (
          <>
            <span>🛒</span> Add to Cart
          </>
        )}
      </button>

    </div>
  </div>
</div>       
  );
}





