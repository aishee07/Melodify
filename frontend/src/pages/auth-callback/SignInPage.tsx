import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;