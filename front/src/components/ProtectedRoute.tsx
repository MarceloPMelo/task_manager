import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from 'react'
import { userService } from "@/services/userService";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const validateToken = async () => {
      const response = await userService.validate();
      console.log("Dados recebidos da validação:", response.data);

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
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
    console.log("Usuário não autenticado (ProtectedRoute)");
    return <Navigate to="/login" replace />;
  }

  // Se autenticado → renderiza o componente protegido
  console.log("Usuário autenticado (ProtectedRoute)");
  return <>{children}</>;
};

export default ProtectedRoute;
