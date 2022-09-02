import Head from "next/head";
import React, { useContext } from "react";
import { GuestContext } from "../contexts/guest-context";
import { useMockSession } from "../hooks/session-mock";
import Login from "./login";

interface ILayout {
  children?: JSX.Element;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const { data: session } = useMockSession();
  const { guest } = useContext(GuestContext);
  return (
    <div>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@2.17.0/dist/full.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com" defer></script>
        <title>MarkerMap</title>
        <meta
          name="description"
          content="View mountain achievements of your friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{!session && !guest ? <Login /> : children}</main>
    </div>
  );
};

export default Layout;
