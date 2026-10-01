import { createPortal } from 'react-dom';

export default function CheckoutPage() {
  const floatingBar = (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-between p-4 bg-slate-500/90 backdrop-blur-md rounded-2xl shadow-lg sm:hidden"> 
      <button className="px-4 py-2 font-bold text-white rounded-xl hover:scale-105 transition-transform">
        Add To
      </button> 
      <button className="px-4 py-2 bg-green-300 text-slate-800 font-bold rounded-xl hover:bg-green-400 transition-colors">
        Check Out
      </button> 
    </div>
  );

  return (
    <div>
      {typeof window !== 'undefined' && createPortal(floatingBar, document.body)}
    </div>
  );
}
