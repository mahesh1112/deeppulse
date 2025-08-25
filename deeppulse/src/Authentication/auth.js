import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  // Sign up
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) console.error(error)
    else console.log("Signed up:", data)
  }

  // Sign in
  const handleSignin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) console.error(error)
    else setUser(data.user)
  }

  // Sign out
  const handleSignout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div>
      {!user ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={handleSignin}>Sign In</button>
        </>
      ) : (
        <>
          <p>Welcome {user.email}</p>
          <button onClick={handleSignout}>Sign Out</button>
        </>
      )}
    </div>
  )
}
