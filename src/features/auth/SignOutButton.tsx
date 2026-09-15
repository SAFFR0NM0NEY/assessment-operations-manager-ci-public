import { useState } from 'react';

import { Button, type ButtonSize, type ButtonVariant } from '../../components/ui';
import { GENERIC_SIGN_OUT_ERROR_MESSAGE } from './authService';
import { useAuth } from './useAuth';

interface SignOutButtonProps {
  className?: string;
  errorClassName?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function SignOutButton({
  className,
  errorClassName,
  size = 'small',
  variant = 'ghost',
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setErrorMessage('');

    try {
      await signOut();
    } catch {
      setErrorMessage(GENERIC_SIGN_OUT_ERROR_MESSAGE);
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <Button
        className={className}
        disabled={isSigningOut}
        onClick={() => {
          void handleSignOut();
        }}
        size={size}
        type="button"
        variant={variant}
      >
        {isSigningOut ? 'Signing out' : 'Sign out'}
      </Button>
      {errorMessage ? (
        <p className={errorClassName} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
