// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import Reports from './Pages/Relatorios';
import VitalSigns from './Pages/SinaisVitais';
import Activities from './Pages/Atividades';
import Nutrition from './Pages/Alimentacao';
import Register from './Pages/Register';
import Login from './Pages/Login';
import { RequireAuth } from './components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/relatorios',
    element: (
      <RequireAuth>
        <Reports />
      </RequireAuth>
    ),
  },
  {
    path: '/sinais-vitais',
    element: (
      <RequireAuth>
        <VitalSigns />
      </RequireAuth>
    ),
  },
  {
    path: '/atividades',
    element: (
      <RequireAuth>
        <Activities />
      </RequireAuth>
    ),
  },
  {
    path: '/alimentacao',
    element: (
      <RequireAuth>
        <Nutrition />
      </RequireAuth>
    ),
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
