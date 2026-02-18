'use client'

import { supabase } from '@/lib/supabase'

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Smart Bookmark App</h1>
        <button style={styles.button} onClick={loginWithGoogle}>
          Login with Google
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
  },
  card: {
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
}
