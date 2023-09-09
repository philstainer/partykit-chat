import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import { ChatRoom } from "./ChatRoom";

const clerkKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

export const UserSession = () => {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <SignedIn>
        <ChatRoom />
      </SignedIn>

      <SignedOut>
        <div>
          <h1>Log in to add reactions</h1>
          <p>Log in with your email address or a social account.</p>
          <SignInButton />
          <SignUpButton />
          <p>
            <strong>Why does this require a login?</strong> By requiring a
            login, it’s a little harder to spam these reactions. Your info won’t
            be used or shared.
          </p>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
};
