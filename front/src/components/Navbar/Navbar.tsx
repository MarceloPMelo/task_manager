import React, { useRef, useState, useEffect } from 'react'
import './Navbar.css'
import { useUser } from '../../context/UserContext';
import MiniTela from './miniTela'
import axios from "axios";

interface NavbarProps {
  onSearch?: (query: string) => void
  userName?: string
  onUserClick?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [isHoveringUser, setIsHoveringUser] = useState(false)
  const [miniPos, setMiniPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const { user, setUser } = useUser();
  const userBtnRef = useRef<HTMLButtonElement | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  const handleEnter = () => {
    setIsHoveringUser(true)
    const rect = userBtnRef.current?.getBoundingClientRect()
    if (rect) {
      setMiniPos({ top: rect.bottom + 8, left: rect.right - 260 })
    }
  }

  const handleLeave = () => {
    setIsHoveringUser(false)
  }

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()

    try{

      const response = await axios.post(
        "http://localhost:8080/auth/logout",
        {withCredentials : true}
      )
      const data = response.data;
      console.log(data);
      console.log("User antes(Logout): ", user);

      // Atualiza o contexto
      setUser({ name: '', email: '' });

    } catch (error: any) {
      if (error.response) {
        console.error("Erro no logout:", error.response.status, error.response.data);
      } else {
        console.error("Erro no logout:", error.message);
      }
    } 
    
  }

  // 👀 Monitorar mudanças no user
    useEffect(() => {
      if (user) {
        console.log("User atualizado no contexto(Login):", user);
      }
    }, [user]);

  const avatarLetter = (user?.name?.[0] ?? 'U').toUpperCase()
  const displayName = user?.name || 'Usuário'

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-logo" aria-label="Task Manager Home">
          <span className="logo-mark">🗂️</span>
          <span className="logo-text">TaskManager</span>
        </a>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSubmit} className="navbar-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tasks..."
            className="search-input"
            aria-label="Buscar tasks"
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>
      </div>

      <div className="navbar-right">
        <button type="button" className="logout-button" onClick={handleLogout}>Sair</button>
        <div
          className="user-area"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <button ref={userBtnRef} className="user-button" aria-label="Informações do usuário">
            <span className="user-avatar">{avatarLetter}</span>
            <span className="user-name">{displayName}</span>
          </button>
        </div>
      </div>

      {isHoveringUser && (
        <MiniTela position={miniPos} name={user?.name} email={user?.email} />
      )}
    </header>
  )
}

export default Navbar 