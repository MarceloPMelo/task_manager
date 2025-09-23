import React from 'react'
import { createPortal } from 'react-dom'
import './miniTela.css'

interface MiniTelaProps {
  name?: string
  email?: string
  position: { top: number; left: number }
}

const MiniTela: React.FC<MiniTelaProps> = ({ name, email, position }) => {
  const content = (
    <div
      className="user-popover"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 2000,
      }}
    >
      <div className="user-popover-header">Perfil</div>
      <div className="user-popover-body">
        <div className="user-popover-row"><span className="label">Nome</span><span className="value">{name || '—'}</span></div>
        <div className="user-popover-row"><span className="label">Email</span><span className="value">{email || '—'}</span></div>
      </div>
      <div className="user-popover-footer">
        <a href="/profile" className="popover-link">Ver perfil</a>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

export default MiniTela 