import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import Reports from './Pages/Relatorios';
import ReportDetail from './Pages/ReportDetail';
import VitalSigns from './Pages/SinaisVitais';
import Activities from './Pages/Atividades';
import Nutrition from './Pages/Alimentacao';
import Register from './Pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/relatorios',
    element: <Reports />,
  },
  {
    path: '/relatorio/:id',
    element: <ReportDetail />,
  },
  {
    path: '/sinais-vitais',
    element: <VitalSigns />,
  },
  {
    path: '/atividades',
    element: <Activities />,
  },
  {
    path: '/alimentacao',
    element: <Nutrition />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
]);
