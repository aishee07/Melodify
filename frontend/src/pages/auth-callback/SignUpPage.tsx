import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;