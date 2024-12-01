import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from 'virtual:generated-pages-react';
import Layout from './components/layout';
import Copilot from './components/copilot';
import DefaultPage from './artifacts/default';
import './App.css'

function App() {
  const customRoutes = [
    { path: '/', element: <Layout><DefaultPage /></Layout> },
    { path: '/copilot', element: <Layout><Copilot /></Layout> },
    ...routes.map((route) => ({
      ...route,
      element: <Layout>{route.element}</Layout>,
    })),
  ];

  const element = useRoutes(customRoutes);
  return element;
}

export default App;
