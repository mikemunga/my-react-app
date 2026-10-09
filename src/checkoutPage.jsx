 import { useFetcher } from "react-router";
import useCart from "./useCartStore";
import { CartAuthWall } from "./Cart";



 export default function CheckoutPage() {
    const { subtotal, user } = useCart();
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";

   if(!user) {
    return <CartAuthWall/>
   }

    return (
        <div className="w-full min-screen flex items-start justify-center pt-50 bg-slate-50:">
        <div className="w-full max-w-md p-6 bg-slte-500 shadow-xl rounded-2xl border-gray-100 text-slate-800 font-bold">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Lipa na M-pesa</h2>
            <p className="text-gray-600 mb-6 text-sm">Enter your phone number to receive a direct prompt on your device.</p>
            <p>Total To Pay: <span>Ksh {subtotal.toLocaleString()}</span></p>
            <fetcher.Form method="post" className="space-y-4">
              <div>
                <label className="block text-sm font-semibold  mb-2">
                    Phone Number
                    <input type="tel"
                    name="phone"
                    required
                    placeholder="e.g., 0734..."
                    className="bg-gray-400 w-full p-3  rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none
                    "
                    />
                </label>
              </div>
              <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-linear-to-r frpm-emarald-500 to-green-500 text-white font-bold rounded-x shadow-lg active:scale-[0.98] disabled:opacity-50 rounded-2xl hover:bg-green-900 transition-colors duration-300">
                {isSubmitting ? "Sending Promt..." : "Pay"}
              </button>
            </fetcher.Form>

            {fetcher?.data?.error && (
                <p className="mt-4 text-green-500 font-semibold text-sm">
                    {fetcher?.data?.error}
                </p>
            )}

            {fetcher.data?.MechantRequestID && (
                <p className="mt-4 text-green-600 font-semibold text-sm">
                    Prompt sent! Please check your phone to enter your M-Pesa PIN.
                </p>
            )}
        </div>
        </div>
    )
 }