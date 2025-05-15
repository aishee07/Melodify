import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PremiumButton = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  if (!isSignedIn) return null;

  return (
    <Button
      onClick={() => navigate("/choose-plan")}
      className="ml-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
    >
      Upgrade to Premium
    </Button>
  );
};

export default PremiumButton;
