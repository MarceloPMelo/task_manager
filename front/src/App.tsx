// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ContactRegister from "./pages/ContactRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from 'react-redux';
import { store } from './store';

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Route path="/contacts/register" element={<ContactRegister />}></Route>
        </Routes>
      </Provider>
    </ThemeProvider>

  );
}

export default App;
