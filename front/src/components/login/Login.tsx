import React, { useState, useEffect } from 'react'
import './Login.css'
import axios from "axios";
import { useUser } from '../../context/UserContext';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;
      console.log("Login realizado:", data);
      console.log("User antes(Login): ", user);

      // Atualiza o contexto
      setUser({ name: data.name, email: data.email });

    } catch (error: any) {
      if (error.response) {
        console.error("Erro no login:", error.response.status, error.response.data);
      } else {
        console.error("Erro:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 👀 Monitorar mudanças no user
  useEffect(() => {
    if (user) {
      console.log("User atualizado no contexto(Login):", user);
    }
  }, [user]);

  return (
    <div className="login-container">
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
