import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import type { ReactNode } from 'react'
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser, setLoading } = useUser();
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/validate", {
          withCredentials: true, // 👈 necessário para enviar cookies HttpOnly
        });

        const data = await response.data;
        console.log("Dados recebidos da validação:", data);
        
        setUser({ name: data.name, email: data.email });
        console.log("Usuário definido no contexto:", { name: data.name, email: data.email });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  // Enquanto valida → mostrar loading (ou spinner)
  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  // Se não autenticado → manda pro login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado → renderiza o componente protegido
  return <>{children}</>;
};

export default ProtectedRoute;
