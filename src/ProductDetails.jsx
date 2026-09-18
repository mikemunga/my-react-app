
import {  Link, useLoaderData,  useFetcher , useLocation, useNavigate} from "react-router";
import { useAuth } from "./useAuthStore.js";
import { useRef, useState } from "react";
import useCart from './useCartStore.js';
import WaveBarSpinner from "./WaveBarsSpinner.jsx";
import useItems from "./useItems.js";


export default function ProductDetails() {
  const product = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdding = location.state?.loading || false;
  //const handleAddToCart = useCartStore((state) => state.handleAddToCart)
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
 
if(isAdding){
  
    return ( <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
        <WaveBarSpinner text="Fetching products.."/>
      </div>
    ) 
  }

  return (
    <div
      style={{ padding: '120px 40px', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: '#FF4747', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Catalog
      </Link>
      <div
    
       style={{ display: 'flex', gap: '50px', marginTop: '30px', alignItems: 'flex-start' }}>

        {/** image div */}
        <div 
          onMouseMove={handleMouseMove}
           onMouseEnter ={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
           style={{
          position:'relative', width:'100%', maxWidth:'450px', display: 'flex', aspectRatio:'1/1', overflow:'hidden', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#fff', justifyContent:'center',alignItems:'center', cursor:'zoom-in'
          }}>

          <img ref={zooImref} src={product?.image} alt={product?.title} style={{ width: '100%', height: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', transform: '0.1s ease-out, transform-origin 0.1s ease-out'}} 
         />
         <div> 
          </div>
         </div>
      
       

        <div style={{ flex: 1 }}>
          <span style={{ textTransform: 'uppercase', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>{product?.category}</span>
          <h1 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{product?.title}</h1>
          <p style={{ fontSize: '15px', color: '#555' }}>{product?.name}</p>
         
          <h2 style={{ color: '#FF4747', fontSize: '2rem', margin: '20px 0' }}>KSH {product?.price}</h2>
         
          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', margin: '20px 0' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Product Description</h4>
            <p style={{ lineHeight: '1.6', color: '#444' }}>{product?.description || "No description provided for this item."}</p>
      
          </div>
          
         
          <button
          onClick={onCartClick}
           type="button"
           disabled={isAddingToCart}
            style={{
             boxShadow: isAdding ? 'none' : '0 4px 6px rgba(255, 71, 71, 0.2)',
             transform : 'translateY()px)',
              transition : 'all 0.2s ease-n-out',
              background: '#FF4747', color: 'white', border: 'none',
              padding: '15px 40px', cursor:isAdding ? 'not-allowed': 'pointer', fontWeight: 'bold',
              borderRadius: '6px'
            }}
            onMouseEnter={(e)=>{if(!isAdding){e.currentTarget.style.background='#E53E3E'; e.currentTarget.style.transform='translateY(-2px)';}}}
            onMouseLeave={(e)=> {e.currentTarget.style.background=isAdding ? '#bcbcbc' : '#ff4747'; e.currentTarget.style.transform='translateY(0px)';}}

          >
          {isAdding ? 'Adding to Basket...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}





