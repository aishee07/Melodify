import { XCircle } from "lucide-react";

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white px-6">
      <div className="bg-red-600 rounded-full p-6 shadow-lg animate-pulse">
        <XCircle size={72} className="text-white" />
      </div>

      <h1 className="mt-8 text-4xl font-extrabold tracking-wide">
        Subscription Cancelled
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-red-300">
        Your subscription was cancelled or payment failed. Please try again or contact support.
      </p>

      <button
        onClick={() => window.location.href = '/'}
        className="mt-10 px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-purple-100 transition"
      >
        Return Home
      </button>
    </div>
  );
};

export default SubscriptionCancel;
