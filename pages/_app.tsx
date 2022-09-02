import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { GuestContext } from "../contexts/guest-context";
import { useState } from "react";


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [guest, setGuest] = useState(false);
  return (
    <GuestContext.Provider value={{guest, setGuest}}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </GuestContext.Provider>
  );
}

export default MyApp;
