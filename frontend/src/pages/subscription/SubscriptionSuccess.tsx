import { CheckCircle2 } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const clearQueue = usePlayerStore((state) => state.clearQueue);
  const navigate = useNavigate();

  const handleGoHome = () => {
    clearQueue();  
    navigate("/"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white px-6">
      <div className="bg-purple-600 rounded-full p-6 shadow-lg animate-pulse">
        <CheckCircle2 size={72} className="text-white" />
      </div>

      <h1 className="mt-8 text-4xl font-extrabold tracking-wide">
        Subscription Successful!
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-purple-300">
        Thanks for upgrading to Premium. Enjoy ad-free music, offline listening, and more.
      </p>

      <button
        onClick={handleGoHome}
        className="mt-10 px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-purple-100 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default SubscriptionSuccess;
