import { useSession, signIn, signOut } from "next-auth/react"
import { useMockSession } from "../hooks/session-mock"

export default function Login() {
  const { data: session } = useMockSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button className="btn btn-primary" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div className="container items-center mt-[30vh] mx-auto max-w-xl flex flex-col">
      <h1 className="text-6xl font-extrabold mb-5 text-center">Welcome</h1>
      <button className="btn btn-accent shadow-lg max-w-sm mx-auto" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

