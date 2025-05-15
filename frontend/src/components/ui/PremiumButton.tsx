import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

const PremiumButton = () => {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/api/payment/create-checkout-session");
      
      // Directly redirect to Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <Button 
      onClick={handleUpgrade}
      disabled={isLoading}
      className="ml-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Upgrade to Premium"
      )}
    </Button>
  );
};

export default PremiumButton;