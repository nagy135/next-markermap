import { signIn, signOut } from "next-auth/react";
import { useContext } from "react";
import { GuestContext } from "../contexts/guest-context";
import { useMockSession } from "../hooks/session-mock";

export default function Login() {
  const { data: session } = useMockSession();
  const { setGuest } = useContext(GuestContext);

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button className="btn btn-primary" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <div className="container items-center mt-[30vh] mx-auto max-w-xl flex flex-col">
      <h1 className="text-6xl font-extrabold mb-5 text-center">Welcome</h1>
      <div className="flex">
        <button
          className="btn btn-accent shadow-lg w-64 mx-auto mr-2"
          onClick={() => signIn()}
        >
          Sign in
        </button>
        <button
          className="btn btn-info shadow-lg max-w-sm mx-auto"
          onClick={() => setGuest(true)}
        >
          Guest
        </button>
      </div>
    </div>
  );
}
