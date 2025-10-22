import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import type { ReactNode } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/store"

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/validate", {
          withCredentials: true, // necessário para enviar cookies HttpOnly
        });

        const data = await response.data;
        console.log("Dados recebidos da validação:", data);

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User atualizado no contexto (ProtectedRoute):", user);
    }
  }, [user]);

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
