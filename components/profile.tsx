import { signOut } from "next-auth/react";
import { useMockSession } from "../hooks/session-mock";
import Image from "next/image";

export default function Profile() {
  const { data: session } = useMockSession();
  if (session) {
    return (
      <div className="absolute z-[9000] border border-2 rounded border-slate-500 p-2 flex right-1 top-1 justify-end">
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
  }
  return <> Never happens! </>;
}
