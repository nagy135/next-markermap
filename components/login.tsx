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
    <div className="flex flex-col">
      <h1 className="text-6xl mb-5">Welcome</h1>
      <button className="btn btn-primary" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

