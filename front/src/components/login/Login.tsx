import React, { useState, useEffect } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../store/userSlice';
import type { RootState, AppDispatch } from '@/store';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate('/');
    } else {
      const errorMessage =
        typeof result.payload === "string"
          ? result.payload 
          : "Falha ao fazer login";
      setFeedback({ type: "error", message: errorMessage });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 3500)
    return () => clearTimeout(t)
  }, [feedback])


  useEffect(() => {
    if (user) {
      console.log("User atualizado no contexto(Login):", user);
    }
  }, [user]);

  return (
    <div className="login-container">
      {!!feedback && (
        <div className={`login-toast ${feedback.type}`} role="status" aria-live="polite">
          <div className="toast-icon">
            {feedback.type === 'success' ? '✔' : '⚠'}
          </div>
          <div className="toast-content">
            <div className="toast-title">{feedback.type === 'success' ? 'Sucesso' : 'Atenção'}</div>
            <div className="toast-message">{feedback.message}</div>
          </div>
        </div>
      )}
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">Faça login em sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Lembrar de mim
            </label>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta?
            <a href="/register" className="signup-link"> Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
