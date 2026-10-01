
import {  Link, useLoaderData, useLocation, useNavigate} from "react-router";
import { useAuth } from "./useAuthStore.js";
import { useRef, useState } from "react";
import useCart from './useCartStore.js';
import { createPortal } from "react-dom";

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
     <div className="relative w-full max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8 pt-24 pb-36 font-sans antialiased text-zinc-900 selection:bg-red-500/10 ">
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
       className="relative w-full max-w-md md:max-w-112.5 aspect-square flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs cursor-zoom-in mx-auto md:mx-0 shrink-0"
    >
      <img 
        ref={zooImref} 
        src={product?.image} 
        alt={product?.title} 
        className="w-full h-full max-h-100 object-contain block transition-transform duration-100 ease-out will-change-transform" 
      />
    </div>

  <div className="flex w-full flex-1 flex-col text-left pb-5">
  <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
    {product?.category}
  </span>
  
  <h1 className="mt-2 text-xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-2xl lg:text-3xl">
    {product?.title}
  </h1>
  {product?.name && (
    <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      {product?.name}
    </p>
  )}
  <div className="my-6 flex flex-col gap-4 border-y border-zinc-200/80 py-5 dark:border-zinc-800 sm:flex-row sm:items-baseline sm:justify-between pb-8">
    <h2 className="shrink-0 text-2xl font-black tracking-tight text-red-500 sm:text-3xl">
      KSH {product?.price?.toLocaleString() || product?.price}
    </h2>
    <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
      {product?.description || "No description provided for this item."}
    </p>
    </div>
 
   </div>
   </div>

     {typeof window !== 'undefined' && createPortal(
      <div className="fixed bottom-30 left-4 right-4 z-50 flex items-center justify-between gap-4 p-4 bg-slate-500/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 sm:hidden" > 
        
        <div className="flex items-center gap-3 ml-auto">
          <button
          onClick={onCartClick}
          className="px-5 py-2.5 font-bold text-white bg-slate-600/50 border border-white/10 rounded-xl hover:bg-slate-600 transition-all active:scale-95">
            Add To
          </button> 
          <button className="px-5 py-2.5 bg-green-300 text-slate-800 font-bold rounded-xl hover:bg-green-400 transition-all active:scale-95 shadow-md shadow-green-900/10">
            Check Out
          </button> 
        </div>

      </div>,
      document.body
    )}

</div>
  );
}





 