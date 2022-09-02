import { signOut } from "next-auth/react";
import { useMockSession } from "../hooks/session-mock";
import Image from "next/image";
import { useContext } from "react";
import { GuestContext } from "../contexts/guest-context";

export default function Profile() {
  const { data: session } = useMockSession();
  const { guest, setGuest } = useContext(GuestContext);
  if (session) {
    return (
      <div className="absolute z-[9000] border-2 bg-slate-400 bg-opacity-75 rounded border-slate-500 p-2 flex right-1 top-1 justify-end">
        <div className="flex flex-col mb-4">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={"100%"}
              height={"100%"}
            />
          ) : null}
          <span className="font-bold text-center">{session.user?.name}</span>
          <button
            className="btn btn-secondary btn-xs mt-1"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  } else if (guest) {
    return (
      <div className="absolute z-[9000] border-2 bg-slate-400 bg-opacity-75 rounded border-slate-500 p-2 flex right-1 top-1 justify-end">
        <div className="flex flex-col mb-4">
          <span className="font-bold text-center">Guest</span>
          <button
            className="btn btn-secondary btn-xs mt-1"
            onClick={() => setGuest(false)}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }
  return <> Never happens! </>;
}
