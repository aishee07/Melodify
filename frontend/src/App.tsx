import { Route, Routes } from "react-router-dom";
import {
  SignIn,
  SignUp,
  AuthenticateWithRedirectCallback,
} from "@clerk/clerk-react";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import AudioPlayer from "./layout/components/AudioPlayer";
import SubscriptionSuccess from "./pages/subscription/SubscriptionSuccess";
import SubscriptionCancel from "./pages/subscription/SubscriptionCancel";
import ChoosePlan from "@/pages/ChoosePlan";


function App() {
  return (
    <>
      <AudioPlayer /> {/* ✅ Mounted globally before all routes */}

      <Routes>
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/choose-plan" element={<ChoosePlan />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/subscription-cancel" element={<SubscriptionCancel />} />


        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;