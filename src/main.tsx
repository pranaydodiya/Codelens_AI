import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

// Clerk Publishable Key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: 'hsl(142 71% 45%)',
          colorBackground: 'hsl(220 14% 96%)',
          colorText: 'hsl(220 13% 13%)',
          colorInputBackground: 'hsl(0 0% 100%)',
          colorInputText: 'hsl(220 13% 13%)',
          borderRadius: '0.5rem',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
