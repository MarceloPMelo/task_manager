// src/context/UserContext.tsx
import { createContext, useContext, useState } from "react";

type User = {
  name: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (u: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
