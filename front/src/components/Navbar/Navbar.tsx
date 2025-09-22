import React, { useState } from 'react'
import './Navbar.css'

interface NavbarProps {
  onSearch?: (query: string) => void
  userName?: string
  onUserClick?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, userName = 'Usuário', onUserClick }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

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
        <button className="user-button" onClick={onUserClick} aria-label="Informações do usuário">
          <span className="user-avatar">{userName?.[0]?.toUpperCase() || 'U'}</span>
          <span className="user-name">{userName}</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar 