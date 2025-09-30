// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
