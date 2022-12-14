import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { GuestContext } from "../contexts/guest-context";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [guest, setGuest] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <GuestContext.Provider value={{ guest, setGuest }}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </GuestContext.Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
