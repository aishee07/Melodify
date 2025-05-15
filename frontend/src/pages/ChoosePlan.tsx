import { useUser } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const PLANS = [
  {
    id: "monthly",
    name: "Monthly Plan - ₹99/month",
    description: "Cancel anytime",
    priceId: "price_1ROvczCKUFlirSGa63Sa1xyI",
  },
  {
    id: "yearly",
    name: "Yearly Plan - ₹999/year",
    description: "• Save 15% • Cancel anytime",
    priceId: "price_1RP5YrCKUFlirSGa3yTOLo0U",
  },
];

export default function ChoosePlan() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelectPlan = async (priceId: string) => {
    try {
      setIsLoading(priceId);
      const res = await axiosInstance.post("/payment/create-checkout-session", {
        email: user?.primaryEmailAddress?.emailAddress,
        priceId,
      });
      window.location.href = res.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-1500 to-black text-white flex items-center justify-center px-4 py-12"
      style={{ marginTop: "-3rem" }}
    >
      {/* Fixed Back Button at top-left corner */}
      <Button
        variant="outline"
        onClick={handleBack}
        className="fixed top-4 left-4 flex items-center text-purple-300 hover:text-purple-400 border border-purple-300 hover:border-purple-400 z-50"
        style={{ zIndex: 9999 }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-4xl w-full space-y-10">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img src="/melodify.png" className="w-24 h-24 object-contain" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600">
          Choose Your Premium Plan
        </h1>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 text-purple-200">{plan.name}</h2>
                <p className="text-purple-100 text-sm">{plan.description}</p>
              </div>
              <Button
                onClick={() => handleSelectPlan(plan.priceId)}
                disabled={isLoading !== null}
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-700 text-white hover:from-purple-700 hover:to-pink-600 rounded-full px-6 py-2 text-sm font-semibold"
              >
                {isLoading === plan.priceId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  "Choose Plan"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
