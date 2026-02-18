'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()

  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/')
      } else {
        fetchBookmarks()
      }
    }

    checkSession()
  }, [router])

  const fetchBookmarks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })

    if (!error && data) {
      setBookmarks(data)
    }
  }


  const addBookmark = async () => {
    if (!title || !url) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("User not found")
      return
    }

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,   // 🔥 VERY IMPORTANT
      },
    ])

    if (error) {
      console.log("Insert Error:", error)
      alert("Error adding bookmark")
    } else {
      setTitle('')
      setUrl('')
      fetchBookmarks()
    }
  }

  const deleteBookmark = async (id: number) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>My Bookmarks</h2>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />

          <button style={styles.addBtn} onClick={addBookmark}>
            Add Bookmark
          </button>
        </div>

        <div style={styles.list}>
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} style={styles.item}>
              <div>
                <strong>{bookmark.title}</strong>
                <br />
                <a href={bookmark.url} target="_blank">
                  {bookmark.url}
                </a>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteBookmark(bookmark.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
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
    width: '550px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  addBtn: {
    padding: '10px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  list: {
    marginTop: '25px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
}
