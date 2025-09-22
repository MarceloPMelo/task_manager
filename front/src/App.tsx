// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
