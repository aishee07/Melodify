import { useSignIn } from '@clerk/clerk-react';
import { Button } from './button';

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/auth-callback'
    });
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
      className="w-full text-white border-zinc-200 h-8 flex items-center gap-2"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google G"
        className="w-4 h-4"
      />
      Sign up or Sign in with Google
    </Button>
  );
};

export default SignInOAuthButtons;